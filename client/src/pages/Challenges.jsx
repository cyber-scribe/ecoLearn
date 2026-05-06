import React, { useEffect, useMemo, useState } from 'react';
import { Upload, TreeDeciduous, Recycle, Droplet, Target, X } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import UploadModal from '../components/UploadModal';
import challengeService from '../services/challengeService';

const POINTS_PER_UPLOAD = 50;

const Challenges = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentChallengeId, setCurrentChallengeId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [previewProof, setPreviewProof] = useState(null);

  const challenges = {
    spotlight: {
      id: 'tree-planting',
      title: 'Plant a Tree 🌳',
      description: "This week's spotlight challenge. Help restore local green spaces.",
      points: POINTS_PER_UPLOAD,
      icon: TreeDeciduous,
      color: 'green'
    },
    suggested: [
      {
        id: 'backyard-sapling',
        title: 'Backyard Sapling',
        description: 'Plant and water a sapling in your yard or community garden.',
        points: 50,
        icon: TreeDeciduous,
        color: 'green'
      },
      {
        id: 'sort-recycling',
        title: 'Sort Your Recycling',
        description: 'Separate plastics, paper, and glass correctly for a week.',
        points: POINTS_PER_UPLOAD,
        icon: Recycle,
        color: 'blue'
      },
      {
        id: 'save-water',
        title: 'Save Water',
        description: 'Take 5-minute showers for three days and track usage.',
        points: POINTS_PER_UPLOAD,
        icon: Droplet,
        color: 'cyan'
      }
    ],
    all: [
      {
        id: 'community-tree',
        title: 'Community Tree Drive',
        description: 'Join a local event to plant 2 trees.',
        points: POINTS_PER_UPLOAD,
        icon: TreeDeciduous
      },
      {
        id: 'recycling-audit',
        title: 'Recycling Audit',
        description: "Audit your home's recycling bin for a week.",
        points: POINTS_PER_UPLOAD,
        icon: Recycle
      },
      {
        id: 'leak-fix',
        title: 'Leak Fix',
        description: 'Fix a faucet leak at home.',
        points: POINTS_PER_UPLOAD,
        icon: Droplet
      }
    ]
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setSubmissionsLoading(true);
        const data = await challengeService.getUserSubmissions();
        setSubmissions(data.submissions || []);
      } catch (error) {
        console.error('Failed to fetch challenge submissions:', error);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getChallengeKey = (challengeId) => {
    if (!challengeId) return '';
    if (typeof challengeId === 'object') {
      return challengeId._id || challengeId.id || '';
    }
    return String(challengeId);
  };

  const latestProofByChallenge = useMemo(() => {
    return submissions.reduce((proofs, submission) => {
      const key = getChallengeKey(submission.challengeId);
      if (!key) return proofs;

      const existing = proofs[key];
      const existingDate = existing ? new Date(existing.createdAt).getTime() : 0;
      const submissionDate = new Date(submission.createdAt).getTime();

      if (!existing || submissionDate > existingDate) {
        proofs[key] = submission;
      }

      return proofs;
    }, {});
  }, [submissions]);

  const renderSavedProof = (challengeId) => {
    const proof = latestProofByChallenge[challengeId];

    if (!proof) {
      return submissionsLoading ? (
        <p className="mt-4 text-xs text-gray-400">Checking saved proof...</p>
      ) : null;
    }

    const mediaUrl = proof.mediaType === 'video' ? proof.proofVideo : proof.proofImage;
    const pointsAwarded = proof.pointsAwarded || POINTS_PER_UPLOAD;

    return (
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-100 bg-green-50 p-3">
        <button
          type="button"
          onClick={() => setPreviewProof({ ...proof, mediaUrl })}
          className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Preview uploaded proof"
        >
          {proof.mediaType === 'video' ? (
            <video src={mediaUrl} className="h-full w-full object-cover" muted />
          ) : (
            <img src={mediaUrl} alt="Uploaded proof thumbnail" className="h-full w-full object-cover" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setPreviewProof({ ...proof, mediaUrl })}
              className="text-left text-sm font-medium text-gray-800 hover:text-green-700"
            >
              Uploaded proof
            </button>
            <span className="flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              +{pointsAwarded} pts
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Click thumbnail to preview</p>
          {proof.description && (
            <p className="text-sm text-gray-600 mt-2">{proof.description}</p>
          )}
        </div>
      </div>
    );
  };

  const getProofButtonText = (challengeId) => (
    latestProofByChallenge[challengeId] ? 'Update Proof' : 'Submit Proof'
  );

  const handleSubmitProof = (challengeId) => {
    setCurrentChallengeId(challengeId);
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = (uploadData) => {
    console.log('Upload successful:', uploadData);
    const savedSubmission = uploadData.submission || {
      _id: uploadData.submissionId || uploadData.public_id,
      challengeId: uploadData.challengeId,
      proofImage: uploadData.resource_type === 'image' ? uploadData.url : undefined,
      proofVideo: uploadData.resource_type === 'video' ? uploadData.url : undefined,
      mediaType: uploadData.resource_type,
      publicId: uploadData.public_id,
      description: uploadData.description,
      status: 'approved',
      pointsAwarded: uploadData.pointsAwarded || POINTS_PER_UPLOAD,
      createdAt: new Date().toISOString()
    };

    setSubmissions((currentSubmissions) => [
      savedSubmission,
      ...currentSubmissions.filter((submission) => submission._id !== savedSubmission._id)
    ]);
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

        {/* Spotlight Challenge */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex gap-4 flex-1">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TreeDeciduous className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{challenges.spotlight.title}</h3>
                <p className="text-gray-600 mb-4">{challenges.spotlight.description}</p>
                
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  <Target className="w-4 h-4" />
                  +{POINTS_PER_UPLOAD} points per upload
                </div>
              </div>
            </div>
            <button
              onClick={() => handleSubmitProof(challenges.spotlight.id)}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              {getProofButtonText(challenges.spotlight.id)}
            </button>
          </div>
          {renderSavedProof(challenges.spotlight.id)}
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
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <Target className="w-4 h-4" />
                    +{POINTS_PER_UPLOAD} pts per upload
                  </span>
                  <button
                    onClick={() => handleSubmitProof(challenge.id)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    {getProofButtonText(challenge.id)}
                  </button>
                </div>
                {renderSavedProof(challenge.id)}
              </div>
            );
          })}
        </div>

        {/* All Challenges */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.all.map((challenge) => {
            const Icon = challenge.icon;
            
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
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <Target className="w-4 h-4" />
                    +{POINTS_PER_UPLOAD} pts per upload
                  </span>
                  <button
                    onClick={() => handleSubmitProof(challenge.id)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    {getProofButtonText(challenge.id)}
                  </button>
                </div>
                {renderSavedProof(challenge.id)}
              </div>
            );
          })}
        </div>

        {/* Mobile Preview Section */}
        {/* <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
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
        </div> */}
      </div>
      
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        challengeId={currentChallengeId}
      />

      {previewProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4">
          <div className="relative w-full max-w-3xl rounded-lg bg-white p-4 shadow-xl">
            <button
              type="button"
              onClick={() => setPreviewProof(null)}
              className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-700 shadow hover:text-gray-900"
              aria-label="Close proof preview"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="pt-8">
              {previewProof.mediaType === 'video' ? (
                <video src={previewProof.mediaUrl} controls className="w-full rounded-md bg-black" style={{ maxHeight: '70vh' }} />
              ) : (
                <img src={previewProof.mediaUrl} alt="Uploaded proof preview" className="w-full rounded-md object-contain" style={{ maxHeight: '70vh' }} />
              )}
            </div>
            {previewProof.description && (
              <p className="mt-3 text-sm text-gray-700">{previewProof.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;
