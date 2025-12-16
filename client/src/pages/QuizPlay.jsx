import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, List, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import api from '../services/api';

const QuizPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && timeLeft !== null && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults, quiz]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      setQuiz(response.data.quiz);
      setTimeLeft(response.data.quiz.timeLimit * 60); // Convert to seconds
    } catch (error) {
      setError('Failed to load quiz');
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setAnswers({ ...answers, [currentQuestion]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
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

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      setError('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const answersArray = quiz.questions.map((_, index) => answers[index] || 0);
      const response = await api.post(`/quizzes/${id}/submit`, { answers: answersArray });
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      setError('Failed to submit quiz');
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Average': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => navigate('/quizzes')}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Results Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
              <div className={`text-2xl font-bold mb-2 ${getPerformanceColor(results.performance)}`}>
                {results.performance}
              </div>
              <div className="text-5xl font-bold text-green-600 mb-2">
                {results.percentage.toFixed(1)}%
              </div>
              <p className="text-gray-600">
                You scored {results.score} out of {results.totalPoints} points
              </p>
            </div>

            {/* Eco Points Awarded */}
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Eco Points Earned</h3>
                <div className="text-3xl font-bold text-green-600">+{results.ecoPointsEarned}</div>
                <p className="text-sm text-green-700 mt-1">New Level: {results.newLevel}</p>
              </div>
            </div>

            {/* Question Results */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Review Your Answers</h3>
              {results.results.map((result, index) => (
                <div key={index} className={`border rounded-lg p-4 ${result.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">Q{index + 1}: {result.question}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Your answer: </span>
                          <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {quiz.questions[index].options[result.userAnswer]}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Correct: </span>
                          <span className="text-green-600">
                            {quiz.questions[index].options[result.correctAnswer]}
                          </span>
                        </div>
                      </div>
                      {!result.isCorrect && result.explanation && (
                        <div className="mt-2 p-3 bg-blue-50 rounded text-sm text-blue-800">
                          <strong>Explanation:</strong> {result.explanation}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      {result.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/quizzes')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                More Quizzes
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-red-500" />
                <span className={`font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{quiz.title}</h2>
            <p className="text-sm text-gray-600">{quiz.category} • {quiz.difficulty}</p>
          </div>
          <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50">
            <List className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">{currentQ.question}</h3>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300 bg-white'
                }`}
              >
                <span className="text-gray-800 font-medium">{option}</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === index
                    ? 'border-green-600 bg-green-600'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>
            ))}
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
            Previous
          </button>

          <button
            onClick={currentQuestion === quiz.questions.length - 1 ? handleSubmitQuiz : handleNext}
            disabled={selectedAnswer === null || isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : currentQuestion === quiz.questions.length - 1 ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Quiz
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPlay;
