import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const router = express.Router();

// Test route to confirm auth routes are working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Authentication routes are working!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/test'
    ]
  });
});

// Simple user registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, location } = req.body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: firstName, lastName, email, password'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber,
      location: location || {
        type: 'Point',
        coordinates: [0, 0],
        address: {
          street: 'Not provided',
          city: 'Not provided',
          state: 'Not provided',
          zipCode: '00000',
          country: 'US'
        }
      },
      role: 'user',
      isEmailVerified: false,
      emailVerified: false, // both fields for compatibility
      agreedToTerms: true,
      agreedToPrivacyPolicy: true,
      status: 'active' // Set status to active for testing
    });

    console.log('About to save user with password:', !!hashedPassword);
    const savedUser = await user.save();
    console.log('User saved, checking password field:', !!savedUser.password);

    // Generate JWT token (simplified)
    const token = jwt.sign(
      { 
        id: savedUser._id, 
        email: savedUser.email,
        role: savedUser.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: savedUser._id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          role: savedUser.role,
          isEmailVerified: savedUser.isEmailVerified
        },
        token
      }
    });

    logger.info(`New user registered: ${email}`);

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during registration'
    });
  }
});

// Simple user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find user (including password for verification)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: user.lastLoginAt
        },
        token
      }
    });

    logger.info(`User logged in: ${email}`);

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during login'
    });
  }
});

export default router;