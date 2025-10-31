import cron from "node-cron";
import { exec } from "child_process";
import fs from "fs";
const fsPromises = fs.promises;
import path from "path";
import archiver from "archiver";
import util from "util";
const execPromise = util.promisify(exec);

// Backup configuration
const BACKUP_DIR = path.join(process.cwd(), "backups");
const BACKUP_RETENTION_DAYS = 7; // Keep backups for 7 days
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "db_konseling";

/**
 * Ensure backup directory exists
 */
const ensureBackupDir = async () => {
  try {
    await fsPromises.access(BACKUP_DIR);
  } catch {
    await fsPromises.mkdir(BACKUP_DIR, { recursive: true });
    console.log(`📁 Created backup directory: ${BACKUP_DIR}`);
  }
};

/**
 * Create database backup using mysqldump
 */
const createDatabaseBackup = async () => {
  try {
    await ensureBackupDir();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFileName = `backup_${DB_NAME}_${timestamp}.sql`;
    const backupFilePath = path.join(BACKUP_DIR, backupFileName);

    // Build mysqldump command
    const mysqldumpCmd = `mysqldump -h ${DB_HOST} -u ${DB_USER} ${
      DB_PASSWORD ? `-p${DB_PASSWORD}` : ""
    } ${DB_NAME} > "${backupFilePath}"`;

    console.log(`⏳ Starting database backup: ${backupFileName}...`);
    
    await execPromise(mysqldumpCmd);

    // Get file stats
    const stats = await fsPromises.stat(backupFilePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`✅ Database backup created successfully: ${backupFileName} (${fileSizeMB} MB)`);

    // Optionally compress the backup
    const zipFilePath = await compressBackup(backupFilePath);

    return {
      success: true,
      fileName: backupFileName,
      filePath: backupFilePath,
      zipPath: zipFilePath,
      fileSize: stats.size,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("❌ Error creating database backup:", error.message);
    throw error;
  }
};

/**
 * Compress backup file to .zip
 */
const compressBackup = async (sqlFilePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const zipFilePath = sqlFilePath.replace(".sql", ".zip");
      const output = require("fs").createWriteStream(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        const sizeMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
        console.log(`🗜️  Compressed backup: ${path.basename(zipFilePath)} (${sizeMB} MB)`);
        
        // Delete original SQL file after compression
        fsPromises.unlink(sqlFilePath).catch(() => {});
        
        resolve(zipFilePath);
      });

      archive.on("error", (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.file(sqlFilePath, { name: path.basename(sqlFilePath) });
      await archive.finalize();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Restore database from backup file
 */
const restoreDatabaseBackup = async (backupFilePath) => {
  try {
    // Check if file exists
    await fsPromises.access(backupFilePath);

    console.log(`⏳ Restoring database from: ${path.basename(backupFilePath)}...`);

    // If it's a zip file, extract it first
    let sqlFilePath = backupFilePath;
    if (backupFilePath.endsWith(".zip")) {
      sqlFilePath = await extractBackup(backupFilePath);
    }

    // Build mysql restore command
    const mysqlCmd = `mysql -h ${DB_HOST} -u ${DB_USER} ${
      DB_PASSWORD ? `-p${DB_PASSWORD}` : ""
    } ${DB_NAME} < "${sqlFilePath}"`;

    await execPromise(mysqlCmd);

    console.log(`✅ Database restored successfully from: ${path.basename(backupFilePath)}`);

    // Clean up extracted SQL file if it was from zip
    if (backupFilePath.endsWith(".zip") && sqlFilePath !== backupFilePath) {
      await fsPromises.unlink(sqlFilePath).catch(() => {});
    }

    return {
      success: true,
      fileName: path.basename(backupFilePath),
      restoredAt: new Date(),
    };
  } catch (error) {
    console.error("❌ Error restoring database:", error.message);
    throw error;
  }
};

/**
 * Extract zip backup file
 */
const extractBackup = async (zipFilePath) => {
  return new Promise((resolve, reject) => {
    const extract = require("extract-zip");
    const outputDir = path.dirname(zipFilePath);

    extract(zipFilePath, { dir: outputDir })
      .then(() => {
        const sqlFileName = path.basename(zipFilePath).replace(".zip", ".sql");
        const sqlFilePath = path.join(outputDir, sqlFileName);
        console.log(`📦 Extracted backup: ${sqlFileName}`);
        resolve(sqlFilePath);
      })
      .catch(reject);
  });
};

/**
 * List all available backups
 */
const listBackups = async () => {
  try {
    await ensureBackupDir();
    
    const files = await fsPromises.readdir(BACKUP_DIR);
    const backupFiles = files.filter(
      (file) => file.startsWith("backup_") && (file.endsWith(".sql") || file.endsWith(".zip"))
    );

    const backupList = await Promise.all(
      backupFiles.map(async (file) => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = await fsPromises.stat(filePath);
        
        return {
          fileName: file,
          filePath: filePath,
          size: stats.size,
          sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
          createdAt: stats.birthtime,
          isCompressed: file.endsWith(".zip"),
        };
      })
    );

    // Sort by creation date (newest first)
    backupList.sort((a, b) => b.createdAt - a.createdAt);

    return backupList;
  } catch (error) {
    console.error("Error listing backups:", error.message);
    throw error;
  }
};

/**
 * Delete old backups (cleanup)
 */
const cleanupOldBackups = async () => {
  try {
    const backups = await listBackups();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - BACKUP_RETENTION_DAYS);

    let deletedCount = 0;

    for (const backup of backups) {
      if (backup.createdAt < cutoffDate) {
        await fsPromises.unlink(backup.filePath);
        console.log(`🗑️  Deleted old backup: ${backup.fileName}`);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`✅ Cleanup completed: ${deletedCount} old backup(s) deleted`);
    } else {
      console.log(`ℹ️  No old backups to delete (retention: ${BACKUP_RETENTION_DAYS} days)`);
    }

    return { deletedCount, retentionDays: BACKUP_RETENTION_DAYS };
  } catch (error) {
    console.error("Error cleaning up old backups:", error.message);
    throw error;
  }
};

/**
 * Delete specific backup
 */
const deleteBackup = async (fileName) => {
  try {
    const filePath = path.join(BACKUP_DIR, fileName);
    await fsPromises.unlink(filePath);
    console.log(`🗑️  Deleted backup: ${fileName}`);
    return { success: true, fileName };
  } catch (error) {
    console.error(`Error deleting backup ${fileName}:`, error.message);
    throw error;
  }
};

/**
 * Schedule automatic backups using cron
 * Default: Every day at 2 AM
 */
const scheduleAutomaticBackups = () => {
  const cronSchedule = process.env.BACKUP_CRON_SCHEDULE || "0 2 * * *";

  cron.schedule(cronSchedule, async () => {
    console.log("🕒 Scheduled backup started...");
    try {
      await createDatabaseBackup();
      await cleanupOldBackups();
    } catch (error) {
      console.error("❌ Scheduled backup failed:", error.message);
    }
  });

  console.log(`⏰ Automatic backup scheduled: ${cronSchedule} (cron format)`);
};

export {
  createDatabaseBackup,
  restoreDatabaseBackup,
  listBackups,
  cleanupOldBackups,
  deleteBackup,
  scheduleAutomaticBackups,
};
