const Quiz = require('../models/Quiz');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');

// @desc    Get all quizzes
// @route   GET /api/quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let filter = { isActive: true };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    const quizzes = await Quiz.find(filter).select('-questions'); // Don't send questions in list view
    
    res.json({
      success: true,
      count: quizzes.length,
      quizzes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get quiz categories
// @route   GET /api/quizzes/categories
exports.getQuizCategories = async (req, res) => {
  try {
    const categories = await Quiz.distinct('category');
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of answer indices
    const quizId = req.params.id;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    const results = quiz.questions.map((question, index) => {
      const isCorrect = question.correctAnswer === answers[index];
      if (isCorrect) score += question.points;
      
      return {
        questionId: index,
        question: question.question,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        isCorrect,
        points: isCorrect ? question.points : 0
      };
    });

    // Award points to user
    const user = await User.findById(userId);
    user.ecoPoints += score;
    user.level = Math.floor(user.ecoPoints / 200) + 1;
    await user.save();

    // Determine performance level
    const percentage = (score / quiz.totalPoints) * 100;
    let performance = 'Need Improvement';
    if (percentage >= 90) performance = 'Excellent';
    else if (percentage >= 75) performance = 'Good';
    else if (percentage >= 60) performance = 'Average';

    // Save quiz result
    const quizResult = new QuizResult({
      userId,
      quizId,
      score,
      totalPoints: quiz.totalPoints,
      percentage,
      performance,
      ecoPointsEarned: score,
      answers: results,
      timeSpent: quiz.timeLimit * 60 // Will be updated with actual time if provided
    });
    await quizResult.save();

    res.json({
      success: true,
      score,
      totalPoints: quiz.totalPoints,
      percentage,
      performance,
      results,
      ecoPointsEarned: score,
      newLevel: user.level
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user quiz statistics
// @route   GET /api/quizzes/user/stats
exports.getUserQuizStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await QuizResult.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          totalScore: { $sum: '$score' },
          totalPoints: { $sum: '$totalPoints' },
          averageScore: { $avg: '$percentage' },
          totalEcoPoints: { $sum: '$ecoPointsEarned' },
          lastQuizDate: { $max: '$completedAt' }
        }
      }
    ]);

    const result = stats[0] || {
      totalQuizzes: 0,
      totalScore: 0,
      totalPoints: 0,
      averageScore: 0,
      totalEcoPoints: 0,
      lastQuizDate: null
    };

    res.json({
      success: true,
      stats: result
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user quiz history
// @route   GET /api/quizzes/user/history
exports.getUserQuizHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const quizResults = await QuizResult.find({ userId })
      .populate('quizId', 'title category difficulty')
      .sort({ completedAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      history: quizResults
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};