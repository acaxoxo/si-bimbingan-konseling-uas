import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const allowedDocTypes = /pdf|doc|docx|txt/;
  
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimetype = file.mimetype;

  if (file.fieldname === 'profile_photo') {
    if (allowedImageTypes.test(ext) && mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar (JPG, PNG, GIF) yang diizinkan untuk foto profil'));
    }
  } 
  
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

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});

export const uploadSingle = upload.single('file');
export const uploadProfile = upload.single('profile_photo');
export const uploadMultiple = upload.array('files', 5); 
export const uploadFields = upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]);

export default upload;
