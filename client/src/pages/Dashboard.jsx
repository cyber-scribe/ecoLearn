import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Award, Trophy, BookOpen, Target, Eye } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [quizStats, setQuizStats] = useState(null);

  const fetchQuizStats = useCallback(async () => {
    try {
      const response = await api.get('/quizzes/user/stats');
      setQuizStats(response.data);
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get('/auth/profile');
      if (updateUser) {
        updateUser(response.data.user);
      }
      // Also update local state to ensure immediate UI updates
      console.log('Dashboard: Fetched user data:', response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchQuizStats();
    fetchUserData();
    
    // Set up real-time updates - match Navbar frequency for immediate updates
    const interval = setInterval(() => {
      fetchQuizStats();
      fetchUserData();
    }, 5000); // Refresh every 5 seconds (same as Navbar)
    
    return () => clearInterval(interval);
  }, [user, updateUser, fetchUserData, fetchQuizStats]);

  const nextLevelPoints = (user?.level || 5) * 200;
  const currentPoints = user?.ecoPoints || 0;
  const progressPercentage = nextLevelPoints > 0 ? (currentPoints / nextLevelPoints) * 100 : 0;

  // Debug: Log current user state
  console.log('Dashboard: Current user state:', { 
    name: user?.name, 
    ecoPoints: user?.ecoPoints, 
    currentPoints 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Hi {user?.name} 🌱, ready to save the planet?
          </h1>
          <p className="text-gray-600 mb-6">
            Complete daily eco-challenges, take quizzes, and climb the leaderboard.
          </p>
          
          <div className="flex gap-4">
            <Link
              to="/quizzes"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 border-2 border-green-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Start Quiz
            </Link>
            <Link
              to="/challenges"
              className="flex items-center gap-2 bg-white hover:bg-green-50 border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg transition-colors"
            >
              <Target className="w-5 h-5" />
              New Challenge
            </Link>
                        <Link
              to="/badges"
              className="flex items-center gap-2 bg-white hover:bg-green-50 border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg transition-colors"
            >
              <Award className="w-5 h-5" />
              View Badges
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Profile</h2>
              <Link to="/profile" className="ml-auto text-sm text-green-600 hover:text-green-700">
                Edit
              </Link>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={
                  user?.avatar ||
                  'https://ui-avatars.com/api/?name=' +
                    encodeURIComponent(user?.name || '') +
                    '&background=16a34a&color=fff'
                }
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="font-bold text-gray-800">{user?.name}</h3>
                <p className="text-sm text-gray-600">Level {user?.level || 5} Eco-Ranger • {user?.ecoPoints || 0} pts</p>
                <p className="text-xs text-gray-500 mt-1">Streak: 7 days • Team: Green Sprouts</p>
              </div>
            </div>
          </div>

          {/* Middle Column - Eco-points */}
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">Eco-points</h2>
              </div>
              {/* <Link to="/profile" className="text-sm text-green-700 hover:text-green-800">
                View history
              </Link> */}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                +{quizStats?.totalEcoPoints || 0} from quizzes
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle cx="48" cy="48" r="40" stroke="#d1fae5" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="#16a34a" strokeWidth="8" fill="none"
                      strokeDasharray={`${progressPercentage * 2.512} 251.2`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-green-700">
                    {Math.round(progressPercentage)}%
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{currentPoints}</p>
                  <p className="text-sm text-gray-600">Progress to Level {user?.level || 5 + 1}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Current: {currentPoints}</span>
                <span className="text-gray-700">Next level: {nextLevelPoints}</span>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">Quizzes</h2>
                <Link to="/quizzes" className="ml-auto text-green-600 hover:text-green-700">
                  Start →
                </Link>
              </div>
              <p className="text-gray-600 text-sm">
                {quizStats?.totalQuizzes > 0 
                  ? `Completed ${quizStats.totalQuizzes} quiz${quizStats.totalQuizzes > 1 ? 'zes' : ''} with ${Math.round(quizStats.averageScore || 0)}% average score.`
                  : 'No quizzes attempted yet. Start your eco-journey!'}
              </p>
              {quizStats?.totalQuizzes > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-green-50 rounded p-2">
                    <span className="text-green-700 font-medium">{quizStats.totalEcoPoints} pts earned</span>
                  </div>
                  <div className="bg-blue-50 rounded p-2">
                    <span className="text-blue-700 font-medium">{Math.round(quizStats.averageScore)}% avg</span>
                  </div>
                </div>
              )}
            </div>

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
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Leaderboard Preview */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
              </div>
              <Link
                to="/leaderboard"
                className="flex items-center gap-1 text-yellow-700 hover:text-yellow-800 text-sm"
              >
                See Ranks
              </Link>
            </div>
            <p className="text-gray-600 text-sm mb-4">Keep climbing the leaderboard & maintain your rank!</p>
          </div>

          {/* Badges Preview */}
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">Badges</h2>
              </div>
              <Link
                to="/badges"
                className="flex items-center gap-1 text-green-700 hover:text-green-800 text-sm"
              >
                <Eye className="w-4 h-4" />
                View All
              </Link>
            </div>
            <p className="text-gray-600 text-sm">New: Recycling Pro, Water Saver, Tree Planter.</p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Learning today, greener tomorrow.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;