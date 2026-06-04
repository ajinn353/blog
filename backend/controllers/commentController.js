import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ blogId: req.params.blogId })
    .populate("userId", "name profileImage")
    .sort({ createdAt: -1 });
  res.json(comments);
});

export const addComment = asyncHandler(async (req, res) => {
  const comment = await Comment.create({
    blogId: req.body.blogId,
    userId: req.user._id,
    comment: req.body.comment
  });

  await Blog.findByIdAndUpdate(req.body.blogId, { $inc: { commentsCount: 1 } });
  await comment.populate("userId", "name profileImage");
  res.status(201).json(comment);
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.userId.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed" });
  }

  comment.comment = req.body.comment;
  await comment.save();
  res.json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.userId.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed" });
  }

  await comment.deleteOne();
  await Blog.findByIdAndUpdate(comment.blogId, { $inc: { commentsCount: -1 } });
  res.json({ message: "Comment deleted" });
});
