import React from 'react';

const Card = ({ children, className = '', hover = false, onClick }) => {
  const baseStyles = 'bg-white rounded-xl shadow-lg p-6';
  const hoverStyles = hover ? 'hover:shadow-xl transition-shadow cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;