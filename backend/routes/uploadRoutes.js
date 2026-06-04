import express from "express";
import { protect } from "../middleware/auth.js";
import { fileUrl, upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/image", protect, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Image file is required" });
  res.status(201).json({ url: fileUrl(req, req.file) });
});

export default router;
