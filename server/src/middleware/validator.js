// server/src/middleware/validator.js
const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      errors: errorMessages
    });
  };
};

// Common validation rules
const commonRules = {
  email: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
  ],
  password: [
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  name: [
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long')
  ]
};

module.exports = {
  validate,
  commonRules
};