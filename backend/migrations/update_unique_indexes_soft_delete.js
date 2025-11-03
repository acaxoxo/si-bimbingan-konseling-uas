import db from "../config/database.js";

async function run() {
  console.log("\n=== Updating unique indexes for soft-delete support ===\n");
  try {
    // Siswa: email_siswa, nis => allow reuse after soft delete
    console.log("Updating siswa unique indexes...");
    try { await db.query("ALTER TABLE siswa DROP INDEX unique_email_siswa"); } catch (e) { console.log(" - unique_email_siswa not found, skipping"); }
    try { await db.query("ALTER TABLE siswa DROP INDEX unique_nis"); } catch (e) { console.log(" - unique_nis not found, skipping"); }

    await db.query(`
      ALTER TABLE siswa
      ADD UNIQUE INDEX unique_email_siswa_active (email_siswa, deletedAt),
      ADD UNIQUE INDEX unique_nis_active (nis, deletedAt)
    `);
    console.log(" - siswa indexes updated\n");

    // Jenis Pelanggaran: nama_jenis_pelanggaran
    console.log("Updating jenis_pelanggaran unique indexes...");
    try { await db.query("ALTER TABLE jenis_pelanggaran DROP INDEX unique_nama_pelanggaran"); } catch (e) { console.log(" - unique_nama_pelanggaran not found, skipping"); }
    await db.query(`
      ALTER TABLE jenis_pelanggaran
      ADD UNIQUE INDEX unique_nama_pelanggaran_active (nama_jenis_pelanggaran, deletedAt)
    `);
    console.log(" - jenis_pelanggaran indexes updated\n");

    console.log("All indexes updated successfully.\n");
    process.exit(0);
  } catch (err) {
    console.error("Failed to update indexes:", err.message);
    process.exit(1);
  }
}

run();
