const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'award'
  },
  color: {
    type: String,
    default: 'green'
  },
  requirement: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['recycling', 'water', 'energy', 'planting', 'general'],
    default: 'general'
  },
  pointsRequired: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);