const Mailjet = require('node-mailjet');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

class EmailService {
  constructor() {
    // Initialize Mailjet client
    if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
      console.warn('MJ_APIKEY_PUBLIC / MJ_APIKEY_PRIVATE are not set. Email sending will fail until they are configured.');
      this.client = null;
    } else {
      this.client = Mailjet.apiConnect(
        process.env.MJ_APIKEY_PUBLIC,
        process.env.MJ_APIKEY_PRIVATE
      );
      console.log('Mailjet API client initialized');
    }

    this.fromEmail = process.env.MAIL_FROM || process.env.EMAIL_USER || 'no-reply@ecolearn.local';
    this.fromName = process.env.MAIL_FROM_NAME || 'EcoLearn';

    if (!process.env.MAIL_FROM && !process.env.EMAIL_USER) {
      console.warn('No FROM email configured. Using fallback no-reply@ecolearn.local.');
    }

    // Initialize Gmail SMTP as fallback
    this.transporter = null;
    if (process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      console.log('Gmail SMTP transporter configured as fallback');
    }
  }

  async sendEmail(to, subject, template, data) {
    try {
      const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${template}.ejs`);
      const html = await ejs.renderFile(templatePath, data);

      if (!this.fromEmail) {
        console.error('Email sending failed: from email address is not configured.');
        return false;
      }

      // Try Mailjet first
      if (process.env.MJ_APIKEY_PUBLIC && process.env.MJ_APIKEY_PRIVATE && this.client) {
        try {
          const result = await this.client
            .post('send', { version: 'v3.1' })
            .request({
              Messages: [
                {
                  From: { Email: this.fromEmail, Name: this.fromName },
                  To: [{ Email: to }],
                  Subject: subject,
                  HTMLPart: html,
                },
              ],
            });

          const status = result?.body?.Messages?.[0]?.Status;
          if (!status || status === 'success') {
            console.log('Email sent successfully via Mailjet');
            return true;
          }
          console.error('Mailjet failed:', result?.body?.Messages?.[0]?.Errors || status);
        } catch (mailjetError) {
          console.error('Mailjet failed:', mailjetError?.response?.body || mailjetError.message);
        }
      }

      // Fallback to Gmail SMTP
      if (this.transporter) {
        try {
          await this.transporter.sendMail({
            to,
            from: `"${this.fromName}" <${this.fromEmail}>`,
            subject,
            html,
          });
          console.log('Email sent successfully via Gmail SMTP');
          return true;
        } catch (smtpError) {
          console.error('Gmail SMTP failed:', smtpError.message);
        }
      }

      console.error('All email methods failed');
      return false;
    } catch (error) {
      console.error('Email sending failed:', error.message);
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
    return 0; 
  }
}

module.exports = new EmailService();