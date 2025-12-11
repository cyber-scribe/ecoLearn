import React from 'react';
import { Trophy } from 'lucide-react';

const PodiumView = ({ topThree }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Top 3 Podium</h2>
      
      <div className="flex items-end justify-center gap-8">
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <img
            src={topThree[1]?.avatar}
            alt={topThree[1]?.name}
            className="w-24 h-24 rounded-full border-4 border-gray-300 mb-4"
          />
          <p className="font-bold text-gray-800 mb-1">{topThree[1]?.name}</p>
          <p className="text-green-600 font-semibold mb-4">{topThree[1]?.ecoPoints}</p>
          <div className="bg-gray-200 rounded-t-lg px-8 py-6 text-center">
            <p className="text-4xl font-bold text-gray-600">2</p>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center -mt-8">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-yellow-400 rounded-full p-2">
              <Trophy className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
          <img
            src={topThree[0]?.avatar}
            alt={topThree[0]?.name}
            className="w-32 h-32 rounded-full border-4 border-yellow-400 mb-4"
          />
          <p className="font-bold text-gray-800 mb-1">{topThree[0]?.name}</p>
          <p className="text-green-600 font-semibold mb-4">{topThree[0]?.ecoPoints}</p>
          <div className="bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-t-lg px-8 py-8 text-center">
            <p className="text-5xl font-bold text-yellow-700">1</p>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <img
            src={topThree[2]?.avatar}
            alt={topThree[2]?.name}
            className="w-24 h-24 rounded-full border-4 border-orange-300 mb-4"
          />
          <p className="font-bold text-gray-800 mb-1">{topThree[2]?.name}</p>
          <p className="text-green-600 font-semibold mb-4">{topThree[2]?.ecoPoints}</p>
          <div className="bg-orange-200 rounded-t-lg px-8 py-4 text-center">
            <p className="text-3xl font-bold text-orange-600">3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodiumView;