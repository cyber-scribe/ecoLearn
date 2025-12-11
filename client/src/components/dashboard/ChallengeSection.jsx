import React from 'react';
import { Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChallengeSection = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-800">Challenges</h2>
        <Link to="/challenges" className="ml-auto text-green-600 hover:text-green-700">
          Explore →
        </Link>
      </div>
      <p className="text-gray-600 text-sm">Daily acts for the planet. 2 new this week.</p>
    </div>
  );
};

export default ChallengeSection;