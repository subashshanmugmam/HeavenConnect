// Database Models Index
// Centralized export for all database models

import User from './User.js';
import Resource from './Resource.js';
import Booking from './Booking.js';
import Community from './Community.js';
import Membership from './Membership.js';
import IoTDevice from './IoTDevice.js';
import Transaction from './Transaction.js';
import Message from './Message.js';
import Review from './Review.js';
import Analytics from './Analytics.js';

// Export all models
export {
  User,
  Resource,
  Booking,
  Community,
  Membership,
  IoTDevice,
  Transaction,
  Message,
  Review,
  Analytics
};

// Default export as object for easy importing
export default {
  User,
  Resource,
  Booking,
  Community,
  Membership,
  IoTDevice,
  Transaction,
  Message,
  Review,
  Analytics
};

// Model registry for dynamic access
export const modelRegistry = {
  User,
  Resource,
  Booking,
  Community,
  Membership,
  IoTDevice,
  Transaction,
  Message,
  Review,
  Analytics
};

// Helper function to get model by name
export const getModel = (modelName) => {
  return modelRegistry[modelName];
};

// Model validation schemas (for API validation)
export const modelSchemas = {
  User: {
    required: ['email', 'firstName', 'lastName'],
    unique: ['email', 'phone'],
    indexes: ['email', 'phone', 'location.coordinates']
  },
  Resource: {
    required: ['title', 'description', 'category', 'owner', 'location.coordinates', 'condition'],
    indexes: ['owner', 'category', 'location.coordinates', 'status']
  },
  Booking: {
    required: ['renter', 'owner', 'resource', 'startDate', 'endDate', 'pricing.totalAmount'],
    indexes: ['renter', 'owner', 'resource', 'status', 'startDate']
  },
  Community: {
    required: ['name', 'slug', 'description', 'creator', 'category'],
    unique: ['name', 'slug'],
    indexes: ['creator', 'category', 'location.coordinates']
  },
  Membership: {
    required: ['community', 'user'],
    unique: [['community', 'user']],
    indexes: ['community', 'user', 'status']
  },
  IoTDevice: {
    required: ['deviceId', 'name', 'type', 'owner'],
    unique: ['deviceId', 'serialNumber'],
    indexes: ['owner', 'type', 'status', 'location.current.coordinates']
  },
  Transaction: {
    required: ['type', 'category', 'payer', 'amount.gross', 'currency', 'description'],
    unique: ['transactionId'],
    indexes: ['payer', 'payee', 'booking', 'status']
  },
  Message: {
    required: ['sender', 'threadId', 'conversationType'],
    indexes: ['sender', 'threadId', 'conversationType', 'recipients.user']
  },
  Review: {
    required: ['reviewType', 'reviewer', 'reviewee', 'rating.overall', 'content.comment'],
    indexes: ['reviewer', 'reviewee', 'revieweeModel', 'booking']
  },
  Analytics: {
    required: ['eventType', 'category'],
    indexes: ['eventType', 'category', 'timestamp.occurred', 'context.userId']
  }
};

// Model relationships mapping
export const modelRelationships = {
  User: {
    hasMany: ['Resource', 'Booking', 'Community', 'Membership', 'IoTDevice', 'Transaction', 'Message', 'Review', 'Analytics'],
    references: ['communities', 'resources', 'bookings', 'devices']
  },
  Resource: {
    belongsTo: ['User'],
    hasMany: ['Booking', 'Review', 'Analytics'],
    references: ['owner']
  },
  Booking: {
    belongsTo: ['User', 'Resource'],
    hasMany: ['Transaction', 'Message', 'Review', 'Analytics'],
    references: ['renter', 'owner', 'resource']
  },
  Community: {
    belongsTo: ['User'],
    hasMany: ['Membership', 'Message', 'Review', 'Analytics'],
    references: ['creator', 'admins', 'moderators']
  },
  Membership: {
    belongsTo: ['User', 'Community'],
    hasMany: ['Analytics'],
    references: ['user', 'community']
  },
  IoTDevice: {
    belongsTo: ['User', 'Resource', 'Community'],
    hasMany: ['Analytics'],
    references: ['owner', 'resource', 'community']
  },
  Transaction: {
    belongsTo: ['User', 'Booking', 'Resource', 'Community'],
    hasMany: ['Analytics'],
    references: ['payer', 'payee', 'booking', 'resource']
  },
  Message: {
    belongsTo: ['User', 'Booking', 'Resource', 'Community', 'Transaction'],
    hasMany: ['Analytics'],
    references: ['sender', 'recipients', 'relatedEntities']
  },
  Review: {
    belongsTo: ['User', 'Resource', 'Community', 'Booking'],
    hasMany: ['Analytics'],
    references: ['reviewer', 'reviewee', 'booking']
  },
  Analytics: {
    belongsTo: ['User', 'Resource', 'Booking', 'Community', 'Transaction', 'Message', 'IoTDevice'],
    references: ['entities', 'context.userId']
  }
};

// Model statistics for monitoring
export const getModelStats = async () => {
  const stats = {};
  
  for (const [modelName, Model] of Object.entries(modelRegistry)) {
    try {
      const count = await Model.countDocuments();
      const recent = await Model.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      
      stats[modelName] = {
        total: count,
        recentlyCreated: recent,
        lastUpdated: new Date()
      };
    } catch (error) {
      stats[modelName] = {
        error: error.message,
        lastUpdated: new Date()
      };
    }
  }
  
  return stats;
};

// Database health check
export const checkDatabaseHealth = async () => {
  const health = {
    status: 'healthy',
    models: {},
    timestamp: new Date()
  };
  
  for (const [modelName, Model] of Object.entries(modelRegistry)) {
    try {
      // Simple query to check if model is accessible
      await Model.findOne().limit(1);
      health.models[modelName] = { status: 'healthy' };
    } catch (error) {
      health.models[modelName] = { 
        status: 'error', 
        error: error.message 
      };
      health.status = 'degraded';
    }
  }
  
  return health;
};

// Model initialization function
export const initializeModels = async () => {
  console.log('Initializing database models...');
  
  const initResults = {};
  
  for (const [modelName, Model] of Object.entries(modelRegistry)) {
    try {
      // Ensure indexes are created
      await Model.createIndexes();
      initResults[modelName] = { status: 'initialized' };
      console.log(`✅ ${modelName} model initialized`);
    } catch (error) {
      initResults[modelName] = { 
        status: 'error', 
        error: error.message 
      };
      console.error(`❌ Failed to initialize ${modelName}: ${error.message}`);
    }
  }
  
  console.log('Model initialization complete');
  return initResults;
};