import {
  createDatabaseBackup,
  restoreDatabaseBackup,
  listBackups,
  cleanupOldBackups,
  deleteBackup,
} from "../services/backupService.js";

/**
 * Create manual database backup
 */
export const createBackup = async (req, res) => {
  try {
    const result = await createDatabaseBackup();
    
    res.json({
      message: "Database backup created successfully",
      backup: result,
    });
  } catch (error) {
    console.error("Error creating backup:", error);
    res.status(500).json({
      message: "Failed to create database backup",
      error: error.message,
    });
  }
};

/**
 * Restore database from backup
 */
export const restoreBackup = async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: "Backup file name is required" });
    }

    const backups = await listBackups();
    const backup = backups.find((b) => b.fileName === fileName);

    if (!backup) {
      return res.status(404).json({ message: "Backup file not found" });
    }

    const result = await restoreDatabaseBackup(backup.filePath);

    res.json({
      message: "Database restored successfully",
      restore: result,
    });
  } catch (error) {
    console.error("Error restoring backup:", error);
    res.status(500).json({
      message: "Failed to restore database",
      error: error.message,
    });
  }
};

/**
 * List all available backups
 */
export const listAllBackups = async (req, res) => {
  try {
    const backups = await listBackups();

    res.json({
      count: backups.length,
      backups: backups,
    });
  } catch (error) {
    console.error("Error listing backups:", error);
    res.status(500).json({
      message: "Failed to list backups",
      error: error.message,
    });
  }
};

/**
 * Download backup file
 */
export const downloadBackup = async (req, res) => {
  try {
    const { fileName } = req.params;
    const backups = await listBackups();
    const backup = backups.find((b) => b.fileName === fileName);

    if (!backup) {
      return res.status(404).json({ message: "Backup file not found" });
    }

    res.download(backup.filePath, fileName, (err) => {
      if (err) {
        console.error("Error downloading backup:", err);
        res.status(500).json({
          message: "Failed to download backup",
          error: err.message,
        });
      }
    });
  } catch (error) {
    console.error("Error in download backup:", error);
    res.status(500).json({
      message: "Failed to process download request",
      error: error.message,
    });
  }
};

/**
 * Delete specific backup
 */
/**
 * Delete a backup file
 */
export const deleteBackupFile = async (req, res) => {
  try {
    const { fileName } = req.params;
    
    const result = await deleteBackup(fileName);

    res.json({
      message: "Backup deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Error deleting backup:", error);
    res.status(500).json({
      message: "Failed to delete backup",
      error: error.message,
    });
  }
};

/**
 * Cleanup old backups
 */
export const cleanupBackups = async (req, res) => {
  try {
    const result = await cleanupOldBackups();

    res.json({
      message: "Backup cleanup completed",
      ...result,
    });
  } catch (error) {
    console.error("Error cleaning up backups:", error);
    res.status(500).json({
      message: "Failed to cleanup backups",
      error: error.message,
    });
  }
};

export default {
  createBackup,
  restoreBackup,
  listAllBackups,
  downloadBackup,
  deleteBackupFile,
  cleanupBackups,
};
