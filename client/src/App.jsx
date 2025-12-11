import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Badges from './pages/Badges';

// Auth wrapper component
const AuthWrapper = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Public route wrapper
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicRoute><Login /></PublicRoute>} path="/login" />
          <Route path="/signup" element={<PublicRoute><Login initialMode="signup" /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          
          {/* Protected routes */}
          <Route element={<AuthWrapper />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/badges" element={<Badges />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;