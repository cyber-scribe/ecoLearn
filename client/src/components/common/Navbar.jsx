import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Navbar = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get('/auth/profile');
        setCurrentUser(response.data.user);
        if (updateUser) {
          updateUser(response.data.user);
        }
        console.log('Navbar: Fetched user data:', response.data.user);
      } catch (error) {
        // Silently fail - user data will stay as is
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [updateUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">EcoLearn</span>
          </Link>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-gray-700">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="font-semibold">{currentUser?.ecoPoints || user?.ecoPoints || 0} pts</span>
            </span>

            <Link to="/profile">
              <img
                src={
                  currentUser?.avatar || user?.avatar ||
                  'https://ui-avatars.com/api/?name=' +
                    encodeURIComponent(currentUser?.name || user?.name || '') +
                    '&background=16a34a&color=fff'
                }
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </Link>

            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
