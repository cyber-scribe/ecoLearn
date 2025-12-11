import api from './api';

const challengeService = {
  getAllChallenges: async () => {
    const response = await api.get('/challenges');
    return response.data;
  },

  getSpotlightChallenge: async () => {
    const response = await api.get('/challenges/spotlight');
    return response.data;
  },

  submitChallenge: async (challengeId, submissionData) => {
    const response = await api.post(`/challenges/${challengeId}/submit`, submissionData);
    return response.data;
  },

  getUserSubmissions: async () => {
    const response = await api.get('/challenges/submissions/me');
    return response.data;
  },
};

export default challengeService;