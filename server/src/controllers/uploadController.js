const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @desc    Upload avatar image
// @route   POST /api/auth/upload-avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old avatar if it exists and is not a default avatar
    if (user.avatar && !user.avatar.includes('ui-avatars.com')) {
      const oldAvatarPath = path.join(__dirname, '..', '..', user.avatar.replace(/^\/+/, ''));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user avatar with file path
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: avatarUrl,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        ecoPoints: user.ecoPoints,
        level: user.level,
        badges: user.badges,
        streak: user.streak,
        lastActive: user.lastActive,
        school: user.school,
        grade: user.grade,
        location: user.location,
        team: user.team,
        bio: user.bio,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove avatar image
// @route   DELETE /api/auth/avatar
exports.removeAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.avatar && !user.avatar.includes('ui-avatars.com')) {
      const avatarPath = path.join(__dirname, '..', '..', user.avatar.replace(/^\/+/, ''));
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    user.avatar = '';
    await user.save();

    res.json({
      success: true,
      message: 'Avatar removed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        ecoPoints: user.ecoPoints,
        level: user.level,
        badges: user.badges,
        streak: user.streak,
        lastActive: user.lastActive,
        school: user.school,
        grade: user.grade,
        location: user.location,
        team: user.team,
        bio: user.bio,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Remove avatar error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export multer middleware for use in routes
exports.uploadAvatarMiddleware = upload.single('image');
