/**
 * Migration Script: Add Unique Constraints
 * Menambahkan UNIQUE constraints untuk mencegah data duplikat
 * 
 * Run with: node backend/migrations/addUniqueConstraints.js
 */

import db from '../config/database.js';

const addUniqueConstraints = async () => {
  try {
    console.log('🔧 Adding unique constraints to database...\n');

    // 1. Siswa - NIS unique
    console.log('Adding UNIQUE constraint to siswa.nis...');
    await db.query(`
      ALTER TABLE siswa 
      ADD UNIQUE INDEX unique_nis (nis)
    `);
    console.log('✅ siswa.nis - DONE\n');

    // 2. Siswa - Email unique (if not null)
    console.log('Adding UNIQUE constraint to siswa.email_siswa...');
    await db.query(`
      ALTER TABLE siswa 
      ADD UNIQUE INDEX unique_email_siswa (email_siswa)
    `);
    console.log('✅ siswa.email_siswa - DONE\n');

    // 3. Guru - NIK unique
    console.log('Adding UNIQUE constraint to guru.nik...');
    await db.query(`
      ALTER TABLE guru 
      ADD UNIQUE INDEX unique_nik_guru (nik)
    `);
    console.log('✅ guru.nik - DONE\n');

    // 4. Guru - Email unique
    console.log('Adding UNIQUE constraint to guru.email_guru...');
    await db.query(`
      ALTER TABLE guru 
      ADD UNIQUE INDEX unique_email_guru (email_guru)
    `);
    console.log('✅ guru.email_guru - DONE\n');

    // 5. Orang Tua - NIK Ayah unique
    console.log('Adding UNIQUE constraint to orang_tua.nik_ayah...');
    await db.query(`
      ALTER TABLE orang_tua 
      ADD UNIQUE INDEX unique_nik_ayah (nik_ayah)
    `);
    console.log('✅ orang_tua.nik_ayah - DONE\n');

    // 6. Orang Tua - NIK Ibu unique
    console.log('Adding UNIQUE constraint to orang_tua.nik_ibu...');
    await db.query(`
      ALTER TABLE orang_tua 
      ADD UNIQUE INDEX unique_nik_ibu (nik_ibu)
    `);
    console.log('✅ orang_tua.nik_ibu - DONE\n');

    // 7. Orang Tua - Email Ayah unique
    console.log('Adding UNIQUE constraint to orang_tua.email_ayah...');
    await db.query(`
      ALTER TABLE orang_tua 
      ADD UNIQUE INDEX unique_email_ayah (email_ayah)
    `);
    console.log('✅ orang_tua.email_ayah - DONE\n');

    // 8. Orang Tua - Email Ibu unique
    console.log('Adding UNIQUE constraint to orang_tua.email_ibu...');
    await db.query(`
      ALTER TABLE orang_tua 
      ADD UNIQUE INDEX unique_email_ibu (email_ibu)
    `);
    console.log('✅ orang_tua.email_ibu - DONE\n');

    // 9. Kelas - Nama Kelas unique
    console.log('Adding UNIQUE constraint to kelas.nama_kelas...');
    await db.query(`
      ALTER TABLE kelas 
      ADD UNIQUE INDEX unique_nama_kelas (nama_kelas)
    `);
    console.log('✅ kelas.nama_kelas - DONE\n');

    // 10. Jenis Pelanggaran - Nama unique
    console.log('Adding UNIQUE constraint to jenis_pelanggaran.nama_jenis_pelanggaran...');
    await db.query(`
      ALTER TABLE jenis_pelanggaran 
      ADD UNIQUE INDEX unique_nama_pelanggaran (nama_jenis_pelanggaran)
    `);
    console.log('✅ jenis_pelanggaran.nama_jenis_pelanggaran - DONE\n');

    // 11. Admin - Email unique
    console.log('Adding UNIQUE constraint to admin.email_admin...');
    await db.query(`
      ALTER TABLE admin 
      ADD UNIQUE INDEX unique_email_admin (email_admin)
    `);
    console.log('✅ admin.email_admin - DONE\n');

    console.log('🎉 All unique constraints added successfully!');
    console.log('\n⚠️ Note: If any constraint fails, it means:');
    console.log('   1. The constraint already exists (OK)');
    console.log('   2. There are duplicate values in the table (FIX MANUALLY)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding constraints:', error.message);
    
    if (error.message.includes('Duplicate entry')) {
      console.error('\n⚠️ Found duplicate data! Clean it first before adding constraints.');
    }
    if (error.message.includes('Duplicate key name')) {
      console.error('\n⚠️ Constraint already exists. Skipping...');
    }
    
    process.exit(1);
  }
};

// Run migration
addUniqueConstraints();
