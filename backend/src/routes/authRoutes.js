import express from "express"
import { registerUser, loginUser } from "../controllers/authController.js"
import { loginLimiter } from "../middleware/rateLimiter.js";
import { googleAuth } from "../controllers/authController.js";

const router = express.Router()

router.post("/register", registerUser)
router.post("/google", googleAuth);
router.post("/login", loginLimiter, loginUser)

export default router