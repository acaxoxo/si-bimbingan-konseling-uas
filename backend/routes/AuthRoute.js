import express from "express";
import { register, login, logout, refresh } from "../controllers/AuthController.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
const isProd = process.env.NODE_ENV === "production";

router.post("/register", isProd ? registerLimiter : (req, _res, next) => next(), register);
router.post("/login", isProd ? loginLimiter : (req, _res, next) => next(), login);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
