import React from 'react';
import { Target, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHeader = ({ userName }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Hi {userName} 🌱, ready to save the planet?
      </h1>
      <p className="text-gray-600 mb-6">
        Complete daily eco-challenges, take quizzes, and climb the leaderboard.
      </p>
      
      <div className="flex gap-4">
        <Link
          to="/challenges"
          className="flex items-center gap-2 bg-white hover:bg-green-50 border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg transition-colors"
        >
          <Target className="w-5 h-5" />
          New Challenge
        </Link>
        <Link
          to="/quiz"
          className="flex items-center gap-2 bg-white hover:bg-green-50 border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          Start Quiz
        </Link>
        <Link
          to="/badges"
          className="flex items-center gap-2 bg-white hover:bg-green-50 border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg transition-colors"
        >
          <Award className="w-5 h-5" />
          View Badges
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;