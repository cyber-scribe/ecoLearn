import React from 'react';

const ProgressBar = ({ progress, height = 'h-2', color = 'green', showLabel = false }) => {
  const colors = {
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
  };

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div
          className={`${colors[color]} ${height} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;