import db from "../config/database.js";

async function checkData() {
  try {
    console.log("\n=== Active jenis_pelanggaran records ===\n");
    
    const [active] = await db.query(`
      SELECT 
        id_jenis_pelanggaran,
        nama_jenis_pelanggaran,
        tindakan_sekolah,
        deletedAt
      FROM jenis_pelanggaran
      WHERE deletedAt IS NULL
      ORDER BY id_jenis_pelanggaran DESC
      LIMIT 5
    `);
    
    console.log(`Found ${active.length} active records:\n`);
    active.forEach(row => {
      console.log(`ID: ${row.id_jenis_pelanggaran}`);
      console.log(`Nama: ${row.nama_jenis_pelanggaran}`);
      console.log(`Tindakan Sekolah: ${row.tindakan_sekolah || '(empty/null)'}`);
      console.log(`DeletedAt: ${row.deletedAt || 'NULL (active)'}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkData();
