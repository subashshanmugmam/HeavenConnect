import mongoose from 'mongoose';
import { config } from './environment.js';
import logger from '../utils/logger.js';

class DatabaseConnection {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // MongoDB connection options
      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        retryWrites: true,
        w: 'majority',
      };

      // Choose database URI based on environment
      const uri = config.isTest ? config.MONGODB_TEST_URI : config.MONGODB_URI;
      
      // Connect to MongoDB
      this.connection = await mongoose.connect(uri, options);
      this.isConnected = true;

      logger.info(`MongoDB connected successfully to: ${uri}`);

      // Set up connection event listeners
      this.setupEventListeners();

      // Create indexes for performance
      await this.createIndexes();

      return this.connection;
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  setupEventListeners() {
    // Connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('Mongoose connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    // Application termination events
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  async createIndexes() {
    try {
      const db = mongoose.connection.db;

      // Users collection indexes
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ 'location.coordinates': '2dsphere' });
      await db.collection('users').createIndex({ 'communities.communityId': 1 });
      await db.collection('users').createIndex({ status: 1, emailVerified: 1 });

      // Resources collection indexes
      await db.collection('resources').createIndex({ 'location.coordinates': '2dsphere' });
      await db.collection('resources').createIndex({ 
        title: 'text', 
        description: 'text', 
        tags: 'text' 
      }, {
        weights: {
          title: 10,
          description: 5,
          tags: 1
        }
      });
      await db.collection('resources').createIndex({ category: 1, status: 1 });
      await db.collection('resources').createIndex({ owner: 1, status: 1 });
      await db.collection('resources').createIndex({ averageRating: -1, totalReviews: -1 });
      await db.collection('resources').createIndex({ 'pricing.daily': 1, 'pricing.hourly': 1 });
      await db.collection('resources').createIndex({ createdAt: -1 });

      // Bookings collection indexes
      await db.collection('bookings').createIndex({ resource: 1, startDate: 1, endDate: 1 });
      await db.collection('bookings').createIndex({ renter: 1, status: 1 });
      await db.collection('bookings').createIndex({ owner: 1, status: 1 });
      await db.collection('bookings').createIndex({ startDate: 1, endDate: 1 });
      await db.collection('bookings').createIndex({ status: 1, createdAt: -1 });

      // Communities collection indexes
      await db.collection('communities').createIndex({ 'boundaries.coordinates': '2dsphere' });
      await db.collection('communities').createIndex({ name: 1 }, { unique: true });
      await db.collection('communities').createIndex({ city: 1, state: 1 });

      // Messages collection indexes
      await db.collection('messages').createIndex({ conversation: 1, createdAt: -1 });
      await db.collection('messages').createIndex({ sender: 1, createdAt: -1 });
      await db.collection('messages').createIndex({ 'content': 'text' });

      // Reviews collection indexes
      await db.collection('reviews').createIndex({ resource: 1, createdAt: -1 });
      await db.collection('reviews').createIndex({ reviewer: 1, createdAt: -1 });
      await db.collection('reviews').createIndex({ rating: -1 });

      // IoT Devices collection indexes
      await db.collection('iotdevices').createIndex({ owner: 1, isActive: 1 });
      await db.collection('iotdevices').createIndex({ deviceId: 1 }, { unique: true });
      await db.collection('iotdevices').createIndex({ 'location.coordinates': '2dsphere' });

      // Transactions collection indexes
      await db.collection('transactions').createIndex({ user: 1, createdAt: -1 });
      await db.collection('transactions').createIndex({ booking: 1 });
      await db.collection('transactions').createIndex({ status: 1, type: 1 });
      await db.collection('transactions').createIndex({ stripePaymentIntentId: 1 });

      logger.info('Database indexes created successfully');
    } catch (error) {
      logger.error('Error creating database indexes:', error);
    }
  }

  async disconnect() {
    if (this.isConnected) {
      try {
        await mongoose.connection.close();
        this.isConnected = false;
        logger.info('MongoDB connection closed');
      } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
      }
    }
  }

  getConnection() {
    return this.connection;
  }

  isConnectedToDB() {
    return this.isConnected;
  }
}

// Create singleton instance
const database = new DatabaseConnection();

export default database;