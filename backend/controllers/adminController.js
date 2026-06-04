import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Newsletter from "../models/Newsletter.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboard = asyncHandler(async (_req, res) => {
  const [totalUsers, totalBlogs, publishedBlogs, draftBlogs, categories, comments, subscribers] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "draft" }),
    Category.countDocuments(),
    Comment.countDocuments(),
    Newsletter.countDocuments()
  ]);

  const recentBlogs = await Blog.find().populate("author", "name").sort({ createdAt: -1 }).limit(5);
  res.json({ totalUsers, totalBlogs, publishedBlogs, draftBlogs, categories, comments, subscribers, recentBlogs });
});

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
});

export const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json(user);
});

export const getAllBlogs = asyncHandler(async (_req, res) => {
  const blogs = await Blog.find().populate("author", "name").populate("category", "name").sort({ createdAt: -1 });
  res.json(blogs);
});

export const getAllComments = asyncHandler(async (_req, res) => {
  const comments = await Comment.find()
    .populate("userId", "name email")
    .populate("blogId", "title slug")
    .sort({ createdAt: -1 });
  res.json(comments);
});

export const moderateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
});

export const subscribe = asyncHandler(async (req, res) => {
  const subscriber = await Newsletter.findOneAndUpdate(
    { email: req.body.email },
    { email: req.body.email },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json(subscriber);
});
