import express from "express";
import http from "http";
import dotenv from "dotenv";
import db from "./config/database.js";
import "./models/associations.js";
import { initSocket } from "./services/socketService.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const shouldSyncDb =
  process.env.DB_SYNC === "true" || process.env.NODE_ENV === "development";

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected successfully.");

    if (shouldSyncDb) {
      await db.sync();
      console.log("Semua model berhasil disinkronisasi.");
    } else {
      console.log("DB sync dilewati (set DB_SYNC=true untuk memaksa).");
    }

    initSocket(server);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

const PORT = process.env.SOCKET_PORT || process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`);
});
