const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const EmailService = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    const verificationToken = user.createEmailVerificationToken();
    await user.save();

    const verificationLink = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    const emailSent = await EmailService.sendVerificationEmail(user, verificationLink);

    return res.status(201).json({
      success: true,
      message: emailSent
        ? 'Registration successful. Please verify your email to activate your account.'
        : 'Registration successful. Email delivery is not configured, so copy the verification link below to verify manually or configure email delivery.',
      emailDelivery: emailSent,
      verificationLink: emailSent ? undefined : verificationLink,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a verification email has been sent.',
      });
    }

    if (user.emailVerified) {
      return res.status(200).json({
        success: true,
        message: 'Your email is already verified. You can log in now.',
        alreadyVerified: true,
      });
    }

    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationLink = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    const emailSent = await EmailService.sendVerificationEmail(user, verificationLink);

    return res.status(200).json({
      success: true,
      message: emailSent
        ? 'Verification email resent. Please check your inbox.'
        : 'Email delivery is not configured. Copy the verification link below or configure email delivery.',
      emailDelivery: emailSent,
      verificationLink: emailSent ? undefined : verificationLink,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
        requiresVerification: true,
      });
    }

    user.lastActive = Date.now();
    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        ecoPoints: user.ecoPoints,
        level: user.level,
        emailVerified: user.emailVerified,
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Verification token is invalid or has expired' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    await EmailService.sendWelcomeEmail(user);

    res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const emailSent = await EmailService.sendPasswordResetEmail(user, resetLink);

    res.status(200).json({
      success: true,
      message: emailSent
        ? 'If an account with that email exists, a reset link has been sent.'
        : 'Email delivery is not configured, so copy the reset link below to reset manually or configure email delivery.',
      emailDelivery: emailSent,
      resetLink: emailSent ? undefined : resetLink,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
