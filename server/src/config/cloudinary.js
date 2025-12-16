const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype && file.mimetype.startsWith('image/');
    const isVideo = file.mimetype && file.mimetype.startsWith('video/');

    if (!isImage && !isVideo) {
      return cb(new Error('Only image and video files are allowed'));
    }

    cb(null, true);
  },
});

module.exports = { cloudinary, upload };