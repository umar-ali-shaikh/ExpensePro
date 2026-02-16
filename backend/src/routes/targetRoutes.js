import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTarget,
  getTargets,
  updateTarget,
  deleteTarget
} from "../controllers/targetController.js";

const router = express.Router();

router.route("/")
  .post(protect, createTarget)
  .get(protect, getTargets);

router.route("/:id")
  .put(protect, updateTarget)
  .delete(protect, deleteTarget);

export default router;