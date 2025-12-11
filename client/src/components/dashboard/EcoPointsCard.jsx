import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const EcoPointsCard = ({ points, level, progress }) => {
  return (
    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Eco-points</h2>
        </div>
        <Link to="/profile" className="text-sm text-green-700 hover:text-green-800">
          View history
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          +120 this week
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24">
              <circle cx="48" cy="48" r="40" stroke="#d1fae5" strokeWidth="8" fill="none" />
              <circle cx="48" cy="48" r="40" stroke="#16a34a" strokeWidth="8" fill="none"
                strokeDasharray={`${(progress / 100) * 251.2} 251.2`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-green-700">
              {Math.round(progress)}%
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{points}</p>
            <p className="text-sm text-gray-600">Progress to Level {level + 1}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/50 rounded-lg p-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">Current: {points}</span>
          <span className="text-gray-700">Next level: {(level + 1) * 200}</span>
        </div>
        <div className="w-full bg-white rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default EcoPointsCard;