import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LockKeyhole, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const location = useLocation();
  const urlToken = useMemo(() => new URLSearchParams(location.search).get('token') || '', [location.search]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [step, setStep] = useState(urlToken ? 2 : 1); // 1: email input, 2: password reset
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { requestPasswordReset, resetPassword } = useAuth();

  useEffect(() => {
    if (urlToken) {
      setStep(2);
    }
  }, [urlToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (step === 1) {
      if (!email) {
        setError('Please enter your email address');
        return;
      }
      setLoading(true);
      try {
        const response = await requestPasswordReset(email);
        if (!response.success) {
          setError(response.error || 'Failed to send reset email. Please try again.');
          return;
        }
        setSuccess('If that email exists, a password reset link has been sent. Check your inbox.');
        setStep(2);
      } catch (err) {
        setError('Failed to send reset email. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      setLoading(true);
      try {
        const response = await resetPassword({
          token: urlToken,
          password,
        });

        if (!response.success) {
          setError(response.error || 'Failed to reset password. Please try again.');
          return;
        }

        setSuccess('Password reset successful. Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { state: { mode: 'login', message: 'Password reset successful. Please login with your new password.' } });
        }, 2000);
      } catch (err) {
        setError('Failed to reset password. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to login
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {step === 1 ? 'Reset your password' : 'Create new password'}
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 1
                ? 'Enter your email and we\'ll send you a link to reset your password.'
                : 'Create a new password for your account.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockKeyhole className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPasswords ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockKeyhole className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPasswords ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => !prev)}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  {showPasswords ? 'Hide passwords' : 'Show passwords'}
                </button>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading
                  ? 'Processing...'
                  : step === 1
                  ? 'Send reset link'
                  : 'Reset password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
