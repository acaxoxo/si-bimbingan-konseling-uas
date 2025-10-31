import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import db from "./config/database.js";
import "./models/associations.js"; // Import associations

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

// CORS configuration
// Development CORS settings
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',  // Vite default
      'http://localhost:3000',  // Alternative development port
      process.env.FRONTEND_URL  // Production URL
    ].filter(Boolean); // Remove undefined/null values
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Serve static files (uploaded files)
app.use('/uploads', express.static('uploads'));

// Apply rate limiting to all API routes
app.use("/api/", apiLimiter);

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected successfully.");
  // Sync models to DB. Use plain sync without `alter` to avoid unexpected
  // ALTER TABLE statements during dev that can fail on complex schemas.
  // If you need to alter schema in development, run targeted migrations or
  // enable `alter` manually for a short period.
  await db.sync();
    console.log("Semua model berhasil disinkronisasi.");
    
    // Initialize Socket.io
    initSocket(server);
    
    // Verify email configuration (non-blocking)
    verifyEmailConfig();
    
    // Schedule automatic backups (every day at 2 AM by default)
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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket ready on ws://localhost:${PORT}`);
});