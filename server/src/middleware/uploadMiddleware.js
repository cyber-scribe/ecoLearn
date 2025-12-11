// server/src/middleware/uploadMiddleware.js
const multer = require('multer');
const { cloudinary, upload } = require('../config/cloudinary');
const AppError = require('../utils/appError');

// Handle single file upload
const uploadFile = (fieldName) => {
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName);
    
    uploadSingle(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }
      
      try {
        if (req.file) {
          // File was uploaded successfully
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'ecolearn/uploads',
            resource_type: 'auto'
          });
          
          req.file.url = result.secure_url;
          req.file.publicId = result.public_id;
        }
        next();
      } catch (error) {
        next(new AppError('Error uploading file', 500));
      }
    });
  };
};

// Handle multiple file uploads
const uploadFiles = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadMultiple = upload.array(fieldName, maxCount);
    
    uploadMultiple(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }
      
      try {
        if (req.files && req.files.length > 0) {
          const uploadPromises = req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'ecolearn/uploads',
              resource_type: 'auto'
            });
            return {
              url: result.secure_url,
              publicId: result.public_id,
              originalName: file.originalname
            };
          });
          
          req.files = await Promise.all(uploadPromises);
        }
        next();
      } catch (error) {
        next(new AppError('Error uploading files', 500));
      }
    });
  };
};

module.exports = { uploadFile, uploadFiles };