import express from "express";
import {
  getAllActivityLogs,
  getActivityLogById,
  getActivityStats,
  deleteOldLogs,
} from "../controllers/ActivityLogController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.use(verifyToken);

router.get("/"/", getAllActivityLogs);

router.get("/stats", getActivityStats);

router.get("/:id", getActivityLogById);

router.delete("/cleanup", deleteOldLogs);

export default router;
