// LoginForm.jsx
import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { validateEmail } from '../../utils/validators';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const { login, loading } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await login(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-center text-gray-900">Welcome back</h2>
        <p className="text-center text-gray-600">Sign in to your account</p>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="flex items-center justify-end">
          <a
            href="/forgot-password"
            className="text-sm font-medium text-green-600 hover:text-green-500"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          Sign in
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/signup" className="font-medium text-green-600 hover:text-green-500">
          Sign up
        </a>
      </p>
    </form>
  );
};

export default LoginForm;