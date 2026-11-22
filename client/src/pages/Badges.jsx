import React, { useState, useEffect } from 'react';
import { Award, Lock } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import api from '../services/api';

const ICON_MAP = { award: Award, trophy: Award, shield: Award, default: Award };

const Badges = () => {
  const [earned, setEarned] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [earnedRes, allRes] = await Promise.all([
          api.get('/users/badges'),
          api.get('/users/badges/all')
        ]);
        setEarned(earnedRes.data || []);
        setAllBadges(allRes.data || []);
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  const earnedIds = new Set(earned.map((b) => b._id));
  const locked = allBadges.filter((b) => !earnedIds.has(b._id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Award className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Your Badges</h1>
        </div>

        {/* Earned Badges */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Earned Badges ({earned.length})</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : earned.length === 0 ? (
            <p className="text-gray-500">No badges earned yet. Complete quizzes to unlock badges!</p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {earned.map((badge) => {
              const Icon = ICON_MAP[badge.icon] || ICON_MAP.default;
              return (
                <div key={badge._id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-20 h-20 bg-${badge.color}-100 rounded-full flex items-center justify-center`}>
                      <Icon className={`w-10 h-10 text-${badge.color}-600`} />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-center mb-2">{badge.name}</h3>
                  <p className="text-gray-600 text-sm text-center mb-3">{badge.description}</p>
                  <p className="text-gray-400 text-xs text-center">Earned on {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : '—'}</p>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Locked Badges */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Locked Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locked.map((badge) => (
              <div key={badge._id} className="bg-gray-100 rounded-xl shadow-lg p-6 border-2 border-gray-300 opacity-60">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <Lock className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-600 text-center mb-2">{badge.name}</h3>
                <p className="text-gray-500 text-sm text-center mb-3">{badge.description}</p>
                <p className="text-gray-400 text-xs text-center font-medium">{badge.requirement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;