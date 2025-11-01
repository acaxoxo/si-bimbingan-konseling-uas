

export const errorHandler = (err, req, res, next) => {
  console.error(" Error:", err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server.",
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint tidak ditemukan: ${req.originalUrl}`,
  });
};
