import { validationResult, body, param, query } from 'express-validator';
import { AppError } from './errorHandler.js';
import mongoose from 'mongoose';

/**
 * Validation result handler
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return next(new AppError('Validation failed', 400, { errors: errorMessages }));
  }
  
  next();
};

/**
 * Modern validation middleware using express-validator
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  };
};

/**
 * Custom validator for MongoDB ObjectId
 */
export const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

/**
 * Custom validator for email
 */
export const isValidEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

/**
 * Custom validator for phone number
 */
export const isValidPhone = (value) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
};

/**
 * Custom validator for password strength
 */
export const isStrongPassword = (value) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(value);
};

/**
 * User validation rules
 */
export const userValidation = {
  // Registration validation
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .custom(isStrongPassword)
      .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
    body('firstName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('phone')
      .optional()
      .custom(isValidPhone)
      .withMessage('Please provide a valid phone number'),
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid date of birth'),
    body('agreeToTerms')
      .equals('true')
      .withMessage('You must agree to the terms and conditions')
  ],

  // Login validation
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Profile update validation
  updateProfile: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('phone')
      .optional()
      .custom(isValidPhone)
      .withMessage('Please provide a valid phone number'),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio must not exceed 500 characters'),
    body('dateOfBirth')
      .optional()
      .isISO8601()
      .withMessage('Please provide a valid date of birth')
  ],

  // Password change validation
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .custom(isStrongPassword)
      .withMessage('Password must be at least 8 characters with uppercase, lowercase, number and special character'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
  ]
};

/**
 * Resource validation rules
 */
export const resourceValidation = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('category')
      .isIn(['electronics', 'furniture', 'tools', 'vehicles', 'books', 'sports', 'clothing', 'kitchen', 'garden', 'other'])
      .withMessage('Please select a valid category'),
    body('condition')
      .isIn(['new', 'excellent', 'good', 'fair', 'poor'])
      .withMessage('Please select a valid condition'),
    body('location.coordinates')
      .isArray({ min: 2, max: 2 })
      .withMessage('Location coordinates must be an array of [longitude, latitude]'),
    body('location.coordinates.*')
      .isFloat()
      .withMessage('Coordinates must be valid numbers'),
    body('pricing.daily')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Daily price must be a positive number'),
    body('pricing.deposit')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Deposit must be a positive number')
  ],

  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('category')
      .optional()
      .isIn(['electronics', 'furniture', 'tools', 'vehicles', 'books', 'sports', 'clothing', 'kitchen', 'garden', 'other'])
      .withMessage('Please select a valid category'),
    body('condition')
      .optional()
      .isIn(['new', 'excellent', 'good', 'fair', 'poor'])
      .withMessage('Please select a valid condition')
  ]
};

/**
 * Booking validation rules
 */
export const bookingValidation = {
  create: [
    body('resource')
      .custom(isValidObjectId)
      .withMessage('Please provide a valid resource ID'),
    body('startDate')
      .isISO8601()
      .withMessage('Please provide a valid start date')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('Start date must be in the future');
        }
        return true;
      }),
    body('endDate')
      .isISO8601()
      .withMessage('Please provide a valid end date')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('message')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Message must not exceed 1000 characters')
  ],

  update: [
    body('status')
      .optional()
      .isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed'])
      .withMessage('Please provide a valid status')
  ]
};

/**
 * Community validation rules
 */
export const communityValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Community name must be between 3 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters'),
    body('category')
      .isIn(['neighborhood', 'building', 'workplace', 'university', 'hobby', 'professional', 'family', 'sports', 'gaming', 'arts', 'technology', 'health', 'environment', 'charity', 'other'])
      .withMessage('Please select a valid category'),
    body('type')
      .isIn(['public', 'private', 'invite_only'])
      .withMessage('Please select a valid community type'),
    body('location.coordinates')
      .optional()
      .isArray({ min: 2, max: 2 })
      .withMessage('Location coordinates must be an array of [longitude, latitude]')
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Community name must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be between 10 and 2000 characters')
  ]
};

/**
 * Review validation rules
 */
export const reviewValidation = {
  create: [
    body('rating.overall')
      .isInt({ min: 1, max: 5 })
      .withMessage('Overall rating must be between 1 and 5'),
    body('content.comment')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Comment must be between 10 and 2000 characters'),
    body('content.title')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Title must not exceed 100 characters'),
    body('reviewType')
      .isIn(['resource', 'user_as_renter', 'user_as_owner', 'community', 'booking_experience'])
      .withMessage('Please provide a valid review type')
  ]
};

/**
 * Message validation rules
 */
export const messageValidation = {
  create: [
    body('content.text')
      .trim()
      .isLength({ min: 1, max: 4000 })
      .withMessage('Message must be between 1 and 4000 characters'),
    body('recipients')
      .isArray({ min: 1 })
      .withMessage('At least one recipient is required'),
    body('recipients.*.user')
      .custom(isValidObjectId)
      .withMessage('Please provide valid recipient user IDs'),
    body('type')
      .optional()
      .isIn(['text', 'image', 'file', 'location', 'system', 'booking_update', 'payment_update', 'resource_inquiry'])
      .withMessage('Please provide a valid message type')
  ]
};

/**
 * Common parameter validation
 */
export const paramValidation = {
  id: param('id').custom(isValidObjectId).withMessage('Please provide a valid ID'),
  userId: param('userId').custom(isValidObjectId).withMessage('Please provide a valid user ID'),
  resourceId: param('resourceId').custom(isValidObjectId).withMessage('Please provide a valid resource ID'),
  bookingId: param('bookingId').custom(isValidObjectId).withMessage('Please provide a valid booking ID'),
  communityId: param('communityId').custom(isValidObjectId).withMessage('Please provide a valid community ID'),
  messageId: param('messageId').custom(isValidObjectId).withMessage('Please provide a valid message ID'),
  reviewId: param('reviewId').custom(isValidObjectId).withMessage('Please provide a valid review ID')
};

/**
 * Common query validation
 */
export const queryValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],

  location: [
    query('lat')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    query('lng')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),
    query('radius')
      .optional()
      .isInt({ min: 1, max: 50000 })
      .withMessage('Radius must be between 1 and 50000 meters')
  ],

  dateRange: [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO date')
  ]
};

/**
 * File upload validation
 */
export const fileValidation = {
  image: [
    body('type')
      .optional()
      .isIn(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
      .withMessage('Only JPEG, PNG, GIF, and WebP images are allowed'),
    body('size')
      .optional()
      .isInt({ max: 10 * 1024 * 1024 }) // 10MB
      .withMessage('Image size must not exceed 10MB')
  ],

  document: [
    body('type')
      .optional()
      .isIn(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
      .withMessage('Only PDF and Word documents are allowed'),
    body('size')
      .optional()
      .isInt({ max: 25 * 1024 * 1024 }) // 25MB
      .withMessage('Document size must not exceed 25MB')
  ]
};