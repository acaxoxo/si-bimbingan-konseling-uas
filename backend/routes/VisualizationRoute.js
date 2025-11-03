import express from "express";
const router = express.Router();
import VisualizationController from "../controllers/VisualizationController.js";
import { verifyToken } from "../middleware/verifyToken.js";
// All routes require authentication
router.use(verifyToken);

// Trend pelanggaran per bulan
router.get("/trend-monthly", VisualizationController.getPelanggaranTrendPerBulan);

// Perbandingan antar kelas
router.get("/kelas-comparison", VisualizationController.getKelasComparison);

// Perbandingan kategori pelanggaran
router.get("/category-comparison", VisualizationController.getCategoryComparison);

// Top violators (siswa dengan pelanggaran terbanyak)
router.get("/top-violators", VisualizationController.getTopViolators);

export default router;
