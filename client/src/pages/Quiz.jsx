import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, List, CheckCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});

  const quiz = {
    title: 'Recycling Basics',
    category: 'Recycling',
    difficulty: 'Easy',
    totalQuestions: 10,
    questions: [
      {
        id: 1,
        question: 'Which bin should clean glass bottles go into?',
        options: [
          { id: 'a', text: 'Compost bin', icon: '🌱' },
          { id: 'b', text: 'Recycling bin', icon: '♻️' },
          { id: 'c', text: 'General waste after rinsing', icon: '💧' },
          { id: 'd', text: 'Garden waste', icon: '🌿' }
        ],
        correctAnswer: 'b',
        tip: 'Rinse containers before recycling to avoid contamination.',
        bonus: 'Answer streak +10 pts'
      }
    ]
  };

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.totalQuestions) * 100;

  const handleNext = () => {
    if (currentQuestion < quiz.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      setAnswers({ ...answers, [currentQuestion]: selectedAnswer });
      alert('Answer submitted! Moving to next question...');
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Question {currentQuestion + 1} of {quiz.totalQuestions}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50">
              <List className="w-5 h-5 text-gray-600" />
            </button>
            <div className="bg-white rounded-full px-4 py-2 shadow-md">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                  <circle cx="24" cy="24" r="20" stroke="#16a34a" strokeWidth="4" fill="none"
                    strokeDasharray={`${progress * 1.26} 126`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-green-600">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Tip</span>
            </div>
            <p className="text-sm text-gray-800">Short daily actions add up to big impact.</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2 text-green-700 text-sm mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>Bonus</span>
            </div>
            <p className="text-sm text-green-800">{currentQ.bonus}</p>
          </div>
        </div>

        {/* Instruction */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm text-blue-800">
            💡 Choose the best answer, then submit to lock it in.
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-sm text-gray-500">Category: {quiz.category}</span>
              <span className="ml-4 text-sm text-gray-500">Difficulty: {quiz.difficulty}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8">{currentQ.question}</h2>

          <div className="space-y-4">
            {currentQ.options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedAnswer(option.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedAnswer === option.id
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-gray-800 font-medium">{option.text}</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === option.id
                    ? 'border-green-600 bg-green-600'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === option.id && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700">
              💡 <strong>Eco tip:</strong> {currentQ.tip}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Prev
          </button>

          <button className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50">
            <List className="w-5 h-5" />
          </button>

          <button
            onClick={currentQuestion === quiz.totalQuestions - 1 ? handleSubmit : handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
          >
            {currentQuestion === quiz.totalQuestions - 1 ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit
              </>
            ) : (
              <>
                Submit
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
