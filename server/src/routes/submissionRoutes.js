const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Submission = require('../models/Submission');

router.get('/user', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate('challengeId', 'title points')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/challenge/:challengeId', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      challengeId: req.params.challengeId,
      status: 'approved'
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, submissions });
  } catch (error) {
    console.error('Get challenge submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
