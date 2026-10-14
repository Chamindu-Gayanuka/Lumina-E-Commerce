import multer from 'multer';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG and WEBP images are allowed.'));
export const uploadProduct = multer({storage, fileFilter, limits: {fileSize: 8 * 1024 * 1024}});