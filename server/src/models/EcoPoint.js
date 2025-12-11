// server/src/models/EcoPoint.js
const mongoose = require('mongoose');

const ecoPointSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  source: {
    type: String,
    enum: ['quiz', 'challenge', 'referral', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dateEarned: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
ecoPointSchema.index({ userId: 1, dateEarned: -1 });

// Static method to get user's total points
ecoPointSchema.statics.getTotalPoints = async function(userId) {
  const result = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: '$points' } } }
  ]);
  return result.length > 0 ? result[0].total : 0;
};

module.exports = mongoose.model('EcoPoint', ecoPointSchema);