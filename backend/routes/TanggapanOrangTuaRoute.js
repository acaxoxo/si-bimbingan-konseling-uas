import express from "express";
import { body, param, validationResult } from "express-validator";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";
import {
  getAllTanggapan,
  getTanggapanById,
  createTanggapan,
  updateTanggapan,
  deleteTanggapan,
} from "../controllers/TanggapanOrangTuaController.js";

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

// Base path is mounted at /api/tanggapan
router.get("/", getAllTanggapan);

router.get(
  "/:id",
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  getTanggapanById
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("orangtua"),
  [
    body("pelanggaranSiswaId")
      .isInt({ gt: 0 })
      .withMessage("pelanggaranSiswaId harus angka positif"),
    body("isi_tanggapan")
      .trim()
      .notEmpty()
      .withMessage("isi_tanggapan tidak boleh kosong")
      .isLength({ min: 5 })
      .withMessage("isi_tanggapan minimal 5 karakter"),
    body("tindakan_rumah").optional().isString(),
  ],
  validate,
  createTanggapan
);

router.put(
  "/:id",
  [
    param("id").isInt({ gt: 0 }).withMessage("ID tidak valid"),
    body("isi_tanggapan")
      .optional()
      .trim()
      .isLength({ min: 5 })
      .withMessage("isi_tanggapan minimal 5 karakter"),
  ],
  validate,
  updateTanggapan
);

router.delete(
  "/:id",
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  deleteTanggapan
);

export default router;