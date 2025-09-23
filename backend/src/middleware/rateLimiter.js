import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import logger from '../utils/logger.js';

// Redis client for rate limiting
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  logger.error('Redis rate limiter error:', err);
});

// Connect to Redis
redisClient.connect().catch(console.error);

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: 900
    });
  }
});

/**
 * Authentication rate limiter
 * 5 attempts per 15 minutes for login/register
 */
export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 900
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}, Endpoint: ${req.path}`);
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: 900
    });
  }
});

/**
 * Password reset rate limiter
 * 3 attempts per hour
 */
export const passwordResetLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per hour
  message: {
    error: 'Too many password reset attempts, please try again later.',
    retryAfter: 3600
  },
  handler: (req, res) => {
    logger.warn(`Password reset rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many password reset attempts, please try again later.',
      retryAfter: 3600
    });
  }
});

/**
 * File upload rate limiter
 * 20 uploads per hour
 */
export const uploadLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 uploads per hour
  message: {
    error: 'Too many file uploads, please try again later.',
    retryAfter: 3600
  },
  handler: (req, res) => {
    logger.warn(`Upload rate limit exceeded for IP: ${req.ip}, User: ${req.user?.id}`);
    res.status(429).json({
      success: false,
      error: 'Too many file uploads, please try again later.',
      retryAfter: 3600
    });
  }
});

/**
 * Message sending rate limiter
 * 100 messages per hour for authenticated users
 */
export const messageLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each user to 100 messages per hour
  keyGenerator: (req) => {
    return req.user?.id || req.ip; // Use user ID if authenticated, otherwise IP
  },
  message: {
    error: 'Too many messages sent, please try again later.',
    retryAfter: 3600
  },
  handler: (req, res) => {
    logger.warn(`Message rate limit exceeded for User: ${req.user?.id || 'Anonymous'}, IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many messages sent, please try again later.',
      retryAfter: 3600
    });
  }
});

/**
 * Search rate limiter
 * 100 searches per hour
 */
export const searchLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 searches per hour
  message: {
    error: 'Too many search requests, please try again later.',
    retryAfter: 3600
  },
  handler: (req, res) => {
    logger.warn(`Search rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many search requests, please try again later.',
      retryAfter: 3600
    });
  }
});

/**
 * API key rate limiter (higher limits for API keys)
 * 1000 requests per hour
 */
export const apiKeyLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // limit each API key to 1000 requests per hour
  keyGenerator: (req) => {
    return req.apiKey?.id || req.ip; // Use API key ID if present, otherwise IP
  },
  message: {
    error: 'API rate limit exceeded, please try again later.',
    retryAfter: 3600
  },
  handler: (req, res) => {
    logger.warn(`API key rate limit exceeded for Key: ${req.apiKey?.name || 'Unknown'}, IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'API rate limit exceeded, please try again later.',
      retryAfter: 3600
    });
  }
});

/**
 * Webhook rate limiter
 * 1000 webhooks per hour
 */
export const webhookLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // limit each source to 1000 webhooks per hour
  keyGenerator: (req) => {
    return req.headers['x-webhook-source'] || req.ip; // Use webhook source or IP
  },
  message: {
    error: 'Webhook rate limit exceeded.',
    retryAfter: 3600
  },
  handler: (req, res) => {
    logger.warn(`Webhook rate limit exceeded for Source: ${req.headers['x-webhook-source'] || 'Unknown'}, IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Webhook rate limit exceeded.',
      retryAfter: 3600
    });
  }
});

/**
 * Create custom rate limiter
 */
export const createCustomLimiter = (options = {}) => {
  const defaultOptions = {
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: options.message || 'Rate limit exceeded, please try again later.',
        retryAfter: Math.ceil(options.windowMs / 1000) || 900
      });
    }
  };

  return rateLimit({ ...defaultOptions, ...options });
};

/**
 * Dynamic rate limiter based on user tier
 */
export const dynamicLimiter = (req, res, next) => {
  let max = 100; // default for free users
  let windowMs = 15 * 60 * 1000; // 15 minutes

  // Adjust limits based on user tier
  if (req.user?.subscription?.tier === 'premium') {
    max = 500;
  } else if (req.user?.subscription?.tier === 'enterprise') {
    max = 2000;
  } else if (req.apiKey) {
    max = 1000; // API key users get higher limits
  }

  const limiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs,
    max,
    keyGenerator: (req) => {
      return req.user?.id || req.apiKey?.id || req.ip;
    },
    message: {
      error: 'Rate limit exceeded based on your subscription tier.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    handler: (req, res) => {
      logger.warn(`Dynamic rate limit exceeded for User: ${req.user?.id || 'Anonymous'}, Tier: ${req.user?.subscription?.tier || 'free'}, IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded based on your subscription tier.',
        retryAfter: Math.ceil(windowMs / 1000),
        tier: req.user?.subscription?.tier || 'free',
        upgradeUrl: '/subscription/upgrade'
      });
    }
  });

  limiter(req, res, next);
};

export default {
  general: generalLimiter,
  auth: authLimiter,
  passwordReset: passwordResetLimiter,
  upload: uploadLimiter,
  message: messageLimiter,
  search: searchLimiter,
  apiKey: apiKeyLimiter,
  webhook: webhookLimiter,
  createCustom: createCustomLimiter,
  dynamic: dynamicLimiter
};