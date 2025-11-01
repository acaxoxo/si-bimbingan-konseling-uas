import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_bimbingan_konseling");
      
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.userEmail = decoded.email;
      
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(` User connected: ${socket.userEmail} (${socket.userRole}) - Socket ID: ${socket.id}`);

    const userRoom = `user_${socket.userId}`;
    const roleRoom = `role_${socket.userRole}`;
    
    socket.join(userRoom);
    socket.join(roleRoom);

    console.log(` User ${socket.userId} joined rooms: ${userRoom}, ${roleRoom}`);

    socket.on("mark_notification_read", async (data) => {
      try {
        const { notificationId } = data;
        console.log(` Marking notification ${notificationId} as read by user ${socket.userId}`);

        socket.emit("notification_marked_read", { notificationId, success: true });
      } catch (error) {
        console.error("Error marking notification as read:", error);
        socket.emit("notification_marked_read", { notificationId: data.notificationId, success: false });
      }
    });

    socket.on("get_unread_count", async () => {
      try {
        const Notification = require("../models/NotificationModel");
        const count = await Notification.count({
          where: {
            user_id: socket.userId,
            is_read: false,
          },
        });
        
        socket.emit("unread_count", { count });
      } catch (error) {
        console.error("Error getting unread count:", error);
        socket.emit("unread_count", { count: 0 });
      }
    });

    socket.on("disconnect", () => {
      console.log(` User disconnected: ${socket.userEmail} - Socket ID: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  console.log(" Socket.io initialized successfully");
  
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const emitToUser = (userId, event, data) => {
  try {
    const io = getIO();
    const room = `user_${userId}`;
    io.to(room).emit(event, data);
    console.log(` Emitted '${event}' to user ${userId}:`, data);
  } catch (error) {
    console.error(`Error emitting to user ${userId}:`, error.message);
  }
};

export const emitToRole = (role, event, data) => {
  try {
    const io = getIO();
    const room = `role_${role}`;
    io.to(room).emit(event, data);
    console.log(` Emitted '${event}' to role ${role}:`, data);
  } catch (error) {
    console.error(`Error emitting to role ${role}:`, error.message);
  }
};

export const emitToAll = (event, data) => {
  try {
    const io = getIO();
    io.emit(event, data);
    console.log(` Broadcasted '${event}' to all users:`, data);
  } catch (error) {
    console.error("Error broadcasting:", error.message);
  }
};

