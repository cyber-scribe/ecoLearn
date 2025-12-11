const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

// Define leaderboard routes
router.get('/', protect, (req, res, next) => {
  leaderboardController.getLeaderboard(req, res).catch(next);
});

router.get('/top', protect, (req, res, next) => {
  leaderboardController.getTopUsers(req, res).catch(next);
});

module.exports = router;