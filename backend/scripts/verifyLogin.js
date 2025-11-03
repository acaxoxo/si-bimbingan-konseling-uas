import db from "../config/database.js";
import Admin from "../models/AdminModel.js";
import bcrypt from "bcrypt";

const verifyLogin = async () => {
  try {
    await db.sync();
    
    const email = "heraa123@gmail.com";
    const passwordToTest = "password123";
    
    console.log(`\n🔍 Verifikasi Login untuk: ${email}\n`);
    
    const admin = await Admin.findOne({ where: { email_admin: email } });
    
    if (!admin) {
      console.log("❌ Admin tidak ditemukan!");
      await db.close();
      return;
    }
    
    console.log("✅ Admin ditemukan:");
    console.log(`   ID: ${admin.id_admin}`);
    console.log(`   Nama: ${admin.nama_admin}`);
    console.log(`   Email: ${admin.email_admin}`);
    console.log(`   Password Hash: ${admin.password.substring(0, 30)}...`);
    
    // Test password
    console.log(`\n🔐 Testing password: "${passwordToTest}"`);
    const isValid = await bcrypt.compare(passwordToTest, admin.password);
    
    if (isValid) {
      console.log("✅ Password COCOK! Login seharusnya berhasil.");
    } else {
      console.log("❌ Password TIDAK COCOK! Login akan gagal.");
      console.log("\n💡 Solusi:");
      console.log("   1. Pastikan menggunakan password: password123");
      console.log("   2. Atau jalankan ulang: node scripts/fixAdminPassword.js");
    }
    
    await db.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await db.close();
    process.exit(1);
  }
};

verifyLogin();
