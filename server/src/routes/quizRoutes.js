const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

// Define quiz routes
router.get('/', auth, quizController.getAllQuizzes);
router.get('/categories', auth, quizController.getQuizCategories);
router.get('/user/stats', auth, quizController.getUserQuizStats);
router.get('/user/history', auth, quizController.getUserQuizHistory);
router.get('/:id', auth, quizController.getQuizById);
router.post('/:id/submit', auth, quizController.submitQuiz);

module.exports = router;