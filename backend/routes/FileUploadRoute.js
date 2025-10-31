import express from "express";
import {
  uploadFile,
  uploadMultipleFiles,
  getAllFiles,
  getFileById,
  downloadFile,
  deleteFile,
} from "../controllers/FileUploadController.js";
import { uploadSingle, uploadMultiple } from "../middleware/upload.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Upload single file
router.post("/upload", uploadSingle, uploadFile);

// Upload multiple files
router.post("/upload-multiple", uploadMultiple, uploadMultipleFiles);

// Get all files with pagination
router.get("/", getAllFiles);

// Get file by ID
router.get("/:id", getFileById);

// Download file
router.get("/:id/download", downloadFile);

// Delete file
router.delete("/:id", deleteFile);

export default router;
