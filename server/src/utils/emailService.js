const SibApiV3Sdk = require('@getbrevo/brevo');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

class EmailService {
  constructor() {
    // Initialize Brevo client
    if (!process.env.BREVO_API_KEY) {
      console.warn('BREVO_API_KEY is not set. Email sending will fail until it is configured.');
      this.apiInstance = null;
    } else {
      const defaultClient = SibApiV3Sdk.ApiClient.instance;
      const apiKey = defaultClient.authentications['api-key'];
      apiKey.apiKey = process.env.BREVO_API_KEY;
      this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      console.log('Brevo API client initialized');
    }

    this.fromEmail = process.env.BREVO_FROM_EMAIL || process.env.EMAIL_USER || 'no-reply@ecolearn.local';
    this.fromName = process.env.BREVO_FROM_NAME || 'EcoLearn';

    if (!process.env.BREVO_FROM_EMAIL && !process.env.EMAIL_USER) {
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

      // Try Brevo first
      if (process.env.BREVO_API_KEY && this.apiInstance) {
        try {
          const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
          sendSmtpEmail.to = [{ email: to }];
          sendSmtpEmail.sender = { email: this.fromEmail, name: this.fromName };
          sendSmtpEmail.subject = subject;
          sendSmtpEmail.htmlContent = html;

          await this.apiInstance.sendTransacEmail(sendSmtpEmail);
          console.log('Email sent successfully via Brevo');
          return true;
        } catch (brevoError) {
          console.error('Brevo failed:', brevoError.response?.body || brevoError.message);
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