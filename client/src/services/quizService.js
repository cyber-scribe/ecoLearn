import api from './api';

const quizService = {
  getAllQuizzes: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },

  getQuizById: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  submitQuiz: async (quizId, answers) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },

  getUserQuizHistory: async () => {
    const response = await api.get('/quizzes/history/me');
    return response.data;
  },
};

export default quizService;
