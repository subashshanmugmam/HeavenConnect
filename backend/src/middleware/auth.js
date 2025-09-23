import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { AppError, asyncHandler } from './errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Get token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return next(new AppError('Access denied. No token provided.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    // Check if user is active
    if (user.status !== 'active') {
      return next(new AppError('Account is not active', 401));
    }

    // Check if user changed password after token was issued
    if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
      return next(new AppError('Password was changed. Please log in again.', 401));
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return next(new AppError('Invalid token', 401));
  }
});

/**
 * Optional authentication - verifies token if present
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.status === 'active') {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
      logger.debug('Optional auth failed:', error.message);
    }
  }

  next();
});

/**
 * Authorization middleware - checks user roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Access denied. Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied. Insufficient permissions.', 403));
    }

    next();
  };
};

/**
 * Resource ownership middleware - checks if user owns the resource
 */
export const checkOwnership = (resourceModel, resourceIdParam = 'id') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const resourceId = req.params[resourceIdParam];
    const Model = resourceModel;
    
    const resource = await Model.findById(resourceId);
    
    if (!resource) {
      return next(new AppError('Resource not found', 404));
    }

    // Check if user is the owner or admin
    if (resource.owner?.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'super_admin') {
      return next(new AppError('Access denied. You can only access your own resources.', 403));
    }

    req.resource = resource;
    next();
  });
};

/**
 * Community membership middleware - checks if user is member of community
 */
export const checkCommunityMembership = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  const { communityId } = req.params;
  const { Membership } = await import('../models/index.js');
  
  const membership = await Membership.findOne({
    community: communityId,
    user: req.user._id,
    status: 'active'
  });

  if (!membership && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(new AppError('Access denied. Community membership required.', 403));
  }

  req.membership = membership;
  next();
});

/**
 * Community admin middleware - checks if user is admin of community
 */
export const checkCommunityAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  const { communityId } = req.params;
  const { Community } = await import('../models/index.js');
  
  const community = await Community.findById(communityId);
  
  if (!community) {
    return next(new AppError('Community not found', 404));
  }

  const permissions = community.getUserPermissions(req.user._id);
  
  if (!permissions.isAdmin && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(new AppError('Access denied. Community admin privileges required.', 403));
  }

  req.community = community;
  req.permissions = permissions;
  next();
});

/**
 * Rate limiting by user ID
 */
export const userRateLimit = (windowMs, maxRequests) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    if (requests.has(userId)) {
      const userRequests = requests.get(userId).filter(time => time > windowStart);
      requests.set(userId, userRequests);
    } else {
      requests.set(userId, []);
    }

    const userRequests = requests.get(userId);

    if (userRequests.length >= maxRequests) {
      return next(new AppError('Rate limit exceeded', 429));
    }

    userRequests.push(now);
    next();
  };
};

/**
 * API key authentication middleware
 */
export const authenticateApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(new AppError('API key required', 401));
  }

  // Validate API key (this would check against a database of valid API keys)
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return next(new AppError('Invalid API key', 401));
  }

  // Set a system user for API requests
  req.apiUser = {
    _id: 'system',
    role: 'system',
    isApiUser: true
  };

  next();
});

/**
 * Webhook signature verification middleware
 */
export const verifyWebhookSignature = (secret) => {
  return (req, res, next) => {
    const signature = req.headers['x-signature'] || req.headers['stripe-signature'];
    
    if (!signature) {
      return next(new AppError('Webhook signature missing', 400));
    }

    // Verify signature (implementation depends on the webhook provider)
    // This is a basic example - real implementation would verify against the raw body
    try {
      // Webhook verification logic here
      next();
    } catch (error) {
      return next(new AppError('Invalid webhook signature', 400));
    }
  };
};

/**
 * Require email verification middleware
 */
export const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!req.user.isEmailVerified) {
    return next(new AppError('Email verification required', 403));
  }

  next();
};

/**
 * Require phone verification middleware
 */
export const requirePhoneVerification = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!req.user.isPhoneVerified) {
    return next(new AppError('Phone verification required', 403));
  }

  next();
};

/**
 * Check user status middleware
 */
export const checkUserStatus = (allowedStatuses = ['active']) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedStatuses.includes(req.user.status)) {
      return next(new AppError('Account access restricted', 403));
    }

    next();
  };
};