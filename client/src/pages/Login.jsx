import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Sparkles, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Login = ({ initialMode = 'login' }) => {
  const location = useLocation();
  const [isFlipped, setIsFlipped] = useState(initialMode === 'signup');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [resendStatus, setResendStatus] = useState({ loading: false, message: '', error: '', link: '' });
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [signupSubmitting, setSignupSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const { login, register, resendVerification } = useAuth();
  const navigate = useNavigate();
  const loginFormRef = useRef(null);
  const signupFormRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState('560px');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryMode = params.get('mode');
    const stateMode = location.state?.mode;
    const mode = stateMode || queryMode || initialMode;

    if (mode === 'signup' && !isFlipped) {
      setIsFlipped(true);
    } else if (mode === 'login' && isFlipped) {
      setIsFlipped(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMode, location.key, location.search, location.state]);

  useEffect(() => {
    const calculateHeight = () => {
      const loginHeight = loginFormRef.current?.offsetHeight ?? 0;
      const signupHeight = signupFormRef.current?.offsetHeight ?? 0;
      const maxHeight = Math.max(loginHeight, signupHeight, 520);
      setContainerHeight(`${Math.ceil(maxHeight)}px`);
    };

    const frame = requestAnimationFrame(calculateHeight);
    window.addEventListener('resize', calculateHeight);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', calculateHeight);
    };
  }, [
    isFlipped,
    loginData.email,
    loginData.password,
    loginData.remember,
    signupData.name,
    signupData.email,
    signupData.password,
    signupData.confirmPassword,
    loginError,
    signupError,
    showLoginPassword,
    showSignupPassword,
    showSignupConfirm,
    successMessage,
  ]);

  const handleLoginChange = (event) => {
    const { name, value, type, checked } = event.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (signupError) {
      setSignupError('');
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');
    setSignupError('');
    setSuccessMessage('');
    setResendStatus({ loading: false, message: '', error: '', link: '' });
    setLoginSubmitting(true);
    try {
      const response = await login({
        email: loginData.email,
        password: loginData.password,
      });

      if (!response.success) {
        setLoginError(response.error || 'Failed to log in');
        if (response.data?.requiresVerification) {
          setPendingVerificationEmail(loginData.email);
        } else {
          setPendingVerificationEmail('');
        }
        return;
      }

      setPendingVerificationEmail('');
      navigate('/');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setSignupError('');
    setLoginError('');
    setSuccessMessage('');
    setResendStatus({ loading: false, message: '', error: '', link: '' });

    if (!signupData.name.trim()) {
      setSignupError('Please enter your full name');
      return;
    }

    if (signupData.password.length < 6) {
      setSignupError('Password must be at least 6 characters long');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    setSignupSubmitting(true);
    try {
      const response = await register({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });

      if (!response.success) {
        setSignupError(response.error || 'Failed to sign up. Please try again.');
        return;
      }

      setSuccessMessage('Account created! Check your inbox for a verification email before logging in.');
      setIsFlipped(false);
      setPendingVerificationEmail('');
      setSignupData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } finally {
      setSignupSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!pendingVerificationEmail || resendStatus.loading) return;
    setResendStatus({ loading: true, message: '', error: '', link: '' });
    const response = await resendVerification(pendingVerificationEmail);
    if (response.success) {
      setResendStatus({
        loading: false,
        message: response.data?.message || 'Verification email resent. Please check your inbox.',
        error: '',
        link: response.data?.verificationLink || '',
      });
    } else {
      setResendStatus({
        loading: false,
        message: '',
        error: response.error || 'Failed to resend verification email.',
        link: '',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Imagery */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"
          alt="Nature"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-12 left-12 text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">Grow a greener future</h2>
          <p className="text-lg opacity-90">
            Learn, act, and track your impact.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="w-full max-w-md">
          <div
            className={`auth-container ${isFlipped ? 'flipped' : ''}`}
            style={{ height: containerHeight }}
          >
            {/* Login Form */}
            <div className="auth-form login-form" ref={loginFormRef}>
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full h-fit flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">EcoLearn</h1>
                </div>

                <p className="text-gray-600 mb-6 text-center">
                  Welcome back! Start learning by doing.
                </p>

                <div className="flex gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    className={`flex-1 py-2 border-b-2 font-medium transition-colors ${
                      !isFlipped ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-green-600'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className={`flex-1 py-2 border-b-2 font-medium transition-colors ${
                      isFlipped ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-green-600'
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                {loginError && !isFlipped && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {loginError}
                  </div>
                )}

                {!isFlipped && pendingVerificationEmail && (
                  <div className="mb-4 space-y-3">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendStatus.loading}
                      className={`w-full text-sm font-medium py-2 px-4 rounded-lg border border-green-600 text-green-600 hover:bg-green-50 transition-colors ${resendStatus.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {resendStatus.loading ? 'Sending verification email...' : 'Resend verification email'}
                    </button>
                    {resendStatus.message && (
                      <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                        {resendStatus.message}
                        {resendStatus.link && (
                          <div className="mt-2 break-all">
                            <span className="font-medium">Manual link:</span> {resendStatus.link}
                          </div>
                        )}
                      </div>
                    )}
                    {resendStatus.error && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {resendStatus.error}
                      </div>
                    )}
                    {!resendStatus.loading && !resendStatus.message && !resendStatus.error && (
                      <p className="text-xs text-gray-500 text-center">
                        Didn’t receive the email?
                      </p>
                    )}
                  </div>
                )}

                {successMessage && !isFlipped && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4 flex-1 flex flex-col">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={showLoginPassword ? 'yourPassword' : '••••••••'}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-green-600"
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="text-right mt-2">
                      <Link to="/reset-password" className="text-sm text-green-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="remember"
                        checked={loginData.remember}
                        onChange={handleLoginChange}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loginSubmitting}
                    className={`w-full bg-green-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto ${
                      loginSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                    }`}
                  >
                    {loginSubmitting ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <Leaf className="w-5 h-5" />
                        Login
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Signup Form */}
            <div className="auth-form signup-form" ref={signupFormRef}>
              <div className="bg-white rounded-2xl shadow-2xl p-8 h-fit flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">EcoLearn</h1>
                </div>

                <p className="text-gray-600 mb-4 text-center">
                  Join our community of eco-learners today!
                </p>

                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    className={`flex-1 py-2 border-b-2 font-medium transition-colors ${
                      !isFlipped ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-green-600'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className={`flex-1 py-2 border-b-2 font-medium transition-colors ${
                      isFlipped ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-green-600'
                    }`}
                  >
                    Sign up
                  </button>
                </div>

                {signupError && isFlipped && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {signupError}
                  </div>
                )}

                {successMessage && isFlipped && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-4 flex-1 flex flex-col">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={signupData.name}
                        onChange={handleSignupChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Name"
                        autoComplete="name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={showSignupPassword ? 'Create a password' : '••••••••'}
                        autoComplete="new-password"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-green-600"
                        aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showSignupConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={showSignupConfirm ? 'Confirm your password' : '••••••••'}
                        autoComplete="new-password"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupConfirm((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-green-600"
                        aria-label={showSignupConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showSignupConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={signupSubmitting}
                    className={`w-full bg-green-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto ${
                      signupSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                    }`}
                  >
                    {signupSubmitting ? (
                      <span>Creating account...</span>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Create account
                      </>
                    )}
                  </button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Log in
                  </button>
                </p>
                <p className="mt-6 text-center text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <button
              type="button"
              className="text-green-600 hover:underline"
              onClick={() => window.open('#', '_blank')}
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              className="text-green-600 hover:underline"
              onClick={() => window.open('#', '_blank')}
            >
              Privacy Policy
            </button>
            .
          </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
