import db from "../config/database.js";
import Admin from "../models/AdminModel.js";
import bcrypt from "bcrypt";

const testRegisterFlow = async () => {
  try {
    await db.sync();
    
    console.log("\n🧪 Testing Register Flow...\n");
    
    // Test 1: Simulasi register dengan raw password
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = "TestPass123";
    
    console.log("📝 Test 1: Create admin with raw password");
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword} (raw)`);
    
    const newAdmin = await Admin.create({
      nama_admin: "Test Admin",
      email_admin: testEmail,
      password: testPassword // Raw password - akan di-hash oleh hook
    });
    
    console.log(`   ✅ Admin created with ID: ${newAdmin.id_admin}`);
    console.log(`   Password hash: ${newAdmin.password.substring(0, 30)}...\n`);
    
    // Test 2: Verifikasi password bisa login
    console.log("🔐 Test 2: Verify password can be used to login");
    const savedAdmin = await Admin.findOne({ where: { email_admin: testEmail } });
    const isValid = await bcrypt.compare(testPassword, savedAdmin.password);
    
    if (isValid) {
      console.log(`   ✅ Password COCOK! Login akan berhasil.`);
    } else {
      console.log(`   ❌ Password TIDAK COCOK! Ada masalah double hashing.`);
    }
    
    // Cleanup: Hapus test admin
    await savedAdmin.destroy({ force: true });
    console.log(`   🗑️  Test admin deleted\n`);
    
    console.log("=" .repeat(50));
    console.log("✅ KESIMPULAN:");
    if (isValid) {
      console.log("   Register flow BEKERJA dengan baik!");
      console.log("   Akun baru bisa langsung login.");
      console.log("\n   💡 Jika masih error di browser:");
      console.log("   1. Pastikan backend server sudah restart");
      console.log("   2. Clear browser cache");
      console.log("   3. Cek console browser untuk error detail");
    } else {
      console.log("   ❌ MASIH ADA MASALAH double hashing!");
      console.log("   Backend server belum restart dengan code terbaru.");
    }
    console.log("=" .repeat(50));
    
    await db.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error(error);
    await db.close();
    process.exit(1);
  }
};

testRegisterFlow();
