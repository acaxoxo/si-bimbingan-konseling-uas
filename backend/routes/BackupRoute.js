import express from "express";
const router = express.Router();
import BackupController from "../controllers/BackupController.js";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";

router.use(verifyToken);
router.use(authorizeRoles("admin"));

router.post("/create", BackupController.createBackup);

router.post("/restore", BackupController.restoreBackup);

router.get("/list", BackupController.listAllBackups);

router.get("/download/:fileName", BackupController.downloadBackup);

router.delete("/:fileName", BackupController.deleteBackupFile);

router.post("/cleanup", BackupController.cleanupBackups);

export default router;
