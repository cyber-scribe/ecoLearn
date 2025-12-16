const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalPoints: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  performance: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Need Improvement'],
    required: true
  },
  ecoPointsEarned: {
    type: Number,
    required: true
  },
  answers: [{
    questionId: Number,
    userAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean,
    points: Number
  }],
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient queries
quizResultSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
