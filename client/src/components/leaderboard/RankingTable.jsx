import React from 'react';

const RankingTable = ({ leaderboard, currentUserId }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-green-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Eco-Points</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Badges</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leaderboard.map((user, index) => (
            <tr
              key={user.id}
              className={`${
                user.id === currentUserId ? 'bg-green-50' : index < 3 ? 'bg-green-50/50' : 'hover:bg-gray-50'
              }`}
            >
              <td className="px-6 py-4">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                  <span className="font-bold text-green-700">{user.rank}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <span className="font-medium text-gray-800">{user.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="font-semibold text-green-600">{user.ecoPoints}</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {user.badges}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;