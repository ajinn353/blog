import Blog from "../models/Blog.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUrl } from "../middleware/upload.js";
import { createUniqueSlug } from "../utils/slug.js";

const canMutateBlog = (blog, user) => blog.author.toString() === user.id || user.role === "admin";

const blogQuery = (req) => {
  const { search, category, tag, filter, status } = req.query;
  const query = req.user?.role === "admin" && status ? { status } : { status: "published" };

  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (tag) query.tags = { $in: [tag] };

  let sort = { createdAt: -1 };
  if (filter === "most-viewed") sort = { views: -1 };
  if (filter === "most-liked") sort = { likes: -1 };

  return { query, sort };
};

export const getBlogs = asyncHandler(async (req, res) => {
  const { query, sort } = blogQuery(req);
  const blogs = await Blog.find(query)
    .populate("author", "name profileImage")
    .populate("category", "name slug")
    .sort(sort)
    .limit(Number(req.query.limit) || 30);

  res.json(blogs);
});

export const getMyBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id })
    .populate("category", "name slug")
    .sort({ updatedAt: -1 });
  res.json(blogs);
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug })
    .populate("author", "name profileImage createdAt")
    .populate("category", "name slug");

  if (!blog) return res.status(404).json({ message: "Blog not found" });

  if (blog.status !== "published" && (!req.user || !canMutateBlog(blog, req.user))) {
    return res.status(403).json({ message: "This blog is not public" });
  }

  blog.views += 1;
  await blog.save();
  res.json(blog);
});

export const createBlog = asyncHandler(async (req, res) => {
  const status = req.body.status === "published" ? "pending" : "draft";
  const blog = await Blog.create({
    ...blogFields(req.body),
    tags: parseTags(req.body.tags),
    author: req.user._id,
    slug: await createUniqueSlug(req.body.title),
    thumbnailImage: fileUrl(req, req.file),
    status,
    metaTitle: req.body.metaTitle || req.body.title,
    metaDescription: req.body.metaDescription || req.body.shortDescription
  });

  res.status(201).json(blog);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  if (!canMutateBlog(blog, req.user)) return res.status(403).json({ message: "Not allowed" });

  const titleChanged = req.body.title && req.body.title !== blog.title;
  const requestedStatus = req.body.status || blog.status;
  const nextStatus =
    requestedStatus === "published" && req.user.role !== "admin" && blog.status !== "published"
      ? "pending"
      : requestedStatus;
  Object.assign(blog, {
    ...blogFields(req.body),
    tags: req.body.tags ? parseTags(req.body.tags) : blog.tags,
    thumbnailImage: req.file ? fileUrl(req, req.file) : blog.thumbnailImage,
    status: nextStatus,
    metaTitle: req.body.metaTitle || req.body.title || blog.metaTitle,
    metaDescription: req.body.metaDescription || req.body.shortDescription || blog.metaDescription
  });

  if (titleChanged) {
    blog.slug = await createUniqueSlug(req.body.title, blog._id);
  }

  await blog.save();
  res.json(blog);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  if (!canMutateBlog(blog, req.user)) return res.status(403).json({ message: "Not allowed" });

  await blog.deleteOne();
  res.json({ message: "Blog deleted" });
});

export const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const likes = blog.likes.map(String);
  blog.likes = likes.includes(req.user.id)
    ? blog.likes.filter((id) => id.toString() !== req.user.id)
    : [...blog.likes, req.user._id];

  await blog.save();
  res.json({ likesCount: blog.likes.length, liked: blog.likes.map(String).includes(req.user.id) });
});

export const bookmarkBlog = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const bookmarks = user.bookmarks.map(String);
  user.bookmarks = bookmarks.includes(req.params.id)
    ? user.bookmarks.filter((id) => id.toString() !== req.params.id)
    : [...user.bookmarks, req.params.id];

  await user.save();
  res.json({ bookmarks: user.bookmarks });
});

const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  return String(tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const blogFields = (body) => {
  const allowed = [
    "title",
    "shortDescription",
    "content",
    "category",
    "featuredImagePlacement",
    "featuredImageSize",
    "metaTitle",
    "metaDescription"
  ];

  return allowed.reduce((fields, key) => {
    if (body[key] !== undefined) fields[key] = body[key];
    return fields;
  }, {});
};
