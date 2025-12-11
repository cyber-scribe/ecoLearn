import React from 'react';

const MinimalList = ({ leaderboard }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Minimal List</h2>
      <div className="space-y-3">
        {leaderboard.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 hover:bg-green-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-400 w-8">{user.rank}</span>
              <span className="font-medium text-gray-800">{user.name}</span>
            </div>
            <span className="font-bold text-green-600">{user.ecoPoints}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MinimalList;