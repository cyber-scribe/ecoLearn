import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useEcoPoints = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState(user?.ecoPoints || 0);
  const [level, setLevel] = useState(user?.level || 1);

  useEffect(() => {
    setPoints(user?.ecoPoints || 0);
    setLevel(user?.level || 1);
  }, [user]);

  const calculateNextLevel = () => {
    return level * 200;
  };

  const getProgress = () => {
    const nextLevelPoints = calculateNextLevel();
    return Math.min((points / nextLevelPoints) * 100, 100);
  };

  return {
    points,
    level,
    nextLevelPoints: calculateNextLevel(),
    progress: getProgress(),
  };
};