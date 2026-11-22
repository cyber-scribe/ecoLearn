// server/src/utils/badgeAward.js
const Badge = require('../models/Badge');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');

class BadgeAward {
  static async checkAndAwardBadges(userId) {
    const user = await User.findById(userId);
    if (!user) return [];

    const badges = await Badge.find({});
    const newBadges = [];

    for (const badge of badges) {
      const alreadyEarned = user.badges.some(
        (b) => b.badgeId && b.badgeId.toString() === badge._id.toString()
      );
      if (alreadyEarned) continue;

      if (await this.checkBadgeCriteria(user, badge)) {
        newBadges.push(badge._id);
      }
    }

    return newBadges;
  }

  static async checkBadgeCriteria(user, badge) {
    switch (badge.name) {
      case 'Quiz Beginner':
        return await this.hasCompletedQuizzes(user._id, 1);
      case 'Quiz Master':
        return await this.hasCompletedQuizzes(user._id, 10);
      case 'Eco Warrior':
        return (user.ecoPoints || 0) >= 1000;
      default:
        return false;
    }
  }

  static async hasCompletedQuizzes(userId, threshold) {
    const count = await QuizResult.countDocuments({ userId });
    return count >= threshold;
  }
}

module.exports = BadgeAward;