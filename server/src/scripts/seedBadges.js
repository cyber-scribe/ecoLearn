const mongoose = require('mongoose');
const Badge = require('../models/Badge');
require('dotenv').config();

const badgeData = [
  {
    name: 'Quiz Beginner',
    description: 'Completed your first eco-quiz',
    icon: 'award',
    color: 'green',
    requirement: 'Complete 1 quiz',
    category: 'general',
    pointsRequired: 0
  },
  {
    name: 'Quiz Master',
    description: 'Completed 10 eco-quizzes',
    icon: 'trophy',
    color: 'yellow',
    requirement: 'Complete 10 quizzes',
    category: 'general',
    pointsRequired: 0
  },
  {
    name: 'Eco Warrior',
    description: 'Earned 1000 eco-points',
    icon: 'shield',
    color: 'emerald',
    requirement: 'Earn 1000 eco-points',
    category: 'general',
    pointsRequired: 1000
  }
];

const seedBadges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const data of badgeData) {
      await Badge.findOneAndUpdate(
        { name: data.name },
        data,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Upserted badge: ${data.name}`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding badges:', error);
    process.exit(1);
  }
};

seedBadges();