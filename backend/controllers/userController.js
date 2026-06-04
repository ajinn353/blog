import Blog from "../models/Blog.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const publicUserFields = "name profileImage coverImage createdAt";

export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(`${publicUserFields} following`);
  if (!user) return res.status(404).json({ message: "User not found" });

  const [posts, following, followers] = await Promise.all([
    Blog.find({ author: user._id, status: "published" })
      .populate("author", "name profileImage")
      .populate("category", "name slug")
      .sort({ createdAt: -1 }),
    User.find({ _id: { $in: user.following } }).select(publicUserFields).sort({ name: 1 }),
    User.find({ following: user._id }).select(publicUserFields).sort({ name: 1 })
  ]);

  const currentFollowing = req.user?.following?.map((id) => id.toString()) || [];

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      createdAt: user.createdAt,
      followersCount: followers.length,
      followingCount: following.length,
      isSelf: req.user?._id?.toString() === user._id.toString(),
      isFollowing: currentFollowing.includes(user._id.toString())
    },
    posts,
    followers,
    following
  });
});
