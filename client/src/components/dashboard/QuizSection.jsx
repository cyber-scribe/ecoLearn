import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuizSection = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-800">Quizzes</h2>
        <Link to="/quiz" className="ml-auto text-green-600 hover:text-green-700">
          Continue →
        </Link>
      </div>
      <p className="text-gray-600 text-sm">Test your eco-knowledge. 3 quizzes in progress.</p>
    </div>
  );
};

export default QuizSection;
