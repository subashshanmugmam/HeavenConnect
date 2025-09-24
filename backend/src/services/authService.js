import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';
import logger from '../utils/logger.js';

/**
 * JWT Token Service for authentication
 */
class TokenService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpire = process.env.JWT_EXPIRE || '7d';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    this.jwtRefreshExpire = process.env.JWT_REFRESH_EXPIRE || '30d';
    
    if (!this.jwtSecret || !this.jwtRefreshSecret) {
      throw new Error('JWT secrets must be defined in environment variables');
    }
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpire,
      issuer: 'hcsub-api',
      audience: 'hcsub-client'
    });
  }

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: this.jwtRefreshExpire,
      issuer: 'hcsub-api',
      audience: 'hcsub-client'
    });
  }

  /**
   * Verify access token
   */
  async verifyAccessToken(token) {
    try {
      const decoded = await promisify(jwt.verify)(token, this.jwtSecret);
      return { success: true, decoded };
    } catch (error) {
      logger.error('Access token verification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(token) {
    try {
      const decoded = await promisify(jwt.verify)(token, this.jwtRefreshSecret);
      return { success: true, decoded };
    } catch (error) {
      logger.error('Refresh token verification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate token pair (access + refresh)
   */
  generateTokenPair(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({ id: user._id });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.jwtExpire,
      tokenType: 'Bearer'
    };
  }

  /**
   * Extract token from authorization header
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  }
}

/**
 * Password Service for hashing and verification
 */
class PasswordService {
  constructor() {
    this.saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  }

  /**
   * Hash password
   */
  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      logger.error('Password hashing failed:', error);
      throw new Error('Password hashing failed');
    }
  }

  /**
   * Verify password
   */
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      logger.error('Password verification failed:', error);
      throw new Error('Password verification failed');
    }
  }

  /**
   * Generate secure random password
   */
  generateSecurePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  /**
   * Calculate password strength score
   */
  calculatePasswordStrength(password) {
    let score = 0;
    
    // Length
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character types
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Patterns
    if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters
    if (!/123|abc|qwe/i.test(password)) score += 1; // No common sequences
    
    if (score <= 3) return 'weak';
    if (score <= 6) return 'medium';
    return 'strong';
  }
}

/**
 * OTP Service for email verification and 2FA
 */
class OTPService {
  constructor() {
    this.otpExpiry = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10; // minutes
  }

  /**
   * Generate OTP
   */
  generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    
    return otp;
  }

  /**
   * Generate OTP with expiry
   */
  generateOTPWithExpiry(length = 6) {
    const otp = this.generateOTP(length);
    const expiresAt = new Date(Date.now() + this.otpExpiry * 60 * 1000);
    
    return {
      otp,
      expiresAt,
      hashedOTP: crypto.createHash('sha256').update(otp).digest('hex')
    };
  }

  /**
   * Verify OTP
   */
  verifyOTP(inputOTP, hashedOTP, expiresAt) {
    // Check if OTP has expired
    if (new Date() > expiresAt) {
      return { isValid: false, error: 'OTP has expired' };
    }

    // Hash input OTP and compare
    const inputHash = crypto.createHash('sha256').update(inputOTP).digest('hex');
    const isValid = inputHash === hashedOTP;

    return {
      isValid,
      error: isValid ? null : 'Invalid OTP'
    };
  }
}

/**
 * Session Service for managing user sessions
 */
class SessionService {
  constructor() {
    this.maxSessions = parseInt(process.env.MAX_SESSIONS_PER_USER) || 5;
  }

  /**
   * Generate session token
   */
  generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create session data
   */
  createSessionData(user, req) {
    return {
      userId: user._id,
      sessionToken: this.generateSessionToken(),
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true
    };
  }

  /**
   * Validate session limits
   */
  async validateSessionLimit(userId, sessions) {
    if (sessions.length >= this.maxSessions) {
      // Remove oldest session
      const oldestSession = sessions
        .filter(s => s.isActive)
        .sort((a, b) => a.lastActivity - b.lastActivity)[0];
      
      if (oldestSession) {
        oldestSession.isActive = false;
        oldestSession.endedAt = new Date();
      }
    }
  }
}

// Create service instances
const tokenService = new TokenService();
const passwordService = new PasswordService();
const otpService = new OTPService();
const sessionService = new SessionService();

export {
  TokenService,
  PasswordService,
  OTPService,
  SessionService,
  tokenService,
  passwordService,
  otpService,
  sessionService
};