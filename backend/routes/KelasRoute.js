import express from "express";
import { body, param, validationResult } from "express-validator";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";
import {
  getAllKelas,
  getAllKelasWithGuru,
  getKelasById,
  createKelas,
  updateKelas,
  deleteKelas,
} from "../controllers/KelasController.js";

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
  getAllKelas
);

router.get(
  "/with-guru",
  verifyToken,
  authorizeRoles("admin", "guru", "siswa", "orangtua"),
  getAllKelasWithGuru
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "guru"),
  param("id").isInt({ gt: 0 }).withMessage("ID kelas harus berupa angka positif"),
  validate,
  getKelasById
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  [
    body("nama_kelas").trim().notEmpty().withMessage("Nama kelas wajib diisi"),
    body("kelas_kejuruan").optional().isString().withMessage("Kelas kejuruan tidak valid"),
    body("guruId")
      .optional({ nullable: true })
      .isInt({ gt: 0 })
      .withMessage("ID guru (guruId) harus berupa angka positif"),
  ],
  validate,
  createKelas
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  [
    param("id").isInt({ gt: 0 }).withMessage("ID kelas tidak valid"),
    body("nama_kelas")
      .optional()
      .isString()
      .withMessage("Nama kelas tidak valid"),
    body("kelas_kejuruan").optional().isString().withMessage("Kelas kejuruan tidak valid"),
    body("guruId")
      .optional({ nullable: true })
      .isInt({ gt: 0 })
      .withMessage("ID guru (guruId) harus berupa angka positif"),
  ],
  validate,
  updateKelas
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  param("id").isInt({ gt: 0 }).withMessage("ID kelas harus berupa angka positif"),
  validate,
  deleteKelas
);

export default router;
