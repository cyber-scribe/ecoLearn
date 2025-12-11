const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['tree-planting', 'recycling', 'water-conservation', 'energy-saving', 'other'],
    default: 'other'
  },
  points: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  isSpotlight: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: 'target'
  },
  validationRequired: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);