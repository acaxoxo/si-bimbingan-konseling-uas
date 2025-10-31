import express from "express";
import { register, login, logout, refresh } from "../controllers/AuthController.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
