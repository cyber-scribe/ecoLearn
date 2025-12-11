import React from 'react';
import { Target, Upload } from 'lucide-react';

const ChallengeCard = ({ challenge, onSubmit }) => {
  const Icon = challenge.icon;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          {Icon && <Icon className="w-6 h-6 text-green-600" />}
        </div>
        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <Target className="w-4 h-4" />
          +{challenge.points} pts
        </span>
      </div>
      
      <h3 className="font-bold text-gray-800 mb-2">{challenge.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Status: {challenge.status}</span>
        <button
          onClick={() => onSubmit(challenge.id)}
          className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
        >
          <Upload className="w-4 h-4" />
          Submit Proof
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;