import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

/**
 * Custom hook untuk Socket.io connection dan real-time notifications
 * 
 * @param {string} token - JWT authentication token
 * @returns {Object} - Socket instance, connection status, dan helper functions
 * 
 * @example
 * const { socket, isConnected, notifications, unreadCount } = useSocket(token);
 * 
 * useEffect(() => {
 *   if (isConnected) {
 *     console.log('Socket connected!');
 *   }
 * }, [isConnected]);
 */
export function useSocket(token) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Don't connect if no token
    if (!token) {
      return;
    }

    // Initialize Socket.io connection
    const socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
      
      // Request unread count on connect
      socket.emit("get_unread_count");
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("🔌 Socket connection error:", error.message);
      setIsConnected(false);
      
      // Show error toast only once
      if (error.message.includes("Authentication")) {
        toast.error("Autentikasi socket gagal. Silakan login ulang.");
      }
    });

    // Notification event handlers
    socket.on("new_notification", (notification) => {
      console.log("🔔 New notification received:", notification);
      
      // Add to notifications list
      setNotifications((prev) => [notification, ...prev]);
      
      // Increment unread count
      setUnreadCount((prev) => prev + 1);
      
      // Show toast notification
      toast.info(notification.title, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Play notification sound (optional)
      playNotificationSound();
    });

    socket.on("notification_marked_read", ({ notificationId, success }) => {
      if (success) {
        console.log(`📖 Notification ${notificationId} marked as read`);
        
        // Update local notifications
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        
        // Decrement unread count
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    });

    socket.on("unread_count", ({ count }) => {
      console.log(`📊 Unread count: ${count}`);
      setUnreadCount(count);
    });

    // Cleanup on unmount
    return () => {
      console.log("🔌 Disconnecting socket...");
      socket.disconnect();
    };
  }, [token]);

  /**
   * Mark notification as read
   */
  const markAsRead = (notificationId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("mark_notification_read", { notificationId });
    }
  };

  /**
   * Request unread count from server
   */
  const refreshUnreadCount = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("get_unread_count");
    }
  };

  /**
   * Play notification sound
   */
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore error if user hasn't interacted with page yet
      });
    } catch (error) {
      console.warn("Unable to play notification sound:", error);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    refreshUnreadCount,
  };
}

/**
 * Simplified hook for just connection status
 * 
 * @param {string} token - JWT token
 * @returns {Object} - Connection status and socket instance
 */
export function useSocketConnection(token) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return {
    socket: socketRef.current,
    isConnected,
  };
}

export default useSocket;
