import express from "express";
import { getPublicProfile } from "../controllers/userController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", optionalAuth, getPublicProfile);

export default router;
