// middleware/authErrorHandler.js

/**
 * Middleware khusus menangani error autentikasi dan otorisasi
 */
export const authErrorHandler = (err, req, res, next) => {
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid. Silakan login ulang.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token sudah kadaluarsa. Silakan login kembali.",
    });
  }

  next(err);
};
