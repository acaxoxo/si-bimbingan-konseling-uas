import db from "../config/database.js";
import Admin from "../models/AdminModel.js";
import bcrypt from "bcrypt";

const fixAdminPassword = async () => {
  try {
    await db.sync();
    
    const email = "heraa123@gmail.com";
    const newPassword = "password123"; // Ganti dengan password yang diinginkan
    
    console.log(`\nMencari admin dengan email: ${email}`);
    const admin = await Admin.findOne({ where: { email_admin: email } });
    
    if (!admin) {
      console.log("❌ Admin tidak ditemukan!");
      await db.close();
      return;
    }
    
    console.log("✅ Admin ditemukan:", {
      id: admin.id_admin,
      nama: admin.nama_admin,
      email: admin.email_admin
    });
    
    // Update password dengan raw password (akan di-hash oleh hook)
    await admin.update({ password: newPassword });
    
    console.log(`\n✅ Password berhasil direset!`);
    console.log(`Email: ${email}`);
    console.log(`Password baru: ${newPassword}`);
    console.log(`\nSilakan login dengan kredensial di atas.`);
    
    await db.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await db.close();
    process.exit(1);
  }
};

fixAdminPassword();
