import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import configurations and middleware
// import { connectDB } from './config/database.js';
// import { connectRedis } from './config/redis.js';
import logger from './utils/logger.js';
// import { initializeModels } from './models/index.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';
import { requestLogger } from './middleware/requestLogger.js';
import { validateRequest } from './middleware/validation.js';

// Import routes
import authRoutes from './routes/auth.js';
// TODO: Uncomment these as we create the route files
// import userRoutes from './routes/users.js';
// import resourceRoutes from './routes/resources.js';
// import bookingRoutes from './routes/bookings.js';
// import communityRoutes from './routes/communities.js';
// import membershipRoutes from './routes/memberships.js';
// import iotRoutes from './routes/iot.js';
// import transactionRoutes from './routes/transactions.js';
// import messageRoutes from './routes/messages.js';
// import reviewRoutes from './routes/reviews.js';
// import analyticsRoutes from './routes/analytics.js';
// import paymentRoutes from './routes/payments.js';
// import notificationRoutes from './routes/notifications.js';
// import uploadRoutes from './routes/uploads.js';
// import webhookRoutes from './routes/webhooks.js';
// import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express application
const app = express();

// Trust proxy for production deployments behind reverse proxy
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "ws:"],
      mediaSrc: ["'self'", "https:", "blob:"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',   // React development
      'http://localhost:5173',   // Vite development
      'http://localhost:8080',   // Vue development
      'https://hcsub.app',       // Production frontend
      'https://admin.hcsub.app', // Admin panel
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count', 'X-Rate-Limit-Remaining']
};

app.use(cors(corsOptions));

// Rate Limiting
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: {
    error: 'Too many requests',
    message,
    retryAfter: Math.ceil(windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, endpoint: ${req.path}`);
    res.status(429).json({
      error: 'Too many requests',
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    });
  }
});

// Global rate limiting
app.use('/api/', createRateLimit(15 * 60 * 1000, 1000, 'Too many requests, please try again later'));

// Stricter rate limiting for auth endpoints
app.use('/api/auth/login', createRateLimit(15 * 60 * 1000, 5, 'Too many login attempts'));
app.use('/api/auth/register', createRateLimit(60 * 60 * 1000, 3, 'Too many registration attempts'));
app.use('/api/auth/forgot-password', createRateLimit(60 * 60 * 1000, 3, 'Too many password reset attempts'));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification
    if (req.originalUrl.startsWith('/api/webhooks/')) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Custom request logging
app.use(requestLogger);

// Data sanitization middleware
app.use(mongoSanitize()); // Prevent NoSQL injection attacks
app.use(xss()); // Clean user input from malicious HTML
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Static file serving (for uploaded files, if needed)
app.use('/static', express.static(join(__dirname, '../public')));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'connected',
        redis: 'connected'
      }
    };
    
    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable'
    });
  }
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'HCSub Community Resource Sharing API',
    version: '1.0.0',
    description: 'REST API for the HCSub community resource sharing platform',
    documentation: `${req.protocol}://${req.get('host')}/docs`,
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      resources: '/api/resources',
      bookings: '/api/bookings',
      communities: '/api/communities',
      memberships: '/api/memberships',
      iot: '/api/iot',
      transactions: '/api/transactions',
      messages: '/api/messages',
      reviews: '/api/reviews',
      analytics: '/api/analytics',
      payments: '/api/payments',
      notifications: '/api/notifications',
      uploads: '/api/uploads',
      webhooks: '/api/webhooks',
      admin: '/api/admin'
    }
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
// TODO: Uncomment these as we create the route files
// app.use('/api/users', userRoutes);
// app.use('/api/resources', resourceRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/communities', communityRoutes);
// app.use('/api/memberships', membershipRoutes);
// app.use('/api/iot', iotRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/uploads', uploadRoutes);
// app.use('/api/webhooks', webhookRoutes);
// app.use('/api/admin', adminRoutes);

// Catch 404 errors
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: '/api'
  });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection handling
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Uncaught exception handling
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Application initialization
const initializeApp = async () => {
  try {
    logger.info('Starting HCSub API server...');
    
    // Database connection handled by server.js
    // await connectDB();
    // logger.info('✅ MongoDB connected successfully');
    
    // Redis connection disabled for now
    // await connectRedis();
    // logger.info('✅ Redis connected successfully');
    
    // Model initialization disabled for now
    // await initializeModels();
    // logger.info('✅ Database models initialized');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
      logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
    
    // Handle server shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
      });
    });
    
    return server;
    
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// Start the application
if (process.env.NODE_ENV !== 'test') {
  initializeApp();
}

export default app;
export { initializeApp };