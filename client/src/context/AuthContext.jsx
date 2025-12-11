import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('ecolearn_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed?.user || parsed);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        setError('Failed to load user session');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      localStorage.setItem('ecolearn_user', JSON.stringify({
        token: data.token,
        user: data.user,
      }));

      setError(null);
      return { success: true, data };
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || 'Failed to log in';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      const data = await authService.register(formData);
      setError(null);
      return { success: true, data };
    } catch (err) {
      console.error('Register error:', err);
      const message = err.response?.data?.message || 'Failed to sign up';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    try {
      setUser(null);
      localStorage.removeItem('ecolearn_user');

      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out');
      return { success: false, error: 'Failed to log out' };
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  const requestPasswordReset = async (email) => {
    try {
      const data = await authService.forgotPassword(email);
      return { success: true, data };
    } catch (error) {
      console.error('Password reset request error:', error);
      const message = error.response?.data?.message || 'Failed to send reset link';
      return { success: false, error: message };
    }
  };

  const resetPassword = async ({ token, password }) => {
    try {
      const data = await authService.resetPassword({ token, password });
      return { success: true, data };
    } catch (error) {
      console.error('Reset password error:', error);
      const message = error.response?.data?.message || 'Failed to reset password';
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated,
    setError,
    requestPasswordReset,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};