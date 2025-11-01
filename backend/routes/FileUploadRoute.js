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

router.use(verifyToken);

router.post("/upload", uploadSingle, uploadFile);

router.post("/upload-multiple", uploadMultiple, uploadMultipleFiles);

router.get("/", getAllFiles);

router.get("/:id", getFileById);

router.get("/:id/download", downloadFile);

router.delete("/:id", deleteFile);

export default router;
