import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import authService from '../services/authService';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState({ state: 'loading', message: '' });
  const [manualLink, setManualLink] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus({ state: 'error', message: 'Verification token is missing. Please use the link from your email.' });
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        if (response.success) {
          setStatus({ state: 'success', message: response.message || 'Your email has been verified successfully!' });
        } else {
          setStatus({ state: 'error', message: response.message || 'Failed to verify email. Please try again.' });
          if (response.verificationLink) {
            setManualLink(response.verificationLink);
          }
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Verification failed. The link may have expired. Request a new one from the login page.';
        setStatus({ state: 'error', message });
      }
    };

    verify();
  }, [token]);

  const renderIcon = () => {
    if (status.state === 'loading') {
      return <Loader2 className="w-12 h-12 text-green-600 animate-spin" />;
    }
    if (status.state === 'success') {
      return <CheckCircle className="w-12 h-12 text-green-600" />;
    }
    return <AlertCircle className="w-12 h-12 text-red-500" />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center space-y-6">
          <div className="flex justify-center">{renderIcon()}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {status.state === 'success' && 'Email Verified!'}
              {status.state === 'loading' && 'Verifying your email'}
              {status.state === 'error' && 'Verification Issue'}
            </h1>
            <p className="text-gray-600">{status.message}</p>
          </div>

          {status.state === 'success' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">You can now log in to your EcoLearn account.</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
              >
                Go to login
              </Link>
            </div>
          )}

          {status.state === 'error' && (
            <div className="space-y-4">
              {manualLink && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm break-all">
                  <p className="font-medium">Manual verification link:</p>
                  <p>{manualLink}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  If the link has expired, return to the login page and choose "Resend verification email".
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-green-600 text-green-600 font-medium hover:bg-green-50 transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </div>
          )}

          {status.state === 'loading' && (
            <div className="text-sm text-gray-500">
              This may take a moment. Please do not close this tab.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
