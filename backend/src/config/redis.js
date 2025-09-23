import Redis from 'ioredis';
import { config } from './environment.js';
import logger from '../utils/logger.js';

class RedisConnection {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Redis connection options
      const options = {
        host: config.REDIS_URL.includes('://') 
          ? new URL(config.REDIS_URL).hostname 
          : config.REDIS_URL.split(':')[0],
        port: config.REDIS_URL.includes('://') 
          ? new URL(config.REDIS_URL).port || 6379
          : parseInt(config.REDIS_URL.split(':')[1]) || 6379,
        password: config.REDIS_PASSWORD || undefined,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        family: 4,
        keyPrefix: 'community-resource:',
        db: config.isTest ? 1 : 0, // Use different database for testing
      };

      this.client = new Redis(options);

      // Set up event listeners
      this.setupEventListeners();

      // Connect to Redis
      await this.client.connect();
      this.isConnected = true;

      logger.info('Redis connected successfully');
      return this.client;
    } catch (error) {
      logger.error('Redis connection error:', error);
      // Don't exit process for Redis connection failure in development
      if (config.isProduction) {
        process.exit(1);
      }
    }
  }

  setupEventListeners() {
    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
    });

    this.client.on('error', (error) => {
      logger.error('Redis client error:', error);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      logger.warn('Redis client connection closed');
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });

    // Application termination events
    process.on('SIGINT', async () => {
      await this.disconnect();
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
    });
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      try {
        await this.client.quit();
        this.isConnected = false;
        logger.info('Redis connection closed');
      } catch (error) {
        logger.error('Error closing Redis connection:', error);
      }
    }
  }

  getClient() {
    return this.client;
  }

  isConnectedToRedis() {
    return this.isConnected;
  }

  // Cache helper methods
  async set(key, value, ttl = 3600) {
    if (!this.isConnected) return false;
    try {
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error('Redis SET error:', error);
      return false;
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      logger.error('Redis GET error:', error);
      return null;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      return false;
    }
  }

  async expire(key, seconds) {
    if (!this.isConnected) return false;
    try {
      await this.client.expire(key, seconds);
      return true;
    } catch (error) {
      logger.error('Redis EXPIRE error:', error);
      return false;
    }
  }

  async flushPattern(pattern) {
    if (!this.isConnected) return false;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error('Redis FLUSH PATTERN error:', error);
      return false;
    }
  }

  // Session management
  async setSession(userId, sessionData, ttl = 86400) {
    return await this.set(`session:${userId}`, sessionData, ttl);
  }

  async getSession(userId) {
    return await this.get(`session:${userId}`);
  }

  async deleteSession(userId) {
    return await this.del(`session:${userId}`);
  }

  // Cache invalidation helpers
  async invalidateUserCache(userId) {
    return await this.flushPattern(`user:${userId}:*`);
  }

  async invalidateResourceCache(resourceId) {
    await this.del(`resource:${resourceId}`);
    await this.flushPattern('search:*');
  }

  async cacheSearchResults(searchKey, results, ttl = 1800) {
    return await this.set(`search:${searchKey}`, results, ttl);
  }

  async getSearchResults(searchKey) {
    return await this.get(`search:${searchKey}`);
  }
}

// Create singleton instance
const redisConnection = new RedisConnection();

export default redisConnection;