import { useState, useEffect } from 'react';
import leaderboardService from '../services/leaderboardService';

export const useLeaderboard = (filters = {}) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [filters]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leaderboardService.getLeaderboard(filters);
      setLeaderboard(data.leaderboard);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { leaderboard, loading, error, refresh: fetchLeaderboard };
};
