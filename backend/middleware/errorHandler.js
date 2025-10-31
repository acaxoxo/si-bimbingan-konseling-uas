// middleware/errorHandler.js

/**
 * Middleware untuk menangani error global
 */
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server.",
  });
};

/**
 * Middleware untuk handle 404
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint tidak ditemukan: ${req.originalUrl}`,
  });
};
