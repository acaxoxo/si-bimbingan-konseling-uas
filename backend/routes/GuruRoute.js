import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";
import { body, param, validationResult } from "express-validator";
import {
  getAllGuru,
  getGuruById,
  createGuru,
  updateGuru,
  deleteGuru,
} from "../controllers/GuruController.js";

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
  getAllGuru
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "guru", "siswa", "orangtua"),
  [
    param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  ],
  validate,
  getGuruById
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  [
    body("nama_guru").trim().notEmpty().withMessage("Nama guru wajib diisi"),
    body("nik")
      .trim()
      .notEmpty()
      .withMessage("NIK wajib diisi")
      .isLength({ min: 8 })
      .withMessage("NIK minimal 8 karakter"),
    body("jabatan").optional().isString().withMessage("Jabatan harus teks"),
    body("status_aktif")
      .optional()
      .isIn(["Aktif", "Nonaktif"])
      .withMessage("Status harus 'Aktif' atau 'Nonaktif'"),
  ],
  validate,
  createGuru
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  [
    param("id").isInt({ gt: 0 }).withMessage("ID tidak valid"),
    body("nama_guru").optional().isString().withMessage("Nama harus teks"),
    body("jabatan").optional().isString().withMessage("Jabatan harus teks"),
    body("status_aktif")
      .optional()
      .isIn(["Aktif", "Nonaktif"])
      .withMessage("Status tidak valid"),
  ],
  validate,
  updateGuru
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  [
    param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  ],
  validate,
  deleteGuru
);

export default router;
