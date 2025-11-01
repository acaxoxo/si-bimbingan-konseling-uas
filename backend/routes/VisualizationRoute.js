import express from "express";
const router = express.Router();
import VisualizationController from "../controllers/VisualizationController.js";
import { verifyToken } from "../middleware/verifyToken.js";

router.use(verifyToken);

router.get("/trend-monthly", VisualizationController.getPelanggaranTrendPerBulan);

router.get("/kelas-comparison", VisualizationController.getKelasComparison);

router.get("/category-comparison", VisualizationController.getCategoryComparison);

router.get("/top-violators", VisualizationController.getTopViolators);

export default router;
