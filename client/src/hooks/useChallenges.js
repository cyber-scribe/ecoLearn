import { useState, useEffect } from 'react';
import challengeService from '../services/challengeService';

export const useChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [spotlight, setSpotlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const [challengesData, spotlightData] = await Promise.all([
        challengeService.getAllChallenges(),
        challengeService.getSpotlightChallenge(),
      ]);
      setChallenges(challengesData.challenges);
      setSpotlight(spotlightData.challenge);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitChallenge = async (challengeId, data) => {
    try {
      const result = await challengeService.submitChallenge(challengeId, data);
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { challenges, spotlight, loading, error, submitChallenge, refresh: fetchChallenges };
};