import React from 'react';
import { Target } from 'lucide-react';

const ChallengeHub = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Target className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Challenge Hub</h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ChallengeHub;
