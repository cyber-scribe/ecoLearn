import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Star, Filter, Search, Brain, Leaf, Droplet, Zap, Heart } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import api from '../services/api';

const categoryIcons = {
  'Recycling': <Brain className="w-6 h-6" />,
  'Energy': <Zap className="w-6 h-6" />,
  'Water': <Droplet className="w-6 h-6" />,
  'Climate': <Leaf className="w-6 h-6" />,
  'Lifestyle': <Heart className="w-6 h-6" />,
  'Nature': <Leaf className="w-6 h-6" />
};

const difficultyColors = {
  'easy': 'bg-green-100 text-green-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'hard': 'bg-red-100 text-red-800'
};

const QuizSelection = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
  }, [selectedCategory, selectedDifficulty]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      
      const response = await api.get('/quizzes', { params });
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/quizzes/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Eco Quizzes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your environmental knowledge and earn eco-points! Choose from various categories and difficulty levels.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedDifficulty('');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Quiz Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No quizzes found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Quiz Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        {categoryIcons[quiz.category] || <BookOpen className="w-6 h-6 text-green-600" />}
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">{quiz.category}</span>
                        <h3 className="font-semibold text-gray-800">{quiz.title}</h3>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[quiz.difficulty]}`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">{quiz.questions?.length || 0}</span>
                      </div>
                      <span className="text-xs text-gray-500">Questions</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{quiz.timeLimit}</span>
                      </div>
                      <span className="text-xs text-gray-500">Minutes</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">{quiz.totalPoints}</span>
                      </div>
                      <span className="text-xs text-gray-500">Points</span>
                    </div>
                  </div>

                  {/* Start Quiz Button */}
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className="w-full block text-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Start Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSelection;
