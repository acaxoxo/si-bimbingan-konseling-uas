import rateLimit from 'express-rate-limit';

const isProd = process.env.NODE_ENV === 'production';

function humanRetryAfter(req, fallbackMinutes = 1, capMinutes = 60) {
  try {
    const rt = req?.rateLimit?.resetTime;
    let minutes;
    if (!rt) {
      minutes = fallbackMinutes;
    } else if (rt instanceof Date) {
      minutes = Math.ceil((rt.getTime() - Date.now()) / 1000 / 60);
    } else {
      // assume milliseconds remaining
      minutes = Math.ceil(Number(rt) / 1000 / 60);
    }
    if (!Number.isFinite(minutes)) minutes = fallbackMinutes;
    minutes = Math.max(1, Math.min(capMinutes, minutes));
    return `${minutes} menit`;
  } catch {
    return `${fallbackMinutes} menit`;
  }
}

// Rate limiter untuk login - lebih ketat
export const loginLimiter = rateLimit({
  windowMs: isProd ? 15 * 60 * 1000 : 60 * 1000, // dev: 1 menit
  max: isProd ? 5 : 100, // dev: longgar
  message: {
    message: "Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Jangan hitung request yang sukses
  skipSuccessfulRequests: true,
  // Custom handler untuk error
  handler: (req, res) => {
    res.status(429).json({
      message: "Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.",
      retryAfter: humanRetryAfter(req, isProd ? 15 : 1, isProd ? 60 : 5)
    });
  }
});

// Rate limiter untuk register - sedang
export const registerLimiter = rateLimit({
  windowMs: isProd ? 60 * 60 * 1000 : 5 * 60 * 1000, // dev: 5 menit
  max: isProd ? 3 : 50, // dev: longgar
  message: {
    message: "Terlalu banyak percobaan registrasi. Silakan coba lagi setelah 1 jam."
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: "Terlalu banyak percobaan registrasi. Silakan coba lagi setelah 1 jam.",
      retryAfter: humanRetryAfter(req, isProd ? 60 : 5, isProd ? 120 : 10)
    });
  }
});

// Rate limiter untuk API umum - lebih longgar
export const apiLimiter = rateLimit({
  windowMs: isProd ? 15 * 60 * 1000 : 60 * 1000,
  max: isProd ? 100 : 1000,
  message: {
    message: "Terlalu banyak permintaan. Silakan coba lagi nanti."
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      retryAfter: humanRetryAfter(req, isProd ? 15 : 1, isProd ? 60 : 5)
    });
  }
});

// Rate limiter untuk CRUD operations - sedang
export const crudLimiter = rateLimit({
  windowMs: isProd ? 15 * 60 * 1000 : 60 * 1000,
  max: isProd ? 50 : 1000,
  message: {
    message: "Terlalu banyak operasi. Silakan coba lagi nanti."
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: "Terlalu banyak operasi. Silakan coba lagi nanti.",
      retryAfter: humanRetryAfter(req, isProd ? 15 : 1, isProd ? 60 : 5)
    });
  }
});
