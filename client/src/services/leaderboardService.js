import api from './api';

const leaderboardService = {
  getLeaderboard: async (params = {}) => {
    const response = await api.get('/leaderboard', { params });
    return response.data;
  },

  getUserRank: async (userId) => {
    const response = await api.get(`/leaderboard/rank/${userId}`);
    return response.data;
  },

  getClassLeaderboard: async (school, grade) => {
    const response = await api.get('/leaderboard', {
      params: { school, grade }
    });
    return response.data;
  },
};

export default leaderboardService;
