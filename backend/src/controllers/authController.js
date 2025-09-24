import User from '../models/User.js';
import { tokenService, passwordService, otpService, sessionService, emailService } from '../services/index.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Authentication Controller
 */
class AuthController {
  /**
   * Register a new user
   */
  register = asyncHandler(async (req, res) => {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      birthDate,
      location,
      agreedToTerms,
      agreedToPrivacyPolicy
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await passwordService.hashPassword(password);

    // Generate verification token
    const verificationToken = tokenService.generateVerificationToken();

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      location,
      verification: {
        email: {
          token: verificationToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      },
      agreedToTerms,
      agreedToPrivacyPolicy
    });

    await user.save();

    // Send verification email
    try {
      await emailService.sendEmailVerification(user, verificationToken);
    } catch (error) {
      logger.error('Failed to send verification email:', error);
    }

    // Generate JWT tokens
    const tokens = tokenService.generateTokens(user._id, req.deviceFingerprint);

    // Create session
    const session = sessionService.createSession(
      user._id,
      tokens.sessionId,
      req.deviceFingerprint
    );

    user.sessions.push(session);
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      user: userResponse,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      }
    });
  });

  /**
   * Sign in user
   */
  signIn = asyncHandler(async (req, res) => {
    const { email, password, rememberMe } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.security.accountLockedUntil && user.security.accountLockedUntil > new Date()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Verify password
    const isPasswordValid = await passwordService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      user.security.failedLoginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (user.security.failedLoginAttempts >= 5) {
        user.security.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }
      
      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset failed login attempts on successful login
    user.security.failedLoginAttempts = 0;
    user.security.accountLockedUntil = undefined;
    user.lastLoginAt = new Date();

    // Check if 2FA is enabled
    if (user.twoFactorAuth.enabled) {
      // Generate and send OTP
      const otp = otpService.generateOTP();
      user.twoFactorAuth.tempCode = otp;
      user.twoFactorAuth.tempCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await user.save();

      try {
        await emailService.sendOTP(user, otp, '2FA verification');
      } catch (error) {
        logger.error('Failed to send 2FA OTP:', error);
      }

      return res.status(200).json({
        success: true,
        message: '2FA code sent to your email',
        requiresTwoFactor: true,
        tempToken: tokenService.generateTempToken(user._id)
      });
    }

    // Generate JWT tokens
    const expiresIn = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
    const tokens = tokenService.generateTokens(user._id, req.deviceFingerprint, expiresIn);

    // Create session
    const session = sessionService.createSession(
      user._id,
      tokens.sessionId,
      req.deviceFingerprint,
      expiresIn
    );

    user.sessions.push(session);
    await user.save();

    // Send login notification
    try {
      await emailService.sendLoginNotification(user, req.deviceFingerprint);
    } catch (error) {
      logger.error('Failed to send login notification:', error);
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      user: userResponse,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      }
    });
  });

  /**
   * Verify two-factor authentication
   */
  verifyTwoFactor = asyncHandler(async (req, res) => {
    const { tempToken, code, rememberMe } = req.body;

    // Verify temp token
    const decoded = tokenService.verifyTempToken(tempToken);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Verify OTP
    if (!user.twoFactorAuth.tempCode || user.twoFactorAuth.tempCode !== code) {
      return res.status(401).json({
        success: false,
        message: 'Invalid 2FA code'
      });
    }

    if (user.twoFactorAuth.tempCodeExpiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Expired 2FA code'
      });
    }

    // Clear temp 2FA data
    user.twoFactorAuth.tempCode = undefined;
    user.twoFactorAuth.tempCodeExpiresAt = undefined;
    user.twoFactorAuth.verified = true;
    user.lastLoginAt = new Date();

    // Generate JWT tokens
    const expiresIn = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const tokens = tokenService.generateTokens(user._id, req.deviceFingerprint, expiresIn);

    // Create session
    const session = sessionService.createSession(
      user._id,
      tokens.sessionId,
      req.deviceFingerprint,
      expiresIn
    );

    user.sessions.push(session);
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: '2FA verified successfully',
      user: userResponse,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      }
    });
  });

  /**
   * Send email verification
   */
  sendEmailVerification = asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = tokenService.generateVerificationToken();
    user.verification.email.token = verificationToken;
    user.verification.email.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await user.save();

    // Send verification email
    await emailService.sendEmailVerification(user, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
  });

  /**
   * Verify email
   */
  verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const user = await User.findOne({
      'verification.email.token': token,
      'verification.email.expiresAt': { $gte: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.isEmailVerified = true;
    user.verification.email.token = undefined;
    user.verification.email.expiresAt = undefined;
    user.verification.email.verifiedAt = new Date();

    await user.save();

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user);
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  });

  /**
   * Send password reset email
   */
  sendPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal that user doesn't exist
      return res.status(200).json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset email'
      });
    }

    // Generate reset token
    const resetToken = tokenService.generatePasswordResetToken();
    user.passwordReset.token = resetToken;
    user.passwordReset.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    // Send reset email
    await emailService.sendPasswordReset(user, resetToken);

    res.status(200).json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset email'
    });
  });

  /**
   * Reset password
   */
  resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    const user = await User.findOne({
      'passwordReset.token': token,
      'passwordReset.expiresAt': { $gte: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const hashedPassword = await passwordService.hashPassword(password);

    user.password = hashedPassword;
    user.passwordReset.token = undefined;
    user.passwordReset.expiresAt = undefined;
    user.passwordChangedAt = new Date();

    // Invalidate all sessions
    user.sessions = [];

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  });

  /**
   * Change password
   */
  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isCurrentPasswordValid = await passwordService.comparePassword(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await passwordService.hashPassword(newPassword);

    user.password = hashedPassword;
    user.passwordChangedAt = new Date();

    // Invalidate all other sessions except current
    const currentSessionId = req.user.currentSessionId;
    user.sessions = user.sessions.filter(session => session.sessionId === currentSessionId);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  });

  /**
   * Refresh token
   */
  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    try {
      const decoded = tokenService.verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      // Check if session exists and is active
      const session = user.sessions.find(s => 
        s.sessionId === decoded.sessionId && 
        s.isActive && 
        new Date(s.expiresAt) > new Date()
      );

      if (!session) {
        return res.status(401).json({
          success: false,
          message: 'Session expired or invalid'
        });
      }

      // Generate new tokens
      const tokens = tokenService.generateTokens(user._id, req.deviceFingerprint);

      // Update session
      session.lastActiveAt = new Date();
      await user.save();

      res.status(200).json({
        success: true,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  });

  /**
   * Sign out
   */
  signOut = asyncHandler(async (req, res) => {
    const user = req.user;
    const sessionId = req.sessionId;

    // Remove current session
    user.sessions = user.sessions.filter(session => session.sessionId !== sessionId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Signed out successfully'
    });
  });

  /**
   * Sign out from all devices
   */
  signOutAll = asyncHandler(async (req, res) => {
    const user = req.user;

    // Remove all sessions
    user.sessions = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Signed out from all devices successfully'
    });
  });

  /**
   * Get current user profile
   */
  getProfile = asyncHandler(async (req, res) => {
    const user = req.user;

    // Remove sensitive information
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.sessions;
    delete userResponse.verification;
    delete userResponse.passwordReset;

    res.status(200).json({
      success: true,
      user: userResponse
    });
  });

  /**
   * Enable two-factor authentication
   */
  enableTwoFactor = asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.twoFactorAuth.enabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled'
      });
    }

    user.twoFactorAuth.enabled = true;
    user.twoFactorAuth.enabledAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA enabled successfully'
    });
  });

  /**
   * Disable two-factor authentication
   */
  disableTwoFactor = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const user = req.user;

    // Verify password
    const isPasswordValid = await passwordService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    user.twoFactorAuth.enabled = false;
    user.twoFactorAuth.verified = false;
    user.twoFactorAuth.enabledAt = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA disabled successfully'
    });
  });

  /**
   * Get active sessions
   */
  getSessions = asyncHandler(async (req, res) => {
    const user = req.user;

    const activeSessions = user.sessions
      .filter(session => session.isActive && new Date(session.expiresAt) > new Date())
      .map(session => ({
        sessionId: session.sessionId,
        deviceName: session.deviceName,
        ipAddress: session.ipAddress,
        location: session.location,
        createdAt: session.createdAt,
        lastActiveAt: session.lastActiveAt,
        isCurrent: session.sessionId === req.sessionId
      }));

    res.status(200).json({
      success: true,
      sessions: activeSessions
    });
  });

  /**
   * Revoke session
   */
  revokeSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const user = req.user;

    user.sessions = user.sessions.filter(session => session.sessionId !== sessionId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Session revoked successfully'
    });
  });
}

export default new AuthController();