import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

/**
 * Email Service for sending authentication emails
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@hcsub.com';
    this.fromName = process.env.FROM_NAME || 'HCSub Team';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter
   */
  initializeTransporter() {
    try {
      // For development, you can use ethereal email or Gmail
      if (process.env.NODE_ENV === 'development') {
        // For development - using ethereal email
        this.transporter = nodemailer.createTransporter({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: process.env.ETHEREAL_EMAIL || 'ethereal.user@ethereal.email',
            pass: process.env.ETHEREAL_PASSWORD || 'ethereal.pass'
          }
        });
      } else {
        // For production - using your email service (Gmail, SendGrid, etc.)
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        });
      }

      logger.info('Email transporter initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email transporter:', error);
    }
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(user, verificationToken) {
    try {
      const verificationUrl = `${this.frontendUrl}/verify-email?token=${verificationToken}`;
      
      const mailOptions = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: user.email,
        subject: 'Verify Your Email Address - HCSub',
        html: this.getEmailVerificationTemplate(user, verificationUrl)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to ${user.email}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(user, resetToken) {
    try {
      const resetUrl = `${this.frontendUrl}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: user.email,
        subject: 'Password Reset Request - HCSub',
        html: this.getPasswordResetTemplate(user, resetUrl)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${user.email}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send OTP email
   */
  async sendOTP(user, otp, purpose = 'verification') {
    try {
      const mailOptions = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: user.email,
        subject: `Your OTP Code - HCSub`,
        html: this.getOTPTemplate(user, otp, purpose)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`OTP email sent to ${user.email}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Failed to send OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(user) {
    try {
      const mailOptions = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: user.email,
        subject: 'Welcome to HCSub Community! 🎉',
        html: this.getWelcomeTemplate(user)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Welcome email sent to ${user.email}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  /**
   * Send login notification
   */
  async sendLoginNotification(user, loginInfo) {
    try {
      const mailOptions = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: user.email,
        subject: 'New Login to Your Account - HCSub',
        html: this.getLoginNotificationTemplate(user, loginInfo)
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Login notification sent to ${user.email}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Failed to send login notification:', error);
      // Don't throw error for notifications, just log
    }
  }

  /**
   * Email verification template
   */
  getEmailVerificationTemplate(user, verificationUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6366F1; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #6366F1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to HCSub!</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.firstName || user.email}!</h2>
            <p>Thank you for joining HCSub, the community resource sharing platform. To complete your registration, please verify your email address by clicking the button below:</p>
            
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            
            <p>This verification link will expire in 24 hours.</p>
            
            <p>If you didn't create an account with HCSub, please ignore this email.</p>
            
            <p>Best regards,<br>The HCSub Team</p>
          </div>
          <div class="footer">
            <p>© 2025 HCSub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Password reset template
   */
  getPasswordResetTemplate(user, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.firstName || user.email}!</h2>
            <p>We received a request to reset your password for your HCSub account. Click the button below to create a new password:</p>
            
            <a href="${resetUrl}" class="button">Reset Password</a>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            
            <p>This reset link will expire in 1 hour for security reasons.</p>
            
            <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            
            <p>Best regards,<br>The HCSub Team</p>
          </div>
          <div class="footer">
            <p>© 2025 HCSub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * OTP template
   */
  getOTPTemplate(user, otp, purpose) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .otp-code { font-size: 24px; font-weight: bold; background: #e5e7eb; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your OTP Code</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.firstName || user.email}!</h2>
            <p>Your one-time password (OTP) for ${purpose} is:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p>This code will expire in 10 minutes. Please use it immediately.</p>
            
            <p>If you didn't request this code, please ignore this email or contact our support team.</p>
            
            <p>Best regards,<br>The HCSub Team</p>
          </div>
          <div class="footer">
            <p>© 2025 HCSub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Welcome email template
   */
  getWelcomeTemplate(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to HCSub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366F1, #10B981); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .feature { background: white; padding: 20px; margin: 10px 0; border-radius: 5px; }
          .button { display: inline-block; background: #6366F1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to HCSub!</h1>
            <p>Your community resource sharing journey starts here</p>
          </div>
          <div class="content">
            <h2>Hi ${user.firstName || user.email}!</h2>
            <p>Welcome to HCSub, the revolutionary community resource sharing platform! We're excited to have you join our community.</p>
            
            <div class="feature">
              <h3>🏠 Share Resources</h3>
              <p>Share tools, equipment, and items with your neighbors</p>
            </div>
            
            <div class="feature">
              <h3>💬 Connect with Community</h3>
              <p>Chat with neighbors and build meaningful connections</p>
            </div>
            
            <div class="feature">
              <h3>📱 Smart IoT Integration</h3>
              <p>Monitor your shared items with advanced IoT features</p>
            </div>
            
            <a href="${this.frontendUrl}/dashboard" class="button">Explore Dashboard</a>
            
            <p>Need help getting started? Check out our <a href="${this.frontendUrl}/help">Help Center</a> or reply to this email.</p>
            
            <p>Happy sharing!<br>The HCSub Team</p>
          </div>
          <div class="footer">
            <p>© 2025 HCSub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Login notification template
   */
  getLoginNotificationTemplate(user, loginInfo) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Login Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .info-box { background: #e5e7eb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 New Login Alert</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.firstName || user.email}!</h2>
            <p>We detected a new login to your HCSub account. Here are the details:</p>
            
            <div class="info-box">
              <strong>Time:</strong> ${new Date(loginInfo.timestamp).toLocaleString()}<br>
              <strong>IP Address:</strong> ${loginInfo.ipAddress}<br>
              <strong>Device:</strong> ${loginInfo.userAgent}<br>
              <strong>Location:</strong> ${loginInfo.location || 'Unknown'}
            </div>
            
            <p>If this was you, no further action is needed.</p>
            
            <p>If you don't recognize this activity, please <a href="${this.frontendUrl}/security">secure your account</a> immediately and change your password.</p>
            
            <p>Best regards,<br>The HCSub Team</p>
          </div>
          <div class="footer">
            <p>© 2025 HCSub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Create service instance
const emailService = new EmailService();

export { EmailService, emailService };