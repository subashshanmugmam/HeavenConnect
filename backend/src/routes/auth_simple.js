import express from 'express';
import authController from '../controllers/authController.js';
// import { authenticate, rateLimitSensitive, deviceFingerprint, validateSession } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Temporarily disable middleware for testing
// router.use(deviceFingerprint);

// Register validation middleware
const registerValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  body('phoneNumber').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('location.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('location.address').optional().isString().withMessage('Address must be a string'),
];

// Login validation middleware
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Simple test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes working!',
    timestamp: new Date().toISOString() 
  });
});

// Registration route
router.post('/register', registerValidation, validate, authController.register);

// Login route  
router.post('/signin', loginValidation, validate, authController.signIn);

// Basic routes without complex middleware for now
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;