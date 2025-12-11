const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @desc    Get all quizzes
// @route   GET /api/quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true });
    
    res.json({
      success: true,
      count: quizzes.length,
      quizzes
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
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0
      };
    });

    // Award points to user
    const user = await User.findById(userId);
    user.ecoPoints += score;
    user.level = Math.floor(user.ecoPoints / 200) + 1;
    await user.save();

    res.json({
      success: true,
      score,
      totalPoints: quiz.totalPoints,
      percentage: (score / quiz.totalPoints) * 100,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};