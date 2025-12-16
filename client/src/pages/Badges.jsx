import React from 'react';
import { Award, Lock } from 'lucide-react';
import Navbar from '../components/common/Navbar';

const Badges = () => {
  const badges = {
    earned: [
      {
        id: 1,
        name: 'Quiz Beginner',
        description: 'Completed your first eco-quiz',
        icon: Award,
        color: 'green',
        date: new Date().toISOString().split('T')[0]
      }
    ],
    locked: [
      {
        id: 2,
        name: 'Recycling Pro',
        description: 'Correctly sorted waste for 7 consecutive days',
        icon: Lock,
        requirement: 'Complete 7 recycling challenges'
      },
      {
        id: 3,
        name: 'Water Saver',
        description: 'Saved 100L of water through conservation',
        icon: Lock,
        requirement: 'Complete 5 water conservation activities'
      },
      {
        id: 4,
        name: 'Tree Planter',
        description: 'Planted and documented 5 trees',
        icon: Lock,
        requirement: 'Document planting 5 trees'
      },
      {
        id: 5,
        name: 'Energy Champion',
        description: 'Reduce energy consumption by 20%',
        icon: Lock,
        requirement: 'Complete 10 energy challenges'
      },
      {
        id: 6,
        name: 'Compost Master',
        description: 'Maintain a compost bin for 30 days',
        icon: Lock,
        requirement: 'Start composting program'
      }
    ]
  };

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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Earned Badges ({badges.earned.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {badges.earned.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-20 h-20 bg-${badge.color}-100 rounded-full flex items-center justify-center`}>
                      <Icon className={`w-10 h-10 text-${badge.color}-600`} />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-center mb-2">{badge.name}</h3>
                  <p className="text-gray-600 text-sm text-center mb-3">{badge.description}</p>
                  <p className="text-gray-400 text-xs text-center">Earned on {badge.date}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Locked Badges */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Locked Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {badges.locked.map((badge) => (
              <div key={badge.id} className="bg-gray-100 rounded-xl shadow-lg p-6 border-2 border-gray-300 opacity-60">
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