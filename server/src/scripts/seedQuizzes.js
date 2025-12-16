const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const quizData = require('../data/quizData');
require('dotenv').config();

const seedQuizzes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    // Insert new quizzes
    const insertedQuizzes = await Quiz.insertMany(quizData);
    console.log(`Inserted ${insertedQuizzes.length} quizzes`);

    // Display quiz summary
    console.log('\n=== Quiz Summary ===');
    insertedQuizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. ${quiz.title}`);
      console.log(`   Category: ${quiz.category}`);
      console.log(`   Difficulty: ${quiz.difficulty}`);
      console.log(`   Questions: ${quiz.questions.length}`);
      console.log(`   Total Points: ${quiz.totalPoints}`);
      console.log('');
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedQuizzes();
