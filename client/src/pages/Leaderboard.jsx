import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Award, Medal } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Leaderboard = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('podium');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await api.get('/users/leaderboard');
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to mock data if API fails
      const mockData = [
        {
          rank: 1,
          name: 'Eco Champion',
          avatar: 'https://ui-avatars.com/api/?name=Eco+Champion&background=f59e0b&color=fff',
          ecoPoints: 1500,
          badges: 12,
          achievements: 8
        },
        {
          rank: 2,
          name: user?.name || 'You',
          avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'You')}&background=16a34a&color=fff`,
          ecoPoints: user?.ecoPoints || 0,
          badges: 1,
          achievements: 1
        },
        {
          rank: 3,
          name: 'Green Warrior',
          avatar: 'https://ui-avatars.com/api/?name=Green+Warrior&background=10b981&color=fff',
          ecoPoints: 800,
          badges: 5,
          achievements: 3
        }
      ];
      setLeaderboardData(mockData);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLeaderboard();
    
    // Set up real-time updates
    const interval = setInterval(fetchLeaderboard, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [user, fetchLeaderboard]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-pulse">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          </div>
        )}

        {/* View Tabs - Only show when not loading */}
        {!loading && (
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
        )}

        {/* Podium View */}
        {!loading && viewMode === 'podium' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Top 3 Podium</h2>
            
            {leaderboardData.length >= 3 ? (
              <div className="flex items-end justify-center gap-8 mb-12">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src={leaderboardData[1]?.avatar || 'https://ui-avatars.com/api/?name=User&background=6b7280&color=fff'}
                      alt={leaderboardData[1]?.name || 'User'}
                      className="w-24 h-24 rounded-full border-4 border-gray-300"
                    />
                  </div>
                  <p className="font-bold text-gray-800 mb-1">{leaderboardData[1]?.name || 'User'}</p>
                  <p className="text-green-600 font-semibold mb-4">{leaderboardData[1]?.ecoPoints || 0}</p>
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
                      src={leaderboardData[0]?.avatar || 'https://ui-avatars.com/api/?name=Winner&background=f59e0b&color=fff'}
                      alt={leaderboardData[0]?.name || 'Winner'}
                      className="w-32 h-32 rounded-full border-4 border-yellow-400"
                    />
                  </div>
                  <p className="font-bold text-gray-800 mb-1">{leaderboardData[0]?.name || 'Winner'}</p>
                  <p className="text-green-600 font-semibold mb-4">{leaderboardData[0]?.ecoPoints || 0}</p>
                  <div className="bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-t-lg px-8 py-8 text-center">
                    <p className="text-5xl font-bold text-yellow-700">1</p>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src={leaderboardData[2]?.avatar || 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff'}
                      alt={leaderboardData[2]?.name || 'User'}
                      className="w-24 h-24 rounded-full border-4 border-orange-300"
                    />
                  </div>
                  <p className="font-bold text-gray-800 mb-1">{leaderboardData[2]?.name || 'User'}</p>
                  <p className="text-green-600 font-semibold mb-4">{leaderboardData[2]?.ecoPoints || 0}</p>
                  <div className="bg-orange-200 rounded-t-lg px-8 py-4 text-center">
                    <p className="text-3xl font-bold text-orange-600">3</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600 py-8">
                <p>Not enough users for podium display</p>
              </div>
            )}
          </div>
        )}

        {/* Table View */}
        {!loading && viewMode === 'table' && (
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
                            src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User') + '&background=16a34a&color=fff'}
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
        {!loading && viewMode === 'minimal' && (
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