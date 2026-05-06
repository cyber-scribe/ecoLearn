const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.school = req.body.school !== undefined ? req.body.school : user.school;
    user.grade = req.body.grade !== undefined ? req.body.grade : user.grade;
    user.team = req.body.team !== undefined ? req.body.team : user.team;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
      ecoPoints: updatedUser.ecoPoints,
      level: updatedUser.level,
      badges: updatedUser.badges,
      location: updatedUser.location,
      school: updatedUser.school,
      grade: updatedUser.grade,
      team: updatedUser.team,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user badges
// @route   GET /api/users/badges
// @access  Private
const getUserBadges = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('badges');
  
  if (user) {
    res.json(user.badges || []);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users for leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('name email avatar ecoPoints level createdAt')
    .sort({ ecoPoints: -1 })
    .limit(20);
  
  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    ecoPoints: user.ecoPoints || 0,
    level: user.level || 1,
    badges: 1, // Will be calculated based on actual badges later
    achievements: Math.floor(user.ecoPoints / 100) || 1,
    joinDate: user.createdAt
  }));

  res.json(leaderboard);
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserBadges,
  getLeaderboard,
};
