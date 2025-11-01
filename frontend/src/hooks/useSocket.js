import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export function useSocket(token) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    
    if (!token) {
      return;
    }

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

    socket.on("connect", () => {
      console.log(" Socket connected:", socket.id);
      setIsConnected(true);

      socket.emit("get_unread_count");
    });

    socket.on("disconnect", (reason) => {
      console.log(" Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error(" Socket connection error:", error.message);
      setIsConnected(false);

      if (error.message.includes("Authentication")) {
        toast.error("Autentikasi socket gagal. Silakan login ulang.");
      }
    });

    socket.on("new_notification", (notification) => {
      console.log(" New notification received:", notification);

      setNotifications((prev) => [notification, ...prev]);

      setUnreadCount((prev) => prev + 1);

      toast.info(notification.title, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      playNotificationSound();
    });

    socket.on("notification_marked_read", ({ notificationId, success }) => {
      if (success) {
        console.log(` Notification ${notificationId} marked as read`);

        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    });

    socket.on("unread_count", ({ count }) => {
      console.log(` Unread count: ${count}`);
      setUnreadCount(count);
    });

    return () => {
      console.log(" Disconnecting socket...");
      socket.disconnect();
    };
  }, [token]);

  const markAsRead = (notificationId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("mark_notification_read", { notificationId });
    }
  };

  const refreshUnreadCount = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("get_unread_count");
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {
        
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
