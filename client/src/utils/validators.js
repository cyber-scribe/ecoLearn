export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validateForm = (formData) => {
  const errors = {};

  if (!validateName(formData.name)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email address';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
