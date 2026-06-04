import express from "express";
import { addComment, deleteComment, getComments, updateComment } from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, addComment);
router.get("/:blogId", getComments);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;
