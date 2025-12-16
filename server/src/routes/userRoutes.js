const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Define routes
router.route('/profile')
  .get(protect, userController.getUserProfile)
  .put(protect, userController.updateUserProfile);

router.route('/badges')
  .get(protect, userController.getUserBadges);

router.route('/leaderboard')
  .get(protect, userController.getLeaderboard);

module.exports = router;