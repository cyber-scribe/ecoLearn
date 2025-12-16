import React, { useState } from 'react';
import { Upload, TreeDeciduous, Recycle, Droplet, Target } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import UploadModal from '../components/UploadModal';

const Challenges = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentChallengeId, setCurrentChallengeId] = useState(null);

  const challenges = {
    spotlight: {
      id: 'tree-planting',
      title: 'Plant a Tree 🌳',
      description: "This week's spotlight challenge. Help restore local green spaces.",
      points: 100,
      progress: 70,
      icon: TreeDeciduous,
      color: 'green'
    },
    suggested: [
      {
        id: 'backyard-sapling',
        title: 'Backyard Sapling',
        description: 'Plant and water a sapling in your yard or community garden.',
        points: 50,
        status: 'Active',
        icon: TreeDeciduous,
        color: 'green'
      },
      {
        id: 'sort-recycling',
        title: 'Sort Your Recycling',
        description: 'Separate plastics, paper, and glass correctly for a week.',
        points: 30,
        status: 'Active',
        icon: Recycle,
        color: 'blue'
      },
      {
        id: 'save-water',
        title: 'Save Water',
        description: 'Take 5-minute showers for three days and track usage.',
        points: 25,
        status: 'Active',
        icon: Droplet,
        color: 'cyan'
      }
    ],
    all: [
      {
        id: 'community-tree',
        title: 'Community Tree Drive',
        description: 'Join a local event to plant 2 trees.',
        points: 80,
        status: 'Verified',
        icon: TreeDeciduous
      },
      {
        id: 'recycling-audit',
        title: 'Recycling Audit',
        description: "Audit your home's recycling bin for a week.",
        points: 40,
        status: 'Pending',
        icon: Recycle
      },
      {
        id: 'leak-fix',
        title: 'Leak Fix',
        description: 'Fix a faucet leak at home.',
        points: 35,
        status: 'Active',
        icon: Droplet
      }
    ]
  };

  const handleSubmitProof = (challengeId) => {
    setCurrentChallengeId(challengeId);
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = (uploadData) => {
    console.log('Upload successful:', uploadData);
    // Here you would typically update the challenge status or show a success message
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Target className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Challenge Hub</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-green-50'
            }`}
          >
            Active Tasks
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-green-50'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-green-50'
            }`}
          >
            Pending Verification
          </button>
        </div>

        {/* Spotlight Challenge */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-4 flex-1">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TreeDeciduous className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{challenges.spotlight.title}</h3>
                <p className="text-gray-600 mb-4">{challenges.spotlight.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{challenges.spotlight.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${challenges.spotlight.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleSubmitProof(challenges.spotlight.id)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              Submit Proof
            </button>
          </div>
        </div>

        {/* Suggested Challenges */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Suggested Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {challenges.suggested.map((challenge) => {
            const Icon = challenge.icon;
            return (
              <div key={challenge.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <Target className="w-4 h-4" />
                    +{challenge.points} pts
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-800 mb-2">{challenge.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status: {challenge.status}</span>
                  <button
                    onClick={() => handleSubmitProof(challenge.id)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Submit Proof
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Challenges */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.all.map((challenge) => {
            const Icon = challenge.icon;
            const statusColors = {
              Verified: 'bg-green-100 text-green-700',
              Pending: 'bg-yellow-100 text-yellow-700',
              Active: 'bg-blue-100 text-blue-700'
            };
            
            return (
              <div key={challenge.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="flex items-center gap-1 text-gray-600 text-sm font-medium">
                    <Target className="w-4 h-4" />
                    +{challenge.points} pts
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-800 mb-2">{challenge.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[challenge.status]}`}>
                    {challenge.status}
                  </span>
                  <button
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Submit Proof
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Preview Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Mobile Preview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TreeDeciduous className="w-6 h-6 text-green-600" />
                <span className="font-medium text-gray-800">Plant a Tree</span>
              </div>
              <span className="text-green-600 font-medium">+50 pts</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Recycle className="w-6 h-6 text-green-600" />
                <span className="font-medium text-gray-800">Recycle Right</span>
              </div>
              <span className="text-green-600 font-medium">+30 pts</span>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" />
            Submit Proof
          </button>
        </div>
      </div>
      
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        challengeId={currentChallengeId}
      />
    </div>
  );
};

export default Challenges;