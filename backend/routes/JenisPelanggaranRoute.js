import express from "express";
import { body, param, validationResult } from "express-validator";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";
import {
  getAllJenisPelanggaran,
  getJenisPelanggaranById,
  createJenisPelanggaran,
  updateJenisPelanggaran,
  deleteJenisPelanggaran,
} from "../controllers/JenisPelanggaranController.js";

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

router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "guru", "siswa", "orangtua"),
  getAllJenisPelanggaran
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  getJenisPelanggaranById
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  [
    body("nama_jenis_pelanggaran")
      .trim()
      .notEmpty()
      .withMessage("Nama pelanggaran wajib diisi"),
    body("kategori_pelanggaran")
      .isIn(["Ringan", "Sedang", "Berat"])
      .withMessage("Kategori harus salah satu dari: Ringan, Sedang, Berat"),
    body("poin_pelanggaran")
      .isInt({ min: 1 })
      .withMessage("Poin pelanggaran harus berupa angka dan minimal 1"),
    body("deskripsi").optional().isString(),
  ],
  validate,
  createJenisPelanggaran
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  [
    param("id").isInt({ gt: 0 }).withMessage("ID tidak valid"),
    body("nama_jenis_pelanggaran").optional().isString(),
    body("kategori_pelanggaran")
      .optional()
      .isIn(["Ringan", "Sedang", "Berat"])
      .withMessage("Kategori tidak valid"),
    body("poin_pelanggaran")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Poin pelanggaran minimal 1"),
    body("deskripsi").optional().isString(),
  ],
  validate,
  updateJenisPelanggaran
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  deleteJenisPelanggaran
);

export default router;
