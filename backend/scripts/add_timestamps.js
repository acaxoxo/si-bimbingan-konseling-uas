import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const { default: db } = await import('../config/database.js');

async function run() {
  try {
    console.log('Connecting to DB...');
    await db.authenticate();
    console.log('Connected. Running ALTER TABLE statements...');

    const tables = ['guru', 'orang_tua', 'siswa', 'kelas', 'jenis_pelanggaran'];

    for (const t of tables) {
      const sql = `ALTER TABLE \`${t}\` 
        ADD COLUMN IF NOT EXISTS createdAt DATETIME NULL,
        ADD COLUMN IF NOT EXISTS updatedAt DATETIME NULL,
        ADD COLUMN IF NOT EXISTS deletedAt DATETIME NULL;`;
      console.log('Running for', t);
      await db.query(sql);
    }

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

run();
