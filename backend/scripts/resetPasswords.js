#!/usr/bin/env node
import db from "../config/database.js";
import bcrypt from "bcrypt";
import Admin from "../models/AdminModel.js";
import Guru from "../models/GuruModel.js";
import Siswa from "../models/SiswaModel.js";
import OrangTua from "../models/OrangTuaModel.js";

const accounts = [
  { role: "admin", emailField: "email_admin", model: Admin, email: "admin123@gmail.com", password: "admin123" },
  { role: "guru", emailField: "email_guru", model: Guru, email: "guru123@gmail.com", password: "guru123" },
  { role: "siswa", emailField: "email_siswa", model: Siswa, email: "siswa123@gmail.com", password: "siswa123" },
  { role: "orangtua", emailField: "email_ayah", model: OrangTua, email: "ortu123@gmail.com", password: "ortu123" },
];

const run = async () => {
  try {
    console.log("Connecting to database...");
    await db.authenticate();
    console.log("Database connected.");
    
    const queries = [
      `ALTER TABLE guru ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL;`,
      `ALTER TABLE siswa ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL;`,
      `ALTER TABLE orang_tua ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL;`,
    ];
    for (const q of queries) {
      try {
        await db.query(q);
        console.log("Executed:", q);
      } catch (err) {
        
        console.log("Skipping or error executing query:", q, err.message);
      }
    }

    for (const acc of accounts) {
      const { model, emailField, email, password, role } = acc;
      console.log(`\nProcessing ${role} (${email})`);
      const where = {};
      where[emailField] = email;
      const instance = await model.findOne({ where });
      if (!instance) {
        console.log(`${role} with email ${email} not found.`);
        continue;
      }
      const hashed = await bcrypt.hash(password, 10);
      
      await model.update({ password: hashed }, { where });
      console.log(`Password for ${role} (${email}) updated.`);
    }

    console.log("Password reset complete.");
    process.exit(0);
  } catch (err) {
    console.error("Password reset failed:", err.message || err);
    process.exit(1);
  }
};

run();
