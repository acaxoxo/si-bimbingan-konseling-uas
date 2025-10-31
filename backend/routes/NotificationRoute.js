import express from "express";
const router = express.Router();
import NotificationController from "../controllers/NotificationController.js";
import { verifyToken } from "../middleware/verifyToken.js";
// All routes require authentication
router.use(verifyToken);

// Get user's notifications (with pagination & filters)
router.get("/", NotificationController.getUserNotifications);

// Get unread count
router.get("/unread-count", NotificationController.getUnreadCount);

// Get notification statistics
router.get("/stats", NotificationController.getNotificationStats);

// Mark single notification as read
router.patch("/:id/read", NotificationController.markAsRead);

// Mark all notifications as read
router.patch("/read-all", NotificationController.markAllAsRead);

// Delete single notification
router.delete("/:id", NotificationController.deleteNotification);

// Delete all read notifications
router.delete("/read/all", NotificationController.deleteAllRead);

// Send test notification (for development/testing)
router.post("/test", NotificationController.sendTestNotification);

export default router;
