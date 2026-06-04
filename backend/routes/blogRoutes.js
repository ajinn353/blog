import express from "express";
import {
  bookmarkBlog,
  createBlog,
  deleteBlog,
  getBlogBySlug,
  getBlogs,
  getMyBlogs,
  likeBlog,
  updateBlog
} from "../controllers/blogController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/mine", protect, getMyBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", protect, upload.single("thumbnailImage"), createBlog);
router.put("/:id", protect, upload.single("thumbnailImage"), updateBlog);
router.delete("/:id", protect, deleteBlog);
router.post("/:id/like", protect, likeBlog);
router.post("/:id/bookmark", protect, bookmarkBlog);

export default router;
