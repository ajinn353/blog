import express from "express";
import {
  dashboard,
  deleteUser,
  getAllComments,
  getAllBlogs,
  getUsers,
  moderateBlog,
  subscribe,
  toggleBlockUser
} from "../controllers/adminController.js";
import { deleteBlog, updateBlog } from "../controllers/blogController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/newsletter", subscribe);
router.use(protect, adminOnly);
router.get("/dashboard", dashboard);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/block", toggleBlockUser);
router.get("/blogs", getAllBlogs);
router.patch("/blogs/:id/status", moderateBlog);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);
router.get("/comments", getAllComments);

export default router;
