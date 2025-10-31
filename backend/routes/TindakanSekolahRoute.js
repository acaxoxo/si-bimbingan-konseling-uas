import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  getAllTindakan,
  getTindakanById,
  createTindakan,
  updateTindakan,
  deleteTindakan,
} from "../controllers/TindakanSekolahController.js";
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

router.get("/tindakan", getAllTindakan);

router.get(
  "/tindakan/:id",
  [param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif")],
  validate,
  getTindakanById
);

router.post(
  "/tindakan",
  [
    body("id_pelanggaran")
      .isInt({ gt: 0 })
      .withMessage("ID pelanggaran harus berupa angka positif"),
    body("deskripsi_tindakan")
      .trim()
      .notEmpty()
      .withMessage("Deskripsi tindakan wajib diisi")
      .isLength({ min: 5 })
      .withMessage("Deskripsi minimal 5 karakter"),
    body("tanggal_tindakan")
      .optional()
      .isISO8601()
      .withMessage("Tanggal tindakan tidak valid"),
    body("penanggung_jawab")
      .trim()
      .notEmpty()
      .withMessage("Penanggung jawab wajib diisi"),
  ],
  validate,
  createTindakan
);

router.put(
  "/tindakan/:id",
  [
    param("id").isInt({ gt: 0 }).withMessage("ID tidak valid"),
    body("deskripsi_tindakan")
      .optional()
      .trim()
      .isLength({ min: 5 })
      .withMessage("Deskripsi tindakan minimal 5 karakter"),
    body("penanggung_jawab")
      .optional()
      .trim()
      .isString()
      .withMessage("Penanggung jawab harus berupa teks"),
  ],
  validate,
  updateTindakan
);

router.delete(
  "/tindakan/:id",
  [param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif")],
  validate,
  deleteTindakan
);

export default router;
