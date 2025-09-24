import express from 'express';
import authController from '../controllers/authController.js';
import { authenticate, rateLimitSensitive, deviceFingerprint, validateSession } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Apply device fingerprinting to all auth routes
router.use(deviceFingerprint);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', [
  validate([
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name is required and must be less than 50 characters'),
    body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name is required and must be less than 50 characters'),
    body('phoneNumber')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('birthDate')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid birth date'),
    body('agreedToTerms')
      .isBoolean()
      .equals('true')
      .withMessage('You must agree to the terms and conditions'),
    body('agreedToPrivacyPolicy')
      .isBoolean()
      .equals('true')
      .withMessage('You must agree to the privacy policy')
  ]),
  rateLimitSensitive(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
], authController.register);

/**
 * @route   POST /api/auth/signin
 * @desc    Sign in user
 * @access  Public
 */
router.post('/signin', [
  validate([
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    body('rememberMe')
      .optional()
      .isBoolean()
      .withMessage('Remember me must be a boolean')
  ]),
  rateLimitSensitive(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
], authController.signIn);

/**
 * @route   POST /api/auth/verify-2fa
 * @desc    Verify two-factor authentication
 * @access  Public
 */
router.post('/verify-2fa', [
  validate([
    body('tempToken')
      .notEmpty()
      .withMessage('Temporary token is required'),
    body('code')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('Please provide a valid 6-digit code'),
    body('rememberMe')
      .optional()
      .isBoolean()
      .withMessage('Remember me must be a boolean')
  ]),
  rateLimitSensitive(3, 10 * 60 * 1000) // 3 attempts per 10 minutes
], authController.verifyTwoFactor);

/**
 * @route   POST /api/auth/send-email-verification
 * @desc    Send email verification
 * @access  Private
 */
router.post('/send-email-verification', [
  authenticate,
  rateLimitSensitive(3, 60 * 60 * 1000) // 3 attempts per hour
], authController.sendEmailVerification);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email', [
  validate([
    body('token')
      .notEmpty()
      .withMessage('Verification token is required')
  ])
], authController.verifyEmail);

/**
 * @route   POST /api/auth/send-password-reset
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/send-password-reset', [
  validate([
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email')
  ]),
  rateLimitSensitive(3, 60 * 60 * 1000) // 3 attempts per hour
], authController.sendPasswordReset);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', [
  validate([
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  ]),
  rateLimitSensitive(3, 60 * 60 * 1000) // 3 attempts per hour
], authController.resetPassword);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post('/change-password', [
  authenticate,
  validate([
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  ]),
  rateLimitSensitive(3, 60 * 60 * 1000) // 3 attempts per hour
], authController.changePassword);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', [
  validate([
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required')
  ])
], authController.refreshToken);

/**
 * @route   POST /api/auth/signout
 * @desc    Sign out user
 * @access  Private
 */
router.post('/signout', [
  authenticate,
  validateSession
], authController.signOut);

/**
 * @route   POST /api/auth/signout-all
 * @desc    Sign out user from all devices
 * @access  Private
 */
router.post('/signout-all', [
  authenticate,
  rateLimitSensitive(3, 60 * 60 * 1000) // 3 attempts per hour
], authController.signOutAll);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', [
  authenticate,
  validateSession
], authController.getProfile);

/**
 * @route   POST /api/auth/enable-2fa
 * @desc    Enable two-factor authentication
 * @access  Private
 */
router.post('/enable-2fa', [
  authenticate,
  validateSession,
  rateLimitSensitive(3, 60 * 60 * 1000) // 3 attempts per hour
], authController.enableTwoFactor);

/**
 * @route   POST /api/auth/disable-2fa
 * @desc    Disable two-factor authentication
 * @access  Private
 */
router.post('/disable-2fa', [
  authenticate,
  validateSession,
  validate([
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]),
  rateLimitSensitive(3, 60 * 60 * 1000) // 3 attempts per hour
], authController.disableTwoFactor);

/**
 * @route   GET /api/auth/sessions
 * @desc    Get active sessions
 * @access  Private
 */
router.get('/sessions', [
  authenticate,
  validateSession
], authController.getSessions);

/**
 * @route   DELETE /api/auth/sessions/:sessionId
 * @desc    Revoke a session
 * @access  Private
 */
router.delete('/sessions/:sessionId', [
  authenticate,
  validateSession,
  validate([
    param('sessionId')
      .notEmpty()
      .withMessage('Session ID is required')
  ])
], authController.revokeSession);

export default router;