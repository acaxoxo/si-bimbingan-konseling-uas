import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  getAllOrangTua,
  getOrangTuaById,
  createOrangTua,
  updateOrangTua,
  deleteOrangTua,
} from "../controllers/OrangTuaController.js";
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

router.get("/", getAllOrangTua);

router.get(
  "/:id",
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  getOrangTuaById
);

router.post(
  "/",
  [
    body("nama_ayah").notEmpty().withMessage("Nama ayah wajib diisi"),
    body("nama_ibu").notEmpty().withMessage("Nama ibu wajib diisi"),
    body("email_ayah")
      .optional()
      .isEmail()
      .withMessage("Format email ayah tidak valid"),
    body("email_ibu")
      .optional()
      .isEmail()
      .withMessage("Format email ibu tidak valid"),
    body("no_telepon_ayah")
      .optional()
      .isMobilePhone("id-ID")
      .withMessage("Nomor telepon ayah tidak valid"),
    body("no_telepon_ibu")
      .optional()
      .isMobilePhone("id-ID")
      .withMessage("Nomor telepon ibu tidak valid"),
  ],
  validate,
  createOrangTua
);

router.put(
  "/:id",
  [
    param("id").isInt().withMessage("ID tidak valid"),
    body("nama_ayah").optional().isString(),
    body("nama_ibu").optional().isString(),
    body("email_ayah").optional().isEmail(),
    body("email_ibu").optional().isEmail(),
  ],
  validate,
  updateOrangTua
);

router.delete(
  "/:id",
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  deleteOrangTua
);

export default router;
