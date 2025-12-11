import React from 'react';
import { Award, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const BadgesDisplay = () => {
  return (
    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Badges</h2>
        </div>
        <Link
          to="/badges"
          className="flex items-center gap-1 text-green-700 hover:text-green-800 text-sm"
        >
          <Eye className="w-4 h-4" />
          View All
        </Link>
      </div>
      <p className="text-gray-600 text-sm">New: Recycling Pro, Water Saver, Tree Planter.</p>
    </div>
  );
};

export default BadgesDisplay;