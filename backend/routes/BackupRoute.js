import express from "express";
const router = express.Router();
import BackupController from "../controllers/BackupController.js";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";
// All routes require authentication + admin role only
router.use(verifyToken);
router.use(authorizeRoles("admin"));

// Create manual backup
router.post("/create", BackupController.createBackup);

// Restore from backup
router.post("/restore", BackupController.restoreBackup);

// List all backups
router.get("/list", BackupController.listAllBackups);

// Download backup file
router.get("/download/:fileName", BackupController.downloadBackup);

// Delete backup file
router.delete("/:fileName", BackupController.deleteBackupFile);

// Cleanup old backups
router.post("/cleanup", BackupController.cleanupBackups);

export default router;
