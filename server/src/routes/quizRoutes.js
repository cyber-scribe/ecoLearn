const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// Define quiz routes
router.get('/', protect, (req, res, next) => {
  quizController.getQuizzes(req, res).catch(next);
});

router.get('/:id', protect, (req, res, next) => {
  quizController.getQuizById(req, res).catch(next);
});

router.post('/:id/submit', protect, (req, res, next) => {
  quizController.submitQuiz(req, res).catch(next);
});

module.exports = router;