import express from "express";
import {
    getMe,
    uploadProfileImage,
    changePassword,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/me", protect, getMe);

router.put(
    "/upload",
    protect,
    upload.single("image"),
    uploadProfileImage
);

// 🔐 Change Password Route
router.put("/change-password", protect, changePassword);

export default router;