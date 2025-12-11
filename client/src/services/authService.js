import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('ecolearn_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (payload) => {
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('ecolearn_user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('ecolearn_user'));
  },
};

export default authService;