import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if not exists
const uploadDir = "./uploads";
const profileDir = "./uploads/profiles";
const documentDir = "./uploads/documents";

[uploadDir, profileDir, documentDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profile_photo') {
      cb(null, profileDir);
    } else {
      cb(null, documentDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed extensions
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const allowedDocTypes = /pdf|doc|docx|txt/;
  
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimetype = file.mimetype;

  // Check if profile photo
  if (file.fieldname === 'profile_photo') {
    if (allowedImageTypes.test(ext) && mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar (JPG, PNG, GIF) yang diizinkan untuk foto profil'));
    }
  } 
  // Check if document
  else {
    const isValidDoc = allowedDocTypes.test(ext);
    const isValidImage = allowedImageTypes.test(ext) && mimetype.startsWith('image/');
    
    if (isValidDoc || isValidImage) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung. Gunakan: JPG, PNG, PDF, DOC, DOCX, TXT'));
    }
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Export different upload configurations
export const uploadSingle = upload.single('file');
export const uploadProfile = upload.single('profile_photo');
export const uploadMultiple = upload.array('files', 5); // Max 5 files
export const uploadFields = upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]);

export default upload;
