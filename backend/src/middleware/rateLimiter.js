import rateLimit from "express-rate-limit"

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 requests per IP
  message: {
    message: "Too many login attempts. Please try again after 1 minute."
  },
  standardHeaders: true,
  legacyHeaders: false
})