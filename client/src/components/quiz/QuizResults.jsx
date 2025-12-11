import React from 'react';
import { Trophy, CheckCircle, XCircle } from 'lucide-react';

const QuizResults = ({ results, onRetake, onClose }) => {
  const { score, totalPoints, percentage, answers } = results;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600">Here are your results</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{score}</p>
            <p className="text-sm text-gray-600">Points Earned</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{percentage}%</p>
            <p className="text-sm text-gray-600">Score</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{answers.filter(a => a.isCorrect).length}/{answers.length}</p>
            <p className="text-sm text-gray-600">Correct</p>
          </div>
        </div>

        <div className="space-y-3">
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {answer.isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <span className="text-gray-700">Question {index + 1}</span>
              <span className="ml-auto font-medium text-gray-800">
                {answer.isCorrect ? `+${answer.points}` : '0'} pts
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
          >
            Close
          </button>
          <button
            onClick={onRetake}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
