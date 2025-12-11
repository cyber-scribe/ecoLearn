const User = require('../models/User');

// @desc    Get leaderboard
// @route   GET /api/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 50, school, grade } = req.query;
    
    let query = {};
    if (school) query.school = school;
    if (grade) query.grade = grade;

    const users = await User.find(query)
      .select('name email avatar ecoPoints level badges streak team')
      .sort({ ecoPoints: -1 })
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      ...user.toObject()
    }));

    res.json({
      success: true,
      count: leaderboard.length,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user rank
// @route   GET /api/leaderboard/rank/:userId
exports.getUserRank = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rank = await User.countDocuments({ ecoPoints: { $gt: user.ecoPoints } }) + 1;

    res.json({
      success: true,
      rank,
      ecoPoints: user.ecoPoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
