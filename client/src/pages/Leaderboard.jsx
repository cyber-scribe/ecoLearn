import React, { useState } from 'react';
import { Trophy, Award, Medal } from 'lucide-react';
import Navbar from '../components/common/Navbar';

const Leaderboard = () => {
  const [viewMode, setViewMode] = useState('podium');

  const leaderboardData = [
    {
      rank: 1,
      name: 'Leo Earth',
      avatar: 'https://ui-avatars.com/api/?name=Leo+Earth&background=f59e0b&color=fff',
      ecoPoints: 1220,
      badges: 8,
      achievements: 5
    },
    {
      rank: 2,
      name: 'Ava Green',
      avatar: 'https://ui-avatars.com/api/?name=Ava+Green&background=10b981&color=fff',
      ecoPoints: 1080,
      badges: 7,
      achievements: 4
    },
    {
      rank: 3,
      name: 'Maya Eco',
      avatar: 'https://ui-avatars.com/api/?name=Maya+Eco&background=3b82f6&color=fff',
      ecoPoints: 1000,
      badges: 6,
      achievements: 3
    },
    {
      rank: 4,
      name: 'Noah Leaf',
      avatar: 'https://ui-avatars.com/api/?name=Noah+Leaf&background=8b5cf6&color=fff',
      ecoPoints: 940,
      badges: 5,
      achievements: 3
    },
    {
      rank: 5,
      name: 'Ivy Terra',
      avatar: 'https://ui-avatars.com/api/?name=Ivy+Terra&background=ec4899&color=fff',
      ecoPoints: 905,
      badges: 4,
      achievements: 2
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setViewMode('podium')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              viewMode === 'podium'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-green-50'
            }`}
          >
            Podium
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-green-50'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('minimal')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              viewMode === 'minimal'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-green-50'
            }`}
          >
            Minimal
          </button>
        </div>

        {/* Podium View */}
        {viewMode === 'podium' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Top 3 Podium</h2>
            
            <div className="flex items-end justify-center gap-8 mb-12">
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={leaderboardData[1].avatar}
                    alt={leaderboardData[1].name}
                    className="w-24 h-24 rounded-full border-4 border-gray-300"
                  />
                </div>
                <p className="font-bold text-gray-800 mb-1">{leaderboardData[1].name}</p>
                <p className="text-green-600 font-semibold mb-4">{leaderboardData[1].ecoPoints}</p>
                <div className="bg-gray-200 rounded-t-lg px-8 py-6 text-center">
                  <p className="text-4xl font-bold text-gray-600">2</p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center -mt-8">
                <div className="relative mb-4">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 rounded-full p-2">
                      <Trophy className="w-6 h-6 text-yellow-700" />
                    </div>
                  </div>
                  <img
                    src={leaderboardData[0].avatar}
                    alt={leaderboardData[0].name}
                    className="w-32 h-32 rounded-full border-4 border-yellow-400"
                  />
                </div>
                <p className="font-bold text-gray-800 mb-1">{leaderboardData[0].name}</p>
                <p className="text-green-600 font-semibold mb-4">{leaderboardData[0].ecoPoints}</p>
                <div className="bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-t-lg px-8 py-8 text-center">
                  <p className="text-5xl font-bold text-yellow-700">1</p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={leaderboardData[2].avatar}
                    alt={leaderboardData[2].name}
                    className="w-24 h-24 rounded-full border-4 border-orange-300"
                  />
                </div>
                <p className="font-bold text-gray-800 mb-1">{leaderboardData[2].name}</p>
                <p className="text-green-600 font-semibold mb-4">{leaderboardData[2].ecoPoints}</p>
                <div className="bg-orange-200 rounded-t-lg px-8 py-4 text-center">
                  <p className="text-3xl font-bold text-orange-600">3</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
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
                  {leaderboardData.map((user, index) => (
                    <tr key={user.rank} className={index < 3 ? 'bg-green-50/50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                          <span className="font-bold text-green-700">{user.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">{user.ecoPoints}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {user.badges}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {user.achievements}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Minimal List */}
        {viewMode === 'minimal' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Minimal List</h2>
            <div className="space-y-3">
              {leaderboardData.map((user) => (
                <div
                  key={user.rank}
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
        )}
      </div>
    </div>
  );
};

export default Leaderboard;