import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/users.js';

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, callback) {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
    callback(null, `${uniquePrefix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
