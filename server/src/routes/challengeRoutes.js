const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

// Define challenge routes
router.route('/')
  .get(protect, challengeController.getAllChallenges);

router.route('/spotlight')
  .get(protect, challengeController.getSpotlightChallenge);

router.route('/:id/submit')
  .post(protect, challengeController.submitChallenge);

router.route('/submissions/:id/verify')
  .put(protect, challengeController.verifySubmission);

module.exports = router;