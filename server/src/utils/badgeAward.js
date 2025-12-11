// server/src/utils/badgeAward.js
const Badge = require('../models/Badge');

class BadgeAward {
  static async checkAndAwardBadges(userId) {
    const badges = await Badge.find({});
    const userBadges = [];
    
    // Check each badge criteria
    for (const badge of badges) {
      const meetsCriteria = await this.checkBadgeCriteria(userId, badge);
      if (meetsCriteria) {
        userBadges.push(badge._id);
      }
    }
    
    return userBadges;
  }

  static async checkBadgeCriteria(userId, badge) {
    // Implement specific badge criteria checks
    // This is a simplified example
    switch(badge.name) {
      case 'Quiz Master':
        return await this.checkQuizMaster(userId);
      case 'Eco Warrior':
        return await this.checkEcoWarrior(userId);
      // Add more badge criteria
      default:
        return false;
    }
  }

  static async checkQuizMaster(userId) {
    // Example: Award if user has completed 10+ quizzes
    const quizCount = await Quiz.countDocuments({ 
      userId, 
      status: 'completed' 
    });
    return quizCount >= 10;
  }

  static async checkEcoWarrior(userId) {
    // Example: Award if user has earned 1000+ eco points
    const totalPoints = await EcoPoint.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);
    return totalPoints.length > 0 && totalPoints[0].total >= 1000;
  }
}

module.exports = BadgeAward;