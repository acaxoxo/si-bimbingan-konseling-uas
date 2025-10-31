/**
 * Password validation utility
 * Requirement: minimal 8 karakter, kombinasi huruf dan angka
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push("Password minimal 8 karakter");
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    errors.push("Password harus mengandung huruf");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password harus mengandung angka");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Email validation
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    error: emailRegex.test(email) ? null : "Format email tidak valid"
  };
};

/**
 * NIS validation (10 digit angka)
 */
export const validateNIS = (nis) => {
  const nisRegex = /^\d{10}$/;
  return {
    isValid: nisRegex.test(nis),
    error: nisRegex.test(nis) ? null : "NIS harus 10 digit angka"
  };
};

/**
 * NIK validation (16 digit angka)
 */
export const validateNIK = (nik) => {
  const nikRegex = /^\d{16}$/;
  return {
    isValid: nikRegex.test(nik),
    error: nikRegex.test(nik) ? null : "NIK harus 16 digit angka"
  };
};

/**
 * Phone number validation (Indonesia)
 */
export const validatePhone = (phone) => {
  // Format: 08xx-xxxx-xxxx atau +628xx-xxxx-xxxx
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return {
    isValid: phoneRegex.test(phone.replace(/[\s-]/g, '')),
    error: phoneRegex.test(phone.replace(/[\s-]/g, '')) ? null : "Format nomor telepon tidak valid"
  };
};

/**
 * Required field validation
 */
export const validateRequired = (value, fieldName = "Field") => {
  const isValid = value !== null && value !== undefined && value.toString().trim() !== "";
  return {
    isValid,
    error: isValid ? null : `${fieldName} wajib diisi`
  };
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};
