import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/AdminModel.js";
import Guru from "../models/GuruModel.js";
import Siswa from "../models/SiswaModel.js";
import OrangTua from "../models/OrangTuaModel.js";
import { Op } from "sequelize";
import ActivityLogger from "../middleware/activityLogger.js";

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validasi input
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, dan role wajib diisi.",
        missing: {
          email: !email,
          password: !password,
          role: !role
        }
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Format email tidak valid."
      });
    }

    let user;
    let userId;
    let userPassword;
    let userEmail;
    let userName;

    // Cari user berdasarkan role
    switch (role.toLowerCase()) {
      case "admin":
        user = await Admin.findOne({ where: { email_admin: email } });
        if (user) {
          userId = user.id_admin;
          userPassword = user.password;
          userEmail = user.email_admin;
          userName = user.nama_admin;
        }
        break;

      case "guru":
        user = await Guru.findOne({ where: { email_guru: email } });
        if (user) {
          userId = user.id_guru;
          userPassword = user.password;
          userEmail = user.email_guru;
          userName = user.nama_guru;
        }
        break;

      case "siswa":
        user = await Siswa.findOne({ where: { email_siswa: email } });
        if (user) {
          userId = user.id_siswa;
          userPassword = user.password;
          userEmail = user.email_siswa;
          userName = user.nama_siswa;
        }
        break;

      case "orangtua":
        user = await OrangTua.findOne({ 
          where: { [Op.or]: [{ email_ayah: email }, { email_ibu: email }] }
        });
        if (user) {
          userId = user.id_orang_tua;
          userPassword = user.password;
          userEmail = user.email_ayah || user.email_ibu;
          userName = user.nama_ayah || user.nama_ibu;
        }
        break;

      default:
        return res.status(400).json({ message: "Role tidak valid." });
    }

    // User tidak ditemukan
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email: userEmail, name: userName, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
    );

    // Log aktivitas login
    await ActivityLogger.login(req, userId, role);

    // Response sukses
    res.status(200).json({
      message: "Login berhasil.",
      token,
      user: { id: userId, email: userEmail, name: userName, role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const logout = async (req, res) => {
  try {
    
    await ActivityLogger.logout(req);

    res.status(200).json({ message: "Logout berhasil." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"]; 
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const oldToken = authHeader.split(" ")[1];
    let payload;

    try {
      // Verify token bahkan jika expired
      payload = jwt.verify(oldToken, process.env.JWT_SECRET, { ignoreExpiration: true });
    } catch (err) {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    const { id, email, role, name } = payload || {};
    
    if (!id || !email || !role) {
      return res.status(400).json({ message: "Payload token tidak lengkap" });
    }

    // Validasi user masih ada di database
    try {
      let exists = null;
      switch ((role || "").toLowerCase()) {
        case "admin":
          exists = await Admin.findOne({ where: { id_admin: id } });
          break;
        case "guru":
          exists = await Guru.findOne({ where: { id_guru: id } });
          break;
        case "siswa":
          exists = await Siswa.findOne({ where: { id_siswa: id } });
          break;
        case "orangtua":
          exists = await OrangTua.findOne({ where: { id_orang_tua: id } });
          break;
        default:
          return res.status(400).json({ message: "Role tidak valid." });
      }
      
      if (!exists) {
        return res.status(401).json({ message: "Pengguna tidak ditemukan" });
      }
    } catch (e) {
      console.error("Error validating user:", e);
      return res.status(500).json({ message: "Gagal memvalidasi pengguna" });
    }

    // Generate token baru
    const newToken = jwt.sign(
      { id, email, name, role }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
    );

    return res.status(200).json({ 
      message: "Refresh token berhasil", 
      token: newToken,
      user: { id, email, name, role }
    });
  } catch (error) {
    console.error("Refresh error:", error);
    return res.status(500).json({ 
      message: "Terjadi kesalahan pada server.", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, dan role wajib diisi.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Format email tidak valid.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password minimal 8 karakter.",
      });
    }

    if (!/[a-zA-Z]/.test(password)) {
      return res.status(400).json({
        message: "Password harus mengandung huruf.",
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        message: "Password harus mengandung angka.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    let userId;

    switch (role.toLowerCase()) {
      case "admin":
        if (await Admin.findOne({ where: { email_admin: email } })) {
          return res.status(400).json({ message: "Email sudah digunakan." });
        }
        newUser = await Admin.create({
          nama_admin: "Admin Baru",
          email_admin: email,
          password: hashedPassword,
        });
        userId = newUser.id_admin;
        break;

      case "guru":
        if (await Guru.findOne({ where: { email_guru: email } })) {
          return res.status(400).json({ message: "Email sudah digunakan." });
        }
        newUser = await Guru.create({
          nama_guru: "Guru Baru",
          email_guru: email,
          password: hashedPassword,
          status_aktif: "Aktif",
        });
        userId = newUser.id_guru;
        break;

      case "siswa":
        if (await Siswa.findOne({ where: { email_siswa: email } })) {
          return res.status(400).json({ message: "Email sudah digunakan." });
        }
        newUser = await Siswa.create({
          nama_siswa: "Siswa Baru",
          email_siswa: email,
          password: hashedPassword,
        });
        userId = newUser.id_siswa;
        break;

      case "orangtua":
        if (await OrangTua.findOne({ where: { email_ayah: email } })) {
          return res.status(400).json({ message: "Email sudah digunakan." });
        }
        newUser = await OrangTua.create({
          nama_ayah: "Orang Tua Baru",
          email_ayah: email,
          password: hashedPassword,
        });
        userId = newUser.id_orang_tua;
        break;

      default:
        return res.status(400).json({ message: "Role tidak valid." });
    }

    const token = jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "Registrasi berhasil.",
      token,
      user: { id: userId, email, role },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
};
