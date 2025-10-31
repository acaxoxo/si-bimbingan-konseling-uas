import Notification from "../models/NotificationModel.js";
import { getPaginationParams, paginateResponse } from "../utils/pagination.js";
import { Op } from "sequelize";
import sequelize from "sequelize";

/**
 * Get all notifications untuk user tertentu (with pagination & filters)
 */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { page, limit, offset } = getPaginationParams(req);
    const { type, isRead, startDate, endDate } = req.query;

    // Build where clause
    const whereClause = {
      user_id: userId,
      user_role: userRole,
    };

    // Filter by type
    if (type) {
      whereClause.type = type;
    }

    // Filter by read status
    if (isRead !== undefined) {
      whereClause.is_read = isRead === "true";
    }

    // Filter by date range
    if (startDate || endDate) {
      whereClause.created_at = {};
      if (startDate) {
        whereClause.created_at[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.created_at[Op.lte] = new Date(endDate);
      }
    }

    const { count, rows } = await Notification.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    res.json(paginateResponse(rows, page, limit, count));
  } catch (error) {
    console.error("Error getting user notifications:", error);
    res.status(500).json({ 
      message: "Gagal mengambil notifikasi", 
      error: error.message 
    });
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });

    res.json({ count });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ 
      message: "Gagal menghitung notifikasi belum dibaca", 
      error: error.message 
    });
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: {
        id_notification: id,
        user_id: userId,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    }

    await notification.update({
      is_read: true,
      read_at: new Date(),
    });

    res.json({ 
      message: "Notifikasi berhasil ditandai sebagai dibaca",
      notification 
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ 
      message: "Gagal menandai notifikasi", 
      error: error.message 
    });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.update(
      {
        is_read: true,
        read_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          is_read: false,
        },
      }
    );

    res.json({ 
      message: "Semua notifikasi berhasil ditandai sebagai dibaca",
      updatedCount: result[0]
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ 
      message: "Gagal menandai semua notifikasi", 
      error: error.message 
    });
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: {
        id_notification: id,
        user_id: userId,
      },
    });

    if (!notification) {
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    }

    await notification.destroy();

    res.json({ message: "Notifikasi berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ 
      message: "Gagal menghapus notifikasi", 
      error: error.message 
    });
  }
};

/**
 * Delete all read notifications
 */
export const deleteAllRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.destroy({
      where: {
        user_id: userId,
        is_read: true,
      },
    });

    res.json({ 
      message: "Notifikasi yang sudah dibaca berhasil dihapus",
      deletedCount: result
    });
  } catch (error) {
    console.error("Error deleting read notifications:", error);
    res.status(500).json({ 
      message: "Gagal menghapus notifikasi", 
      error: error.message 
    });
  }
};

/**
 * Get notification statistics
 */
export const getNotificationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalCount = await Notification.count({
      where: { user_id: userId },
    });

    const unreadCount = await Notification.count({
      where: { user_id: userId, is_read: false },
    });

    const readCount = await Notification.count({
      where: { user_id: userId, is_read: true },
    });

    // Count by type
    const typeStats = await Notification.findAll({
      where: { user_id: userId },
      attributes: [
        "type",
        [sequelize.fn("COUNT", sequelize.col("id_notification")), "count"],
      ],
      group: ["type"],
      raw: true,
    });

    res.json({
      total: totalCount,
      unread: unreadCount,
      read: readCount,
      byType: typeStats,
    });
  } catch (error) {
    console.error("Error getting notification stats:", error);
    res.status(500).json({ 
      message: "Gagal mengambil statistik notifikasi", 
      error: error.message 
    });
  }
};

/**
 * Send test notification (for testing purposes)
 */
export const sendTestNotification = async (req, res) => {
  try {
    const { createNotification } = await import("../services/notificationService.js");

    await createNotification({
      userId: req.user.id,
      userRole: req.user.role,
      title: "Test Notification",
      message: `This is a test notification sent at ${new Date().toLocaleString("id-ID")}`,
      type: "system",
      sendEmailNotification: false,
    });

    res.json({ message: "Test notification sent successfully" });
  } catch (error) {
    console.error("Error sending test notification:", error);
    res.status(500).json({ 
      message: "Gagal mengirim test notifikasi", 
      error: error.message 
    });
  }
};

export default {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  getNotificationStats,
  sendTestNotification
};
