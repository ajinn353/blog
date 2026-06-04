import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUrl } from "../middleware/upload.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authResponse = (user) => ({
  user,
  token: signToken(user._id)
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });

  if (exists) return res.status(409).json({ message: "Email is already registered" });

  const user = await User.create({ name, email, password, profileImage: fileUrl(req, req.file) });
  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (user.isBlocked) return res.status(403).json({ message: "Your account is blocked" });

  res.json(authResponse(user));
});

export const googleLogin = asyncHandler(async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(501).json({ message: "Google login is not configured" });
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: req.body.credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();

  const user = await User.findOneAndUpdate(
    { email: payload.email },
    {
      name: payload.name,
      email: payload.email,
      profileImage: payload.picture,
      provider: "google",
      $setOnInsert: { password: `${payload.sub}-${Date.now()}` }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (user.isBlocked) return res.status(403).json({ message: "Your account is blocked" });
  res.json(authResponse(user));
});

export const profile = asyncHandler(async (req, res) => {
  const [user, followers] = await Promise.all([
    User.findById(req.user._id)
    .populate("bookmarks", "title slug thumbnailImage shortDescription createdAt views status")
      .populate("following", "name email profileImage coverImage role createdAt"),
    User.find({ following: req.user._id }).select("name email profileImage coverImage role createdAt").sort({ name: 1 })
  ]);

  res.json({ ...user.toObject(), followers, followersCount: followers.length });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profileFile = req.files?.profileImage?.[0] || req.file;
  const coverFile = req.files?.coverImage?.[0];
  const updates = {
    name: req.body.name || req.user.name,
    profileImage: profileFile ? fileUrl(req, profileFile) : req.user.profileImage,
    coverImage: coverFile ? fileUrl(req, coverFile) : req.user.coverImage
  };

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json(user);
});

export const followUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ message: "You cannot follow yourself" });
  const user = await User.findById(req.user._id);
  const following = user.following.map(String);

  user.following = following.includes(req.params.id)
    ? user.following.filter((id) => id.toString() !== req.params.id)
    : [...user.following, req.params.id];

  await user.save();
  res.json({ following: user.following });
});
