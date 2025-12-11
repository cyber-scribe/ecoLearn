const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    points: { type: Number, default: 10 }
  }],
  totalPoints: {
    type: Number,
    required: true
  },
  timeLimit: {
    type: Number, // in minutes
    default: 15
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);