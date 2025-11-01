import express from "express";
const router = express.Router();
import NotificationController from "../controllers/NotificationController.js";
import { verifyToken } from "../middleware/verifyToken.js";

router.use(verifyToken);

router.get("/", NotificationController.getUserNotifications);

router.get("/unread-count", NotificationController.getUnreadCount);

router.get("/stats", NotificationController.getNotificationStats);

router.patch("/:id/read", NotificationController.markAsRead);

router.patch("/read-all", NotificationController.markAllAsRead);

router.delete("/:id", NotificationController.deleteNotification);

router.delete("/read/all", NotificationController.deleteAllRead);

router.post("/test", NotificationController.sendTestNotification);

export default router;
