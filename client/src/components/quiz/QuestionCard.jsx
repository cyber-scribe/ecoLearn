import React from 'react';

const QuestionCard = ({ question, selectedAnswer, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{question.text}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedAnswer === index
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
