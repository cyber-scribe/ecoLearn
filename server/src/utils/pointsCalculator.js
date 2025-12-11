// server/src/utils/pointsCalculator.js
class PointsCalculator {
  static calculateQuizPoints(correctAnswers, totalQuestions, timeTaken, difficulty = 1) {
    // Base points for correct answers
    const basePoints = correctAnswers * 10 * difficulty;
    
    // Time bonus (max 2 minutes for full bonus)
    const maxTimeBonus = 50;
    const timeBonus = Math.max(0, Math.round(
      (1 - Math.min(timeTaken, 120) / 120) * maxTimeBonus
    ));
    
    // Accuracy bonus
    const accuracy = correctAnswers / totalQuestions;
    const accuracyBonus = Math.round(accuracy * 100);
    
    // Perfect score bonus
    const perfectScoreBonus = accuracy === 1 ? 100 : 0;
    
    const totalPoints = basePoints + timeBonus + accuracyBonus + perfectScoreBonus;
    
    return {
      basePoints,
      timeBonus,
      accuracyBonus,
      perfectScoreBonus,
      totalPoints,
      accuracy: Math.round(accuracy * 100)
    };
  }

  static calculateLevel(totalPoints) {
    const baseExp = 1000;
    const level = Math.max(1, Math.floor(Math.log2(totalPoints / baseExp + 1)) + 1);
    const currentLevelExp = baseExp * (Math.pow(2, level - 1) - 1);
    const nextLevelExp = baseExp * (Math.pow(2, level) - 1);
    const progress = Math.min(100, Math.round(
      ((totalPoints - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100
    ));
    
    return { level, progress, nextLevelExp };
  }
}

module.exports = PointsCalculator;