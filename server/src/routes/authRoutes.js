const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Profile routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

// Avatar upload route
router.post('/upload-avatar', protect, uploadController.uploadAvatarMiddleware, uploadController.uploadAvatar);
router.delete('/avatar', protect, uploadController.removeAvatar);

module.exports = router;
