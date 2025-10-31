import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  getAllSiswa,
  getSiswaById,
  createSiswa,
  updateSiswa,
  deleteSiswa,
} from "../controllers/SiswaController.js";
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

router.get("/", getAllSiswa);

router.get(
  "/:id",
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  getSiswaById
);

router.post(
  "/",
  [
    body("nama_siswa").notEmpty().withMessage("Nama siswa wajib diisi"),
    body("nis")
      .notEmpty()
      .withMessage("NIS wajib diisi")
      .isLength({ min: 5 })
      .withMessage("NIS minimal 5 karakter"),
    body("orangTuaId")
      .optional({ nullable: true })
      .isInt({ gt: 0 })
      .withMessage("ID orang tua harus berupa angka positif"),
    body("kelas_id")
      .isInt({ gt: 0 })
      .withMessage("ID kelas wajib dan harus berupa angka positif"),
    body("jenis_kelamin")
      .isIn(["Laki-laki", "Perempuan"])
      .withMessage("Jenis kelamin harus 'Laki-laki' atau 'Perempuan'"),
    body("tempat_lahir").notEmpty().withMessage("Tempat lahir wajib diisi"),
    body("tanggal_lahir")
      .isDate()
      .withMessage("Tanggal lahir harus berupa format tanggal yang valid"),
    body("no_telepon")
      .notEmpty()
      .withMessage("Nomor telepon wajib diisi")
      .isMobilePhone("id-ID")
      .withMessage("Nomor telepon tidak valid"),
    body("email_siswa")
      .notEmpty()
      .withMessage("Email wajib diisi")
      .isEmail()
      .withMessage("Format email tidak valid"),
  ],
  validate,
  createSiswa
);

router.put(
  "/:id",
  [
    param("id").isInt({ gt: 0 }).withMessage("ID tidak valid"),
    body("nama_siswa")
      .optional()
      .isString()
      .withMessage("Nama harus berupa teks"),
    body("jenis_kelamin")
      .optional()
      .isIn(["Laki-laki", "Perempuan"])
      .withMessage("Jenis kelamin tidak valid"),
    body("tanggal_lahir")
      .optional()
      .isDate()
      .withMessage("Format tanggal tidak valid"),
    body("no_telepon")
      .optional()
      .isMobilePhone("id-ID")
      .withMessage("Nomor telepon tidak valid"),
    body("email_siswa").optional().isEmail().withMessage("Format email tidak valid"),
  ],
  validate,
  updateSiswa
);

router.delete(
  "/:id",
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  deleteSiswa
);

export default router;
