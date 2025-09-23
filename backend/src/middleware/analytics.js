import logger from '../utils/logger.js';
import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Booking from '../models/Booking.js';
import Community from '../models/Community.js';
import Membership from '../models/Membership.js';
import Message from '../models/Message.js';
import Review from '../models/Review.js';
import Transaction from '../models/Transaction.js';
import IoTDevice from '../models/IoTDevice.js';
import Analytics from '../models/Analytics.js';

/**
 * Log user activity for analytics
 */
export const logActivity = (activityType, details = {}) => {
  return async (req, res, next) => {
    try {
      // Continue with the request first
      next();

      // Log activity asynchronously
      setTimeout(async () => {
        try {
          const activityData = {
            userId: req.user?.id || null,
            sessionId: req.sessionID || req.headers['x-session-id'],
            activityType,
            details: {
              ...details,
              endpoint: req.path,
              method: req.method,
              userAgent: req.get('User-Agent'),
              ip: req.ip,
              timestamp: new Date()
            },
            metadata: {
              requestId: req.id,
              responseTime: res.responseTime,
              statusCode: res.statusCode
            }
          };

          await Analytics.create(activityData);
        } catch (error) {
          logger.error('Failed to log activity:', error);
        }
      }, 0);

    } catch (error) {
      logger.error('Activity logging middleware error:', error);
      next();
    }
  };
};

/**
 * Track user engagement metrics
 */
export const trackEngagement = async (req, res, next) => {
  if (!req.user) return next();

  try {
    // Update user's last activity
    await User.findByIdAndUpdate(req.user.id, {
      lastActive: new Date(),
      $inc: { 'stats.totalSessions': 1 }
    });

    // Track page views for specific resources
    if (req.method === 'GET' && req.params.resourceId) {
      await Resource.findByIdAndUpdate(req.params.resourceId, {
        $inc: { 'stats.views': 1 }
      });
    }

    // Track community engagement
    if (req.method === 'GET' && req.params.communityId) {
      await Community.findByIdAndUpdate(req.params.communityId, {
        $inc: { 'stats.views': 1 }
      });
    }

    next();
  } catch (error) {
    logger.error('Engagement tracking error:', error);
    next();
  }
};

/**
 * Performance monitoring middleware
 */
export const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const responseTime = Date.now() - startTime;
    res.responseTime = responseTime;

    // Log slow requests (>2 seconds)
    if (responseTime > 2000) {
      logger.warn(`Slow request detected: ${req.method} ${req.path} took ${responseTime}ms`, {
        userId: req.user?.id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    // Set response time header
    res.set('X-Response-Time', `${responseTime}ms`);

    // Log performance metrics asynchronously
    setTimeout(async () => {
      try {
        await Analytics.create({
          eventType: 'performance',
          userId: req.user?.id,
          details: {
            endpoint: req.path,
            method: req.method,
            responseTime,
            statusCode: res.statusCode,
            contentLength: res.get('Content-Length') || 0
          },
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Failed to log performance metrics:', error);
      }
    }, 0);

    originalEnd.apply(this, args);
  };

  next();
};

/**
 * Error tracking middleware
 */
export const trackError = (error, req, res, next) => {
  // Log error asynchronously
  setTimeout(async () => {
    try {
      await Analytics.create({
        eventType: 'error',
        userId: req.user?.id || null,
        details: {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
            statusCode: error.statusCode || 500
          },
          request: {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body,
            params: req.params,
            query: req.query
          },
          context: {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date()
          }
        },
        timestamp: new Date()
      });
    } catch (analyticsError) {
      logger.error('Failed to track error in analytics:', analyticsError);
    }
  }, 0);

  next(error);
};

/**
 * Business metrics tracking
 */
export const trackBusinessMetrics = {
  // Track user registration
  userRegistration: logActivity('user_registration', { type: 'conversion' }),

  // Track resource creation
  resourceCreation: logActivity('resource_creation', { type: 'content' }),

  // Track booking creation
  bookingCreation: logActivity('booking_creation', { type: 'transaction' }),

  // Track community joining
  communityJoin: logActivity('community_join', { type: 'engagement' }),

  // Track message sending
  messageSent: logActivity('message_sent', { type: 'communication' }),

  // Track payment completion
  paymentCompleted: logActivity('payment_completed', { type: 'revenue' }),

  // Track search queries
  search: logActivity('search', { type: 'discovery' }),

  // Track feature usage
  featureUsage: (feature) => logActivity('feature_usage', { feature, type: 'engagement' })
};

/**
 * A/B testing middleware
 */
export const abTesting = (testName, variants) => {
  return (req, res, next) => {
    if (!req.user) return next();

    try {
      // Determine variant based on user ID hash
      const userHash = parseInt(req.user.id.slice(-4), 16);
      const variantIndex = userHash % variants.length;
      const variant = variants[variantIndex];

      // Store variant in request for use in handlers
      req.abTest = {
        testName,
        variant,
        variantIndex
      };

      // Track A/B test participation
      setTimeout(async () => {
        try {
          await Analytics.create({
            eventType: 'ab_test_participation',
            userId: req.user.id,
            details: {
              testName,
              variant,
              variantIndex,
              endpoint: req.path
            },
            timestamp: new Date()
          });
        } catch (error) {
          logger.error('Failed to track A/B test participation:', error);
        }
      }, 0);

      next();
    } catch (error) {
      logger.error('A/B testing middleware error:', error);
      next();
    }
  };
};

/**
 * Conversion tracking
 */
export const trackConversion = (conversionType, value = null) => {
  return async (req, res, next) => {
    try {
      next();

      // Track conversion asynchronously
      setTimeout(async () => {
        try {
          const conversionData = {
            eventType: 'conversion',
            userId: req.user?.id,
            details: {
              conversionType,
              value,
              endpoint: req.path,
              timestamp: new Date()
            }
          };

          await Analytics.create(conversionData);

          // Update user conversion stats
          if (req.user) {
            await User.findByIdAndUpdate(req.user.id, {
              $inc: { [`stats.conversions.${conversionType}`]: 1 }
            });
          }
        } catch (error) {
          logger.error('Failed to track conversion:', error);
        }
      }, 0);

    } catch (error) {
      logger.error('Conversion tracking error:', error);
      next();
    }
  };
};

/**
 * Funnel tracking
 */
export const trackFunnelStep = (funnelName, step) => {
  return logActivity('funnel_step', { funnelName, step, type: 'funnel' });
};

/**
 * Session tracking
 */
export const trackSession = (req, res, next) => {
  if (!req.user) return next();

  try {
    // Create or update session
    const sessionId = req.sessionID || req.headers['x-session-id'];
    
    if (sessionId) {
      setTimeout(async () => {
        try {
          await Analytics.findOneAndUpdate(
            {
              eventType: 'session',
              sessionId,
              userId: req.user.id
            },
            {
              $set: {
                lastActivity: new Date(),
                details: {
                  userAgent: req.get('User-Agent'),
                  ip: req.ip
                }
              },
              $inc: { 'details.pageViews': 1 }
            },
            {
              upsert: true,
              new: true
            }
          );
        } catch (error) {
          logger.error('Failed to track session:', error);
        }
      }, 0);
    }

    next();
  } catch (error) {
    logger.error('Session tracking error:', error);
    next();
  }
};

/**
 * Real-time analytics for dashboard
 */
export const realtimeAnalytics = (req, res, next) => {
  // Store original res.end
  const originalEnd = res.end;

  res.end = function(...args) {
    // Emit real-time analytics event
    if (req.app.get('io')) {
      req.app.get('io').emit('analytics:realtime', {
        timestamp: new Date(),
        endpoint: req.path,
        method: req.method,
        statusCode: res.statusCode,
        userId: req.user?.id,
        responseTime: res.responseTime
      });
    }

    originalEnd.apply(this, args);
  };

  next();
};

export default {
  logActivity,
  trackEngagement,
  performanceMonitor,
  trackError,
  trackBusinessMetrics,
  abTesting,
  trackConversion,
  trackFunnelStep,
  trackSession,
  realtimeAnalytics
};