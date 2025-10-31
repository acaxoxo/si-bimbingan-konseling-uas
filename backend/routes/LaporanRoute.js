import express from "express";
import { query, validationResult } from "express-validator";
import { 
  getLaporanSekolah, 
  getLaporanAnak,
  getDashboardStats,
  getLaporanPelanggaran,
  getAnalisisPoinPerSiswa,
  getAnalisisPoinPerKelas
} from "../controllers/LaporanController.js";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";
const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validasi gagal",
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

router.get("/laporan",
  verifyToken,
  authorizeRoles("admin", "guru"),
  [
    query("tanggal_mulai")
      .optional()
      .isISO8601()
      .withMessage("Format tanggal_mulai tidak valid (gunakan YYYY-MM-DD)"),
    query("tanggal_akhir")
      .optional()
      .isISO8601()
      .withMessage("Format tanggal_akhir tidak valid (gunakan YYYY-MM-DD)"),
    query("kelas_id")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("kelas_id harus berupa angka positif"),
    query("siswa_id")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("siswa_id harus berupa angka positif"),
  ],
  validate,
  getLaporanSekolah
);

// Laporan khusus orang tua untuk anak yang terhubung dengan akun tersebut
router.get("/anak",
  verifyToken,
  authorizeRoles("orangtua"),
  validate,
  getLaporanAnak
);

  // Dashboard statistics
  router.get("/dashboard-stats",
    verifyToken,
    authorizeRoles("admin"),
    getDashboardStats
  );

  // Get laporan with filters
  router.get("/pelanggaran",
    verifyToken,
    authorizeRoles("admin", "guru"),
    [
      query("startDate").optional().isISO8601().withMessage("Format startDate tidak valid"),
      query("endDate").optional().isISO8601().withMessage("Format endDate tidak valid"),
      query("periode").optional().isIn(['bulanan', 'semester', 'tahunan']).withMessage("Periode harus: bulanan, semester, atau tahunan"),
      query("kelasId").optional().isInt({ gt: 0 }).withMessage("kelasId harus angka positif"),
      query("kategori").optional().isIn(['Ringan', 'Sedang', 'Berat']).withMessage("Kategori harus: Ringan, Sedang, atau Berat"),
    ],
    validate,
    getLaporanPelanggaran
  );

  // Analisis poin per siswa
  router.get("/analisis-siswa",
    verifyToken,
    authorizeRoles("admin", "guru"),
    [
      query("kelasId").optional().isInt({ gt: 0 }).withMessage("kelasId harus angka positif"),
    ],
    validate,
    getAnalisisPoinPerSiswa
  );

  // Analisis poin per kelas
  router.get("/analisis-kelas",
    verifyToken,
    authorizeRoles("admin", "guru"),
    getAnalisisPoinPerKelas
  );

export default router;
