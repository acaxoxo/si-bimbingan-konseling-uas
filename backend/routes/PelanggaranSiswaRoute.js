import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  getAllPelanggaranSiswa,
  getPelanggaranSiswaById,
  createPelanggaranSiswa,
  updatePelanggaranSiswa,
  deletePelanggaranSiswa,
} from "../controllers/PelanggaranSiswaController.js";
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

router.get("/", getAllPelanggaranSiswa);

router.get(
  "/:id",
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  getPelanggaranSiswaById
);

router.post(
  "/",
  [
    body("siswaId")
      .isInt({ gt: 0 })
      .withMessage("ID siswa wajib dan harus berupa angka positif"),
    body("jenisPelanggaranId")
      .isInt({ gt: 0 })
      .withMessage("ID jenis pelanggaran wajib dan harus berupa angka positif"),
    body("guruId")
      .optional({ nullable: true })
      .isInt({ gt: 0 })
      .withMessage("ID guru harus berupa angka positif"),
    body("catatan_konseling").optional().trim(),
    body("tanggal_pelanggaran")
      .notEmpty()
      .withMessage("Tanggal pelanggaran wajib diisi")
      .isISO8601()
      .withMessage("Format tanggal pelanggaran tidak valid (YYYY-MM-DD)"),
    body("status_konseling")
      .optional()
      .isIn(["Belum", "Sedang", "Selesai"])
      .withMessage("Status konseling tidak valid"),
  ],
  validate,
  createPelanggaranSiswa
);

router.put(
  "/:id",
  [
    param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
    body("status_konseling")
      .optional()
      .isIn(["Belum", "Sedang", "Selesai"])
      .withMessage("Status konseling tidak valid"),
  ],
  validate,
  updatePelanggaranSiswa
);

router.delete(
  "/:id",
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  deletePelanggaranSiswa
);

export default router;
