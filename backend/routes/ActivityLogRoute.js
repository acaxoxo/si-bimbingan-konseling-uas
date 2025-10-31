import express from "express";
import {
  getAllActivityLogs,
  getActivityLogById,
  getActivityStats,
  deleteOldLogs,
} from "../controllers/ActivityLogController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

// Semua route memerlukan authentication
router.use(verifyToken);

// Get all logs dengan pagination dan filter
router.get("/"/", getAllActivityLogs);

// Get statistics
router.get("/stats", getActivityStats);

// Get log by ID
router.get("/:id", getActivityLogById);

// Delete old logs (admin only)
router.delete("/cleanup", deleteOldLogs);

export default router;
