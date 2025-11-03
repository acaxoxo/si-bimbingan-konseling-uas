import db from "../config/database.js";

async function checkColumn() {
  try {
    const [results] = await db.query("DESCRIBE jenis_pelanggaran");
    console.log("\n=== jenis_pelanggaran table structure ===");
    console.table(results);
    
    const [sample] = await db.query("SELECT * FROM jenis_pelanggaran LIMIT 1");
    console.log("\n=== Sample row ===");
    console.log(sample[0]);
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkColumn();
