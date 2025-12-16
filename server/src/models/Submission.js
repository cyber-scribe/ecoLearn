const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  proofImage: {
    type: String,
    required: function () {
      return this.mediaType === 'image';
    }
  },
  proofVideo: {
    type: String,
    required: function () {
      return this.mediaType === 'video';
    }
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  publicId: {
    type: String
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationNote: {
    type: String
  },
  pointsAwarded: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
