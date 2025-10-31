#!/usr/bin/env node
import db from "../config/database.js";
import bcrypt from "bcrypt";
import Admin from "../models/AdminModel.js";
import Guru from "../models/GuruModel.js";
import Siswa from "../models/SiswaModel.js";
import OrangTua from "../models/OrangTuaModel.js";
import Kelas from "../models/KelasModel.js";
// NOTE: We used to call register(), but register expects fewer fields and some models
// require many NOT NULL columns. To reliably create test users for development,
// we create model instances directly with sensible defaults.

// Helper to simulate express req/res
const run = async () => {
  try {
    console.log("Connecting to database...");
    await db.authenticate();
    console.log("Database connected.");
    await db.sync({ alter: false });

    // Ensure there's at least one kelas for siswa
    let kelas = await Kelas.findOne();
    if (!kelas) {
      kelas = await Kelas.create({ nama_kelas: "Kelas A" });
      console.log("Created default kelas:", kelas.nama_kelas);
    }

    // Admin
    const adminEmail = "admin123@gmail.com";
    const existingAdmin = await Admin.findOne({ where: { email_admin: adminEmail } });
    if (existingAdmin) {
      console.log(`Admin ${adminEmail} already exists, skipping.`);
    } else {
      await Admin.create({ nama_admin: "Admin Seed", email_admin: adminEmail, password: "admin123" });
      console.log(`Created admin ${adminEmail}`);
    }

    // Siswa
    const siswaEmail = "siswa123@gmail.com";
    const existingSiswa = await Siswa.findOne({ where: { email_siswa: siswaEmail } });
    if (existingSiswa) {
      console.log(`Siswa ${siswaEmail} already exists, skipping.`);
    } else {
      // Don't hash here - let the model beforeCreate hook handle it
      await Siswa.create({
        nama_siswa: "Siswa Seed",
        nis: "SISWA123",
        kelas_id: kelas.id_kelas,
        jenis_kelamin: "Laki-laki",
        tempat_lahir: "Kota",
        tanggal_lahir: "2008-01-01",
        no_telepon: "081234567890",
        email_siswa: siswaEmail,
        password: "siswa123",
      });
      console.log(`Created siswa ${siswaEmail}`);
    }

    // Orang Tua
    const ortuEmail = "ortu123@gmail.com";
    const existingOrtu = await OrangTua.findOne({ where: { email_ayah: ortuEmail } });
    if (existingOrtu) {
      console.log(`OrangTua ${ortuEmail} already exists, skipping.`);
    } else {
      // Don't hash here - let the model beforeCreate hook handle it
      await OrangTua.create({
        nama_ayah: "Bapak Seed",
        nama_ibu: "Ibu Seed",
        email_ayah: ortuEmail,
        password: "ortu123",
      });
      console.log(`Created orangtua ${ortuEmail}`);
    }

    // Guru
    const guruEmail = "guru123@gmail.com";
    const existingGuru = await Guru.findOne({ where: { email_guru: guruEmail } });
    if (existingGuru) {
      console.log(`Guru ${guruEmail} already exists, skipping.`);
    } else {
      // Don't hash here - let the model beforeCreate hook handle it
      await Guru.create({
        nama_guru: "Guru Seed",
        nik: "GURU123",
        email_guru: guruEmail,
        no_telepon: "081198765432",
        password: "guru123",
        status_aktif: "Aktif",
      });
      console.log(`Created guru ${guruEmail}`);
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message || err);
    process.exit(1);
  }
};

run();
