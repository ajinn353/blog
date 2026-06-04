import express from "express";
import { followUser, googleLogin, login, profile, register, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/profile", protect, profile);
router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  updateProfile
);
router.post("/follow/:id", protect, followUser);

export default router;
