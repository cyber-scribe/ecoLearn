import React from 'react';
import { Circle, CheckCircle } from 'lucide-react';

const AnswerOption = ({ text, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-green-600 bg-green-50'
          : 'border-gray-200 hover:border-green-300 bg-white'
      }`}
    >
      <span className="text-gray-800 font-medium">{text}</span>
      {selected ? (
        <CheckCircle className="w-6 h-6 text-green-600" />
      ) : (
        <Circle className="w-6 h-6 text-gray-300" />
      )}
    </button>
  );
};

export default AnswerOption;