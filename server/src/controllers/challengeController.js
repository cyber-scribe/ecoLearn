const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const User = require('../models/User');

// @desc    Get all challenges
// @route   GET /api/challenges
exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ status: 'active' })
      .sort({ isSpotlight: -1, createdAt: -1 });
    
    res.json({
      success: true,
      count: challenges.length,
      challenges
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get spotlight challenge
// @route   GET /api/challenges/spotlight
exports.getSpotlightChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ isSpotlight: true, status: 'active' });
    
    if (!challenge) {
      return res.status(404).json({ message: 'No spotlight challenge found' });
    }
    
    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit challenge proof
// @route   POST /api/challenges/:id/submit
exports.submitChallenge = async (req, res) => {
  try {
    const { proofImage, description } = req.body;
    const userId = req.user.id;
    const challengeId = req.params.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const submission = await Submission.create({
      userId,
      challengeId,
      proofImage,
      description,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      submission
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify submission (Teacher/Admin)
// @route   PUT /api/challenges/submissions/:id/verify
exports.verifySubmission = async (req, res) => {
  try {
    const { status, verificationNote } = req.body;
    const submissionId = req.params.id;

    const submission = await Submission.findById(submissionId)
      .populate('challengeId')
      .populate('userId');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.status = status;
    submission.verifiedBy = req.user.id;
    submission.verificationNote = verificationNote;

    if (status === 'approved') {
      submission.pointsAwarded = submission.challengeId.points;
      
      // Award points to user
      const user = await User.findById(submission.userId._id);
      user.ecoPoints += submission.challengeId.points;
      
      // Calculate level
      user.level = Math.floor(user.ecoPoints / 200) + 1;
      await user.save();
    }

    await submission.save();

    res.json({
      success: true,
      submission
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
