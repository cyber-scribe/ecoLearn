import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
              <span className="font-semibold">{user?.ecoPoints || 1240} pts</span>
            </span>
            
            <img
              src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            
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
