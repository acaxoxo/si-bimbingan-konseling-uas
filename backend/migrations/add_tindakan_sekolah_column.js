import db from "../config/database.js";

async function addTindakanSekolahColumn() {
  try {
    console.log("\n=== Checking jenis_pelanggaran table ===\n");
    
    // Check current structure
    const [columns] = await db.query("SHOW COLUMNS FROM jenis_pelanggaran");
    console.log("Current columns:");
    columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));
    
    const hasTindakanSekolah = columns.some(col => col.Field === 'tindakan_sekolah');
    
    if (hasTindakanSekolah) {
      console.log("\n✓ Column 'tindakan_sekolah' already exists.\n");
    } else {
      console.log("\n⚠ Column 'tindakan_sekolah' NOT FOUND. Adding it now...\n");
      
      await db.query(`
        ALTER TABLE jenis_pelanggaran
        ADD COLUMN tindakan_sekolah TEXT NULL
        AFTER deskripsi
      `);
      
      console.log("✓ Column 'tindakan_sekolah' added successfully!\n");
    }
    
    // Show a sample row
    const [sample] = await db.query("SELECT * FROM jenis_pelanggaran LIMIT 1");
    if (sample.length > 0) {
      console.log("Sample row:");
      console.log(sample[0]);
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

addTindakanSekolahColumn();
