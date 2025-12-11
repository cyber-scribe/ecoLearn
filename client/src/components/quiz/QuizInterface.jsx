import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const QuizInterface = ({ quiz, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setAnswers({ ...answers, [currentQuestion]: selectedAnswer });
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || null);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const handleSubmit = () => {
    const allAnswers = { ...answers, [currentQuestion]: selectedAnswer };
    onSubmit(allAnswers);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">{currentQ.question}</h2>

        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selectedAnswer === index
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300 bg-white'
              }`}
            >
              <span className="text-gray-800 font-medium">{option}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === index ? 'border-green-600 bg-green-600' : 'border-gray-300'
              }`}>
                {selectedAnswer === index && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
          Prev
        </button>

        <button
          onClick={currentQuestion === quiz.questions.length - 1 ? handleSubmit : handleNext}
          disabled={selectedAnswer === null}
          className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {currentQuestion === quiz.questions.length - 1 ? 'Submit' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuizInterface;
