import logger from '../utils/logger.js';

/**
 * Request logging middleware
 * Logs incoming requests with details
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      ip: req.ip,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  });

  next();
};

export default { requestLogger };