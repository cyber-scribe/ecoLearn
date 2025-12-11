// server/src/utils/emailService.js
const sgMail = require('@sendgrid/mail');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

class EmailService {
  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SENDGRID_API_KEY is not set. Email sending will fail until it is configured.');
    } else {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || process.env.EMAIL_USER;
  }

  async sendEmail(to, subject, template, data) {
    try {
      const templatePath = path.join(__dirname, `../../templates/emails/${template}.ejs`);
      const html = await ejs.renderFile(templatePath, data);

      const msg = {
        to,
        from: {
          email: this.fromEmail,
          name: 'EcoLearn',
        },
        subject,
        html,
      };

      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error.response?.body || error.message || error);
      return false;
    }
  }

  async sendVerificationEmail(user, verificationLink) {
    return this.sendEmail(
      user.email,
      'Verify your EcoLearn account',
      'verify-email',
      {
        name: user.name,
        verificationLink,
      }
    );
  }

  async sendWelcomeEmail(user) {
    return this.sendEmail(
      user.email,
      'Welcome to EcoLearn!',
      'welcome',
      { name: user.name }
    );
  }

  async sendPasswordResetEmail(user, resetLink) {
    return this.sendEmail(
      user.email,
      'Reset your EcoLearn password',
      'password-reset',
      {
        name: user.name,
        resetLink,
      }
    );
  }

  async sendPointsEarned(user, points, source) {
    return this.sendEmail(
      user.email,
      `🎉 You've earned ${points} EcoPoints!`,
      'points-earned',
      { 
        name: user.name,
        points,
        source,
        totalPoints: await this.getUserTotalPoints(user._id)
      }
    );
  }

  async getUserTotalPoints(userId) {
    // Implement logic to get user's total points
    return 0; // Replace with actual implementation
  }
}

module.exports = new EmailService();