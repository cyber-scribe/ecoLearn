const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const EmailService = require('../utils/emailService');

// @desc    Forgot password - send reset link to email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent',
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetLink = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  await EmailService.sendPasswordResetEmail(user, resetLink);

  res.status(200).json({
    success: true,
    message: 'If an account with that email exists, a reset link has been sent',
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    res.status(400);
    throw new Error('Token is required');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Verification token is invalid or has expired');
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});
