import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken.js";
import { body, param, validationResult } from "express-validator";
import {
  getAllAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/AdminController.js";
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

router.get("/", verifyToken, authorizeRoles("admin"), getAllAdmin);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  getAdminById
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  [
    body("nama_admin").trim().notEmpty().withMessage("Nama admin wajib diisi"),
    body("email_admin")
      .trim()
      .notEmpty()
      .withMessage("Email wajib diisi")
      .isEmail()
      .withMessage("Format email tidak valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password wajib diisi")
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
  ],
  validate,
  createAdmin
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  [
    param("id").isInt({ gt: 0 }).withMessage("ID tidak valid"),
    body("nama_admin")
      .optional()
      .isString()
      .withMessage("Nama admin harus berupa teks"),
    body("email_admin").optional().isEmail().withMessage("Format email tidak valid"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
  ],
  validate,
  updateAdmin
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  param("id").isInt({ gt: 0 }).withMessage("ID harus berupa angka positif"),
  validate,
  deleteAdmin
);

export default router;
