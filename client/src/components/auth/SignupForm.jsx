// SignupForm.jsx
import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { validateName, validateEmail } from '../../utils/validators';
import Button from '../common/Button';
import Input from '../common/Input';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { register, loading } = useUser();

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

    if (!validateName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="text-gray-600">Join our community today</p>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
        </div>

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
            placeholder="Create a password"
            autoComplete="new-password"
            required
          />
        </div>

        <div>
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          Create Account
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-green-600 hover:text-green-500">
          Sign in
        </a>
      </p>
    </form>
  );
};

export default SignupForm;