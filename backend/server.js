import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import db from "./config/database.js";
import "./models/associations.js"; 

dotenv.config();
import GuruRoute from "./routes/GuruRoute.js";
import KelasRoute from "./routes/KelasRoute.js";
import SiswaRoute from "./routes/SiswaRoute.js";
import OrangTuaRoute from "./routes/OrangTuaRoute.js";
import AdminRoute from "./routes/AdminRoute.js";
import JenisPelanggaranRoute from "./routes/JenisPelanggaranRoute.js";
import PelanggaranSiswaRoute from "./routes/PelanggaranSiswaRoute.js";
import TanggapanRoute from "./routes/TanggapanOrangTuaRoute.js";
import TindakanRoute from "./routes/TindakanSekolahRoute.js";
import LaporanRoute from "./routes/LaporanRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import NotificationRoute from "./routes/NotificationRoute.js";
import VisualizationRoute from "./routes/VisualizationRoute.js";
import BackupRoute from "./routes/BackupRoute.js";
import SavedFilterRoute from "./routes/SavedFilterRoute.js";
import { logger } from "./middleware/logger.js";
import { authErrorHandler } from "./middleware/authErrorHandler.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { initSocket } from "./services/socketService.js";
import { verifyEmailConfig } from "./services/emailService.js";
import { scheduleAutomaticBackups } from "./services/backupService.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, only allow specific origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/uploads', express.static('uploads'));

app.use("/api/", apiLimiter);

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected successfully.");

  await db.sync();
    console.log("Semua model berhasil disinkronisasi.");

    initSocket(server);

    verifyEmailConfig();

    if (process.env.ENABLE_AUTO_BACKUP !== "false") {
      scheduleAutomaticBackups();
    }
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

app.use("/api/auth", AuthRoute);
app.use("/api/guru", GuruRoute);
app.use("/api/kelas", KelasRoute);
app.use("/api/siswa", SiswaRoute);
app.use("/api/orang-tua", OrangTuaRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/jenis-pelanggaran", JenisPelanggaranRoute);
app.use("/api/pelanggaran-siswa", PelanggaranSiswaRoute);
app.use("/api/tanggapan", TanggapanRoute);
app.use("/api/tindakan", TindakanRoute);
app.use("/api/laporan", LaporanRoute);
app.use("/api/notifications", NotificationRoute);
app.use("/api/visualization", VisualizationRoute);
app.use("/api/saved-filters", SavedFilterRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Server berjalan dengan baik",
    author: "Nada Asmarani",
    version: "1.0.0",
  });
});

app.use(authErrorHandler); 
app.use(notFound);        
app.use(errorHandler);     

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` WebSocket ready on ws://localhost:${PORT}`);
});