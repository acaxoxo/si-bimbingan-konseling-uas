import ActivityLog from "../models/ActivityLogModel.js";

/**
 * Middleware untuk log aktivitas user
 */
export const logActivity = async (req, action, module, description) => {
  try {
    const userId = req.user?.id || null;
    const userRole = req.user?.role || "guest";
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    await ActivityLog.create({
      user_id: userId,
      user_role: userRole,
      action,
      module,
      description,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (error) {
    // Log error but don't break the main flow
    console.error("Error logging activity:", error.message);
  }
};

/**
 * Helper function untuk log berbagai tipe aktivitas
 */
export const ActivityLogger = {
  login: (req, userId, role) => {
    return logActivity(req, "LOGIN", "auth", `User ${role} berhasil login`);
  },
  
  logout: (req) => {
    return logActivity(req, "LOGOUT", "auth", "User logout");
  },
  
  create: (req, module, itemName) => {
    return logActivity(req, "CREATE", module, `Menambahkan data ${module}: ${itemName}`);
  },
  
  update: (req, module, itemName) => {
    return logActivity(req, "UPDATE", module, `Mengubah data ${module}: ${itemName}`);
  },
  
  delete: (req, module, itemName) => {
    return logActivity(req, "DELETE", module, `Menghapus data ${module}: ${itemName}`);
  },
  
  read: (req, module, description = "") => {
    return logActivity(req, "READ", module, `Mengakses data ${module} ${description}`);
  },
};

export default ActivityLogger;
