import React from 'react';
import { Trophy } from 'lucide-react';

const Leaderboard = ({ data, currentUserId }) => {
  const getMedalColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-500';
    return 'text-gray-300';
  };

  return (
    <div className="space-y-2">
      {data.map((user) => (
        <div
          key={user.id}
          className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
            user.id === currentUserId
              ? 'bg-green-50 border-2 border-green-500'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8">
              {user.rank <= 3 ? (
                <Trophy className={`w-6 h-6 ${getMedalColor(user.rank)}`} />
              ) : (
                <span className="font-bold text-gray-400">{user.rank}</span>
              )}
            </div>
            
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">Level {user.level}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="font-bold text-green-600">{user.ecoPoints} pts</p>
            <p className="text-xs text-gray-500">{user.badges} badges</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
