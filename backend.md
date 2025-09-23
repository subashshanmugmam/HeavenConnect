# Community Resource Sharing Platform - Node.js + MongoDB Backend Development Prompt for GitHub Copilot Pro Sonnet 4

## Project Context
Build a comprehensive **Node.js backend API with MongoDB** for an innovative community resource sharing platform that connects neighbors through AI-powered IoT integration, enabling local rental of items, space sharing, service requests, and food sharing with real-time community interaction.

## 🎯 Core Innovation Requirements
Create a **revolutionary and scalable** backend system featuring:
- **AI-powered IoT camera integration** for automatic item detection and inventory management
- **Smart home monitoring** with person detection and dynamic notifications
- **Advanced geospatial queries** using MongoDB's geospatial features
- **Real-time data streaming** with WebSocket and Server-Sent Events
- **Intelligent recommendation engine** using machine learning algorithms
- **Dynamic pricing algorithms** based on supply-demand analytics
- **Community trust scoring** with multi-factor reputation system
- **Automated conflict resolution** for booking overlaps
- **Environmental impact tracking** with carbon footprint calculations

## 📋 Technical Architecture

### Technology Stack
```javascript
// Runtime: Node.js 18+ with ES6+ modules
// Database: MongoDB 7.0+ with Mongoose ODM
// Caching: Redis 7+ for session management and real-time data
// Real-time data caching
  cacheUserSession: async (userId, sessionData, ttl = 86400) => {
    await redis.setex(`session:${userId}`, ttl, JSON.stringify(sessionData));
  },
  
  // Cache invalidation strategies
  invalidateResourceCache: async (resourceId) => {
    await redis.del(`resource:${resourceId}`);
    await redis.del(`search:*`); // Clear related search caches
  }
};
```

## 📦 Required Dependencies

```json
{
  "name": "community-resource-backend",
  "version": "1.0.0",
  "description": "Community Resource Sharing Platform Backend API",
  "main": "src/server.js",
  "type": "module",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.6.3",
    "redis": "^4.6.10",
    "ioredis": "^5.3.2",
    "socket.io": "^4.7.4",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "joi": "^17.11.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "express-mongo-sanitize": "^2.2.0",
    "xss": "^1.0.14",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "multer": "^1.4.5-lts.1",
    "multer-gridfs-storage": "^5.0.2",
    "gridfs-stream": "^1.1.1",
    "cloudinary": "^1.41.0",
    "nodemailer": "^6.9.7",
    "twilio": "^4.18.1",
    "stripe": "^14.5.0",
    "bull": "^4.12.2",
    "node-cron": "^3.0.2",
    "moment": "^2.29.4",
    "geolib": "^3.3.4",
    "@turf/turf": "^6.5.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.7.4",
    "mqtt": "^5.2.0",
    "@tensorflow/tfjs-node": "^4.13.0",
    "sharp": "^0.32.6",
    "uuid": "^9.0.1",
    "validator": "^13.11.0",
    "express-validator": "^7.0.1",
    "express-async-errors": "^3.1.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "redoc-express": "^2.1.0",
    "express-openapi-validator": "^5.1.0",
    "agenda": "^5.0.0",
    "express-slow-down": "^2.0.1",
    "express-brute": "^1.0.1",
    "express-brute-redis": "^0.0.1",
    "hpp": "^0.2.3",
    "cookie-parser": "^1.4.6",
    "express-session": "^1.17.3",
    "connect-redis": "^7.1.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-google-oauth20": "^2.0.0",
    "passport-facebook": "^3.0.0",
    "speakeasy": "^2.0.0",
    "qrcode": "^1.5.3",
    "crypto": "^1.0.1",
    "lodash": "^4.17.21",
    "elasticlunr": "^0.9.5",
    "natural": "^6.7.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "mongodb-memory-server": "^9.1.1",
    "redis-memory-server": "^0.7.0",
    "nodemon": "^3.0.1",
    "eslint": "^8.52.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.29.0",
    "prettier": "^3.0.3",
    "husky": "^8.0.3",
    "lint-staged": "^15.0.2",
    "@types/node": "^20.8.9",
    "concurrently": "^8.2.2",
    "cross-env": "^7.0.3"
  },
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "cross-env NODE_ENV=test jest",
    "test:watch": "cross-env NODE_ENV=test jest --watch",
    "test:coverage": "cross-env NODE_ENV=test jest --coverage",
    "lint": "eslint src/ --fix",
    "format": "prettier --write src/",
    "seed": "node scripts/seed.js",
    "migrate": "node scripts/migrate.js",
    "docs:generate": "node scripts/generate-docs.js",
    "docker:dev": "docker-compose up -d",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up -d",
    "backup": "node scripts/backup.js",
    "deploy": "node scripts/deploy.js"
  }
}
```

## 🔧 Database Schema Design (MongoDB with Mongoose)

### User Model with Advanced Features
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  // Basic Information
  firstName: { type: String, required: true, trim: true, maxLength: 50 },
  lastName: { type: String, required: true, trim: true, maxLength: 50 },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email']
  },
  username: { 
    type: String, 
    unique: true, 
    sparse: true, 
    trim: true,
    minLength: 3,
    maxLength: 20
  },
  phone: {
    number: { type: String, validate: [validator.isMobilePhone, 'Invalid phone number'] },
    verified: { type: Boolean, default: false },
    verificationCode: String,
    verificationExpires: Date
  },
  
  // Authentication
  password: { type: String, required: true, minLength: 8, select: false },
  refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }],
  twoFactorAuth: {
    enabled: { type: Boolean, default: false },
    secret: String,
    backupCodes: [String]
  },
  
  // Profile Information
  avatar: {
    url: String,
    publicId: String // Cloudinary public ID
  },
  bio: { type: String, maxLength: 500 },
  dateOfBirth: Date,
  
  // Location and Community
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }, // [longitude, latitude]
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'US' }
    },
    privacy: { type: String, enum: ['public', 'community', 'private'], default: 'community' }
  },
  communities: [{
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    role: { type: String, enum: ['member', 'moderator', 'admin'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false }
  }],
  
  // Trust and Reputation System
  trustScore: {
    overall: { type: Number, default: 0, min: 0, max: 100 },
    asRenter: { type: Number, default: 0, min: 0, max: 5 },
    asLender: { type: Number, default: 0, min: 0, max: 5 },
    asServiceProvider: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    badges: [{
      type: { type: String, enum: ['verified', 'trusted_neighbor', 'eco_warrior', 'helpful', 'responsive'] },
      earnedAt: { type: Date, default: Date.now },
      description: String
    }]
  },
  
  // Preferences and Settings
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'community', 'private'], default: 'community' },
      showLocation: { type: Boolean, default: true },
      showContactInfo: { type: Boolean, default: false }
    },
    dietary: {
      restrictions: [{ type: String, enum: ['vegetarian', 'vegan', 'gluten_free', 'nut_free', 'dairy_free', 'halal', 'kosher'] }],
      allergies: [String]
    }
  },
  
  // Account Status and Verification
  status: { 
    type: String, 
    enum: ['active', 'pending', 'suspended', 'banned'], 
    default: 'pending' 
  },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Service Provider Information
  serviceProvider: {
    isProvider: { type: Boolean, default: false },
    skills: [String],
    hourlyRate: { type: Number, min: 0 },
    availability: [{
      dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 = Sunday
      startTime: String, // "09:00"
      endTime: String    // "17:00"
    }],
    verificationDocuments: [{
      type: { type: String, enum: ['license', 'insurance', 'certification', 'background_check'] },
      url: String,
      verified: { type: Boolean, default: false },
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  
  // IoT Devices
  iotDevices: [{
    deviceId: String,
    name: String,
    type: { type: String, enum: ['camera', 'sensor', 'smart_lock'] },
    location: String,
    isActive: { type: Boolean, default: true },
    registeredAt: { type: Date, default: Date.now }
  }],
  
  // Analytics and Tracking
  analytics: {
    lastLogin: Date,
    totalLogins: { type: Number, default: 0 },
    itemsShared: { type: Number, default: 0 },
    itemsRented: { type: Number, default: 0 },
    servicesProvided: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    carbonFootprintReduced: { type: Number, default: 0 } // kg CO2 saved
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware for password hashing
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to generate JWT token
UserSchema.methods.signToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export default mongoose.model('User', UserSchema);
```

### Resource Model with Advanced Features
```javascript
const ResourceSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true, trim: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 2000 },
  category: { 
    type: String, 
    required: true,
    enum: ['electronics', 'furniture', 'tools', 'vehicles', 'books', 'sports', 'clothing', 'kitchen', 'garden', 'other']
  },
  subCategory: String,
  tags: [{ type: String, lowercase: true, trim: true }],
  
  // Ownership and Management
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['available', 'rented', 'maintenance', 'unavailable', 'pending_approval', 'rejected'], 
    default: 'available' 
  },
  
  // Physical Properties
  condition: { 
    type: String, 
    enum: ['new', 'excellent', 'good', 'fair', 'poor'], 
    required: true 
  },
  brand: String,
  model: String,
  year: Number,
  color: String,
  dimensions: {
    length: Number, // cm
    width: Number,  // cm
    height: Number, // cm
    weight: Number  // kg
  },
  
  // Location
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'US' }
    },
    pickupInstructions: String,
    isDeliveryAvailable: { type: Boolean, default: false },
    deliveryRadius: { type: Number, default: 0 }, // km
    deliveryFee: { type: Number, default: 0 }
  },
  
  // Pricing and Availability
  pricing: {
    hourly: { type: Number, min: 0 },
    daily: { type: Number, min: 0 },
    weekly: { type: Number, min: 0 },
    monthly: { type: Number, min: 0 },
    deposit: { type: Number, min: 0, default: 0 },
    currency: { type: String, default: 'USD' }
  },
  
  // Images and Media
  images: [{
    url: String,
    publicId: String, // Cloudinary public ID
    isPrimary: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Booking and Availability
  availability: {
    minRentalPeriod: { type: Number, default: 1 }, // hours
    maxRentalPeriod: { type: Number, default: 720 }, // hours (30 days)
    advanceBookingDays: { type: Number, default: 30 },
    instantBooking: { type: Boolean, default: false },
    requiresApproval: { type: Boolean, default: true }
  },
  
  // Rules and Requirements
  rentalRules: [{
    rule: String,
    isRequired: { type: Boolean, default: true }
  }],
  ageRestriction: { type: Number, min: 0, max: 99 },
  requiresLicense: { type: Boolean, default: false },
  
  // Reviews and Ratings
  reviews: [{
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxLength: 1000 },
    images: [String],
    createdAt: { type: Date, default: Date.now },
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  
  // Analytics and Performance
  analytics: {
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageBookingDuration: { type: Number, default: 0 }, // hours
    lastBookedAt: Date,
    popularityScore: { type: Number, default: 0 }
  },
  
  // AI and Smart Features
  aiGenerated: {
    tags: [String], // AI-generated tags
    category: String, // AI-suggested category
    pricing: {
      suggested: Number,
      confidence: Number // 0-1
    },
    description: {
      enhanced: String,
      keywords: [String]
    }
  },
  
  // Safety and Insurance
  safety: {
    instructions: [String],
    warnings: [String],
    insuranceCovered: { type: Boolean, default: false },
    insuranceValue: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
ResourceSchema.index({ location: '2dsphere' });
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
ResourceSchema.index({ category: 1, status: 1, 'pricing.daily': 1 });
ResourceSchema.index({ owner: 1, status: 1 });
ResourceSchema.index({ averageRating: -1, totalReviews: -1 });

export default mongoose.model('Resource', ResourceSchema);
```

### Booking Model with Smart Features
```javascript
const BookingSchema = new mongoose.Schema({
  // Basic Booking Information
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Booking Timeline
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true }, // hours
  
  // Status Management
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Pricing and Payment
  pricing: {
    baseAmount: { type: Number, required: true, min: 0 },
    deposit: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    serviceFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' }
  },
  
  // Payment Information
  payment: {
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'refunded', 'partial_refund', 'failed'],
      default: 'pending'
    },
    method: String, // 'card', 'wallet', 'bank_transfer'
    transactionId: String,
    stripePaymentIntentId: String,
    paidAt: Date,
    refundAmount: { type: Number, default: 0 },
    refundedAt: Date
  },
  
  // Delivery and Logistics
  delivery: {
    isRequired: { type: Boolean, default: false },
    type: { type: String, enum: ['pickup', 'delivery', 'meet_halfway'] },
    pickupLocation: {
      type: { type: String, enum: ['Point'] },
      coordinates: [Number],
      address: String,
      instructions: String
    },
    deliveryLocation: {
      type: { type: String, enum: ['Point'] },
      coordinates: [Number],
      address: String,
      instructions: String
    },
    scheduledTime: Date,
    completedTime: Date,
    trackingInfo: {
      driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      estimatedArrival: Date,
      actualArrival: Date
    }
  },
  
  // Digital Contract and Agreement
  contract: {
    terms: String,
    renterAgreed: { type: Boolean, default: false },
    ownerAgreed: { type: Boolean, default: false },
    renterSignature: String, // Base64 encoded signature
    ownerSignature: String,
    signedAt: Date
  },
  
  // Item Condition and Damage Assessment
  condition: {
    preBooking: {
      photos: [String],
      notes: String,
      checklist: [{
        item: String,
        status: { type: String, enum: ['good', 'damaged', 'missing'] },
        notes: String
      }]
    },
    postBooking: {
      photos: [String],
      notes: String,
      checklist: [{
        item: String,
        status: { type: String, enum: ['good', 'damaged', 'missing'] },
        notes: String
      }],
      damagesReported: [{
        description: String,
        photos: [String],
        estimatedCost: Number,
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reportedAt: { type: Date, default: Date.now }
      }]
    }
  },
  
  // Communication and Messages
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    isSystemMessage: { type: Boolean, default: false }
  }],
  
  // Reviews (will be moved to separate collection after completion)
  pendingReviews: {
    renterReview: { type: Boolean, default: false },
    ownerReview: { type: Boolean, default: false }
  },
  
  // Smart Features and AI
  smartFeatures: {
    conflictDetected: { type: Boolean, default: false },
    alternativeSuggestions: [{
      resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
      reason: String,
      score: Number
    }],
    riskScore: { type: Number, min: 0, max: 1 }, // AI-calculated risk
    successPrediction: { type: Number, min: 0, max: 1 }
  },
  
  // Cancellation and Modifications
  cancellation: {
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    cancelledAt: Date,
    refundAmount: Number,
    penaltyAmount: Number
  },
  
  modifications: [{
    field: String, // 'dates', 'duration', 'delivery'
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
    respondedAt: Date
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
BookingSchema.index({ resource: 1, startDate: 1, endDate: 1 });
BookingSchema.index({ renter: 1, status: 1 });
BookingSchema.index({ owner: 1, status: 1 });
BookingSchema.index({ startDate: 1, endDate: 1 });
BookingSchema.index({ status: 1, createdAt: -1 });

// Virtual for booking duration in days
BookingSchema.virtual('durationDays').get(function() {
  return Math.ceil(this.duration / 24);
});

// Method to check for conflicts
BookingSchema.methods.hasConflict = async function() {
  const conflictingBookings = await this.constructor.find({
    resource: this.resource,
    _id: { $ne: this._id },
    status: { $in: ['confirmed', 'active'] },
    $or: [
      {
        startDate: { $lte: this.endDate },
        endDate: { $gte: this.startDate }
      }
    ]
  });
  return conflictingBookings.length > 0;
};

export default mongoose.model('Booking', BookingSchema);
```

## 🚀 Advanced API Implementation Examples

### Smart Resource Search with AI
```javascript
// Advanced search controller with AI and geospatial features
export const searchResources = async (req, res) => {
  try {
    const {
      query,
      category,
      location,
      radius = 10, // km
      minPrice,
      maxPrice,
      availability,
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = req.query;

    // Build aggregation pipeline
    const pipeline = [];

    // Geospatial filtering if location provided
    if (location) {
      const [lat, lng] = location.split(',').map(Number);
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          maxDistance: radius * 1000, // Convert to meters
          spherical: true
        }
      });
    }

    // Text search if query provided
    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { $text: { $search: query } },
            { tags: { $in: [new RegExp(query, 'i')] } },
            { title: { $regex: query, $options: 'i' } }
          ]
        }
      });
    }

    // Category filtering
    if (category) {
      pipeline.push({
        $match: { category: category }
      });
    }

    // Price filtering
    if (minPrice || maxPrice) {
      const priceMatch = {};
      if (minPrice) priceMatch['pricing.daily'] = { $gte: Number(minPrice) };
      if (maxPrice) priceMatch['pricing.daily'] = { ...priceMatch['pricing.daily'], $lte: Number(maxPrice) };
      pipeline.push({ $match: priceMatch });
    }

    // Add calculated fields
    pipeline.push({
      $addFields: {
        relevanceScore: {
          $add: [
            { $multiply: ["$averageRating", 2] },
            { $divide: ["$analytics.bookings", 10] },
            { $cond: [{ $gt: ["$analytics.views", 0] }, { $divide: ["$analytics.bookings", "$analytics.views"] }, 0] }
          ]
        },
        isAvailableNow: {
          $not: {
            $anyElementTrue: {
              $map: {
                input: { $ifNull: ["$currentBookings", []] },
                as: "booking",
                in: {
                  $and: [
                    { $lte: ["$booking.startDate", new Date()] },
                    { $gte: ["$booking.endDate", new Date()] }
                  ]
                }
              }
            }
          }
        }
      }
    });

    // Lookup current bookings
    pipeline.push({
      $lookup: {
        from: "bookings",
        let: { resourceId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$resource", "$resourceId"] },
              status: { $in: ["confirmed", "active"] },
              startDate: { $lte: new Date() },
              endDate: { $gte: new Date() }
            }
          }
        ],
        as: "currentBookings"
      }
    });

    // Sorting
    const sortOptions = {
      relevance: { relevanceScore: -1, averageRating: -1 },
      price_low: { 'pricing.daily': 1 },
      price_high: { 'pricing.daily': -1 },
      rating: { averageRating: -1, totalReviews: -1 },
      distance: { distance: 1 },
      newest: { createdAt: -1 }
    };

    pipeline.push({ $sort: sortOptions[sortBy] || sortOptions.relevance });

    // Pagination
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip }, { $limit: Number(limit) });

    // Execute aggregation
    const resources = await Resource.aggregate(pipeline);

    // Get total count for pagination
    const totalPipeline = [...pipeline.slice(0, -2)];
    totalPipeline.push({ $count: "total" });
    const totalResult = await Resource.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    // AI-powered recommendations if user is authenticated
    let recommendations = [];
    if (req.user) {
      recommendations = await getPersonalizedRecommendations(req.user.i-time: Socket.io for WebSocket connections
// Authentication: JWT + Refresh Tokens + OAuth2
// File Storage: MongoDB GridFS + Cloudinary
// Queue System: Bull Queue with Redis
// Search Engine: MongoDB Atlas Search / Elasticsearch
// ML Framework: TensorFlow.js Node
// IoT Communication: MQTT broker integration
// API Documentation: Swagger/OpenAPI 3.0
// Testing: Jest + Supertest + MongoDB Memory Server
```

### Project Structure
```
community-resource-backend/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server startup and graceful shutdown
│   ├── config/
│   │   ├── database.js           # MongoDB connection config
│   │   ├── redis.js              # Redis configuration
│   │   ├── cloudinary.js         # File upload configuration
│   │   ├── jwt.js                # JWT configuration
│   │   └── environment.js        # Environment variables
│   ├── models/
│   │   ├── User.js               # User schema with geospatial data
│   │   ├── Resource.js           # Resource schema with advanced indexing
│   │   ├── Booking.js            # Booking with conflict resolution
│   │   ├── Community.js          # Community boundaries and metadata
│   │   ├── IoTDevice.js          # IoT device management
│   │   ├── Transaction.js        # Payment and financial records
│   │   ├── Message.js            # Real-time chat messages
│   │   ├── Review.js             # Rating and review system
│   │   └── Analytics.js          # Usage analytics and metrics
│   ├── controllers/
│   │   ├── authController.js     # Authentication and authorization
│   │   ├── resourceController.js # Resource CRUD with advanced features
│   │   ├── bookingController.js  # Smart booking management
│   │   ├── communityController.js# Community features and social
│   │   ├── iotController.js      # IoT device integration
│   │   ├── paymentController.js  # Payment processing and wallet
│   │   ├── chatController.js     # Real-time messaging
│   │   ├── adminController.js    # Admin panel functionality
│   │   └── analyticsController.js# Business intelligence
│   ├── services/
│   │   ├── authService.js        # Authentication business logic
│   │   ├── aiService.js          # Machine learning and AI features
│   │   ├── iotService.js         # IoT data processing
│   │   ├── emailService.js       # Email notifications
│   │   ├── smsService.js         # SMS notifications
│   │   ├── paymentService.js     # Stripe integration
│   │   ├── geoService.js         # Geospatial calculations
│   │   ├── searchService.js      # Advanced search functionality
│   │   ├── recommendationService.js # AI-powered recommendations
│   │   └── notificationService.js# Push and real-time notifications
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   ├── validation.js         # Request validation with Joi
│   │   ├── rateLimit.js          # Advanced rate limiting
│   │   ├── errorHandler.js       # Global error handling
│   │   ├── logging.js            # Request/response logging
│   │   ├── cors.js               # CORS configuration
│   │   └── security.js           # Security headers and protection
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── resources.js          # Resource management routes
│   │   ├── bookings.js           # Booking system routes
│   │   ├── community.js          # Community features routes
│   │   ├── iot.js                # IoT integration routes
│   │   ├── payments.js           # Payment processing routes
│   │   ├── chat.js               # Real-time messaging routes
│   │   ├── admin.js              # Admin panel routes
│   │   ├── analytics.js          # Analytics and reporting routes
│   │   └── uploads.js            # File upload routes
│   ├── utils/
│   │   ├── logger.js             # Winston logging configuration
│   │   ├── helpers.js            # Common helper functions
│   │   ├── constants.js          # Application constants
│   │   ├── validation.js         # Custom validation rules
│   │   ├── encryption.js         # Data encryption utilities
│   │   └── email-templates.js    # Email template engine
│   ├── websocket/
│   │   ├── socketHandler.js      # Socket.io event handlers
│   │   ├── rooms.js              # Room management for real-time features
│   │   └── events.js             # WebSocket event definitions
│   ├── jobs/
│   │   ├── emailJobs.js          # Background email processing
│   │   ├── analyticsJobs.js      # Data processing jobs
│   │   ├── cleanupJobs.js        # Database cleanup tasks
│   │   └── iotJobs.js            # IoT data processing jobs
│   └── tests/
│       ├── unit/                 # Unit tests for services and utils
│       ├── integration/          # API integration tests
│       ├── fixtures/             # Test data and fixtures
│       └── setup.js              # Test environment setup
├── docs/
│   ├── api/                      # API documentation
│   ├── deployment/               # Deployment guides
│   └── architecture/             # System architecture docs
├── scripts/
│   ├── seed.js                   # Database seeding script
│   ├── migrate.js                # Database migration script
│   └── setup.js                  # Initial setup script
├── docker/
│   ├── Dockerfile                # Production Docker image
│   ├── docker-compose.yml        # Development environment
│   └── docker-compose.prod.yml   # Production environment
├── package.json
├── .env.example
└── README.md
```

## 🚀 Required Features & API Endpoints

### 1. Advanced Authentication & User Management
```javascript
// Comprehensive authentication system with multiple providers
// JWT with refresh token rotation for security
// OAuth2 integration (Google, Facebook, Apple)
// Biometric authentication support for mobile
// Multi-factor authentication with TOTP

// Key endpoints to implement:
// POST   /api/v1/auth/register           - User registration with email verification
// POST   /api/v1/auth/login              - Login with multiple authentication methods
// POST   /api/v1/auth/refresh            - JWT token refresh
// POST   /api/v1/auth/logout             - Secure logout with token invalidation
// POST   /api/v1/auth/forgot-password    - Password reset initiation
// POST   /api/v1/auth/reset-password     - Password reset confirmation
// POST   /api/v1/auth/verify-email       - Email verification
// POST   /api/v1/auth/resend-verification - Resend verification email
// GET    /api/v1/auth/profile            - Get user profile
// PUT    /api/v1/auth/profile            - Update user profile
// POST   /api/v1/auth/change-password    - Change password
// POST   /api/v1/auth/enable-2fa         - Enable two-factor authentication
// POST   /api/v1/auth/verify-2fa         - Verify 2FA token
// POST   /api/v1/auth/oauth/google       - Google OAuth login
// DELETE /api/v1/auth/delete-account     - Account deletion
```

### 2. Intelligent Resource Management System
```javascript
// Advanced resource management with AI-powered features
// Geospatial search with MongoDB's 2dsphere indexing
// Dynamic pricing based on demand and availability
// Image recognition for automatic categorization
// Smart inventory tracking with IoT integration

// Key endpoints to implement:
// GET    /api/v1/resources               - Get resources with advanced filtering
// GET    /api/v1/resources/search        - AI-powered search with NLP
// GET    /api/v1/resources/nearby        - Geospatial proximity search
// GET    /api/v1/resources/trending      - Trending resources in community
// GET    /api/v1/resources/recommendations - AI-powered recommendations
// GET    /api/v1/resources/:id           - Get single resource details
// POST   /api/v1/resources               - Create new resource
// PUT    /api/v1/resources/:id           - Update resource
// DELETE /api/v1/resources/:id           - Delete resource (soft delete)
// POST   /api/v1/resources/:id/images    - Upload resource images
// DELETE /api/v1/resources/:id/images/:imageId - Delete specific image
// GET    /api/v1/resources/:id/availability - Check real-time availability
// POST   /api/v1/resources/:id/report    - Report inappropriate content
// GET    /api/v1/resources/:id/similar   - Find similar resources
// POST   /api/v1/resources/:id/favorite  - Add to favorites
// DELETE /api/v1/resources/:id/favorite  - Remove from favorites
// GET    /api/v1/resources/categories    - Get all categories with counts
// POST   /api/v1/resources/bulk-upload   - Bulk resource upload
// GET    /api/v1/resources/my-resources  - Get user's resources
// PUT    /api/v1/resources/:id/status    - Update resource status
```

### 3. Revolutionary IoT & AI Integration
```javascript
// Real-time IoT device management with MQTT integration
// Machine learning for object detection and classification
// Smart notifications based on detected patterns
// Automated inventory synchronization
// Person detection with privacy controls

// Key endpoints to implement:
// POST   /api/v1/iot/devices/register    - Register new IoT device
// GET    /api/v1/iot/devices             - Get user's IoT devices
// GET    /api/v1/iot/devices/:id         - Get device details and status
// PUT    /api/v1/iot/devices/:id         - Update device configuration
// DELETE /api/v1/iot/devices/:id         - Remove device
// POST   /api/v1/iot/devices/:id/stream  - Start/stop video stream
// GET    /api/v1/iot/devices/:id/status  - Get real-time device status
// POST   /api/v1/iot/data/object-detection - Process object detection data
// POST   /api/v1/iot/data/person-detection - Process person detection data
// GET    /api/v1/iot/analytics/detections - Get detection history
// POST   /api/v1/iot/notifications/configure - Configure smart notifications
// GET    /api/v1/iot/notifications/history - Get notification history
// POST   /api/v1/iot/sync/inventory      - Sync detected items with inventory
// PUT    /api/v1/iot/devices/:id/privacy - Update privacy settings
// GET    /api/v1/iot/models/status       - Get ML model status and versions
// POST   /api/v1/iot/models/retrain      - Trigger model retraining
```

### 4. Advanced Booking & Rental Engine
```javascript
// Smart booking system with conflict resolution
// Dynamic pricing with surge algorithms
// Automated scheduling and reminders
// Digital contracts with e-signature support
// Damage assessment with image comparison

// Key endpoints to implement:
// POST   /api/v1/bookings                - Create new booking
// GET    /api/v1/bookings                - Get user's bookings with filters
// GET    /api/v1/bookings/:id            - Get booking details
// PUT    /api/v1/bookings/:id            - Update booking (reschedule/modify)
// DELETE /api/v1/bookings/:id            - Cancel booking
// POST   /api/v1/bookings/:id/confirm    - Confirm booking
// POST   /api/v1/bookings/:id/start      - Start rental period
// POST   /api/v1/bookings/:id/return     - Complete return process
// POST   /api/v1/bookings/:id/extend     - Extend booking duration
// GET    /api/v1/bookings/:id/contract   - Get digital rental agreement
// POST   /api/v1/bookings/:id/sign       - Sign digital contract
// POST   /api/v1/bookings/:id/damage-report - Report damage with photos
// GET    /api/v1/bookings/:id/timeline   - Get booking timeline and status
// POST   /api/v1/bookings/:id/review     - Submit review and rating
// GET    /api/v1/bookings/conflicts      - Check for booking conflicts
// POST   /api/v1/bookings/bulk-create    - Create recurring bookings
// GET    /api/v1/bookings/calendar/:resourceId - Get availability calendar
// POST   /api/v1/bookings/:id/dispute    - Initiate dispute resolution
// GET    /api/v1/bookings/analytics      - Get booking analytics
```

### 5. Service Marketplace & Provider Management
```javascript
// Skill-based service matching with AI algorithms
// Service provider verification and ratings
// Real-time availability management
// Performance analytics and insights
// Automated quality assurance

// Key endpoints to implement:
// GET    /api/v1/services                - Browse available services
// GET    /api/v1/services/categories     - Get service categories
// GET    /api/v1/services/providers      - Get service providers with filters
// GET    /api/v1/services/providers/:id  - Get provider profile
// POST   /api/v1/services/providers/register - Register as service provider
// PUT    /api/v1/services/providers/profile - Update provider profile
// POST   /api/v1/services/request        - Request a service
// GET    /api/v1/services/requests       - Get service requests
// PUT    /api/v1/services/requests/:id   - Update service request status
// POST   /api/v1/services/quote          - Submit service quote
// POST   /api/v1/services/accept-quote   - Accept service quote
// GET    /api/v1/services/my-services    - Get provider's services
// POST   /api/v1/services                - Create new service offering
// PUT    /api/v1/services/:id            - Update service offering
// GET    /api/v1/services/bookings       - Get service bookings
// POST   /api/v1/services/complete       - Mark service as completed
// POST   /api/v1/services/verify-provider - Submit verification documents
// GET    /api/v1/services/analytics      - Get service performance analytics
// POST   /api/v1/services/schedule       - Set availability schedule
```

### 6. Space & Storage Sharing System
```javascript
// 3D space management with measurement tools
// Storage optimization algorithms
// Access control with digital keys
// Usage analytics and pricing optimization
// Security monitoring and alerts

// Key endpoints to implement:
// GET    /api/v1/spaces                  - Browse available spaces
// GET    /api/v1/spaces/:id              - Get space details
// POST   /api/v1/spaces                  - List new space
// PUT    /api/v1/spaces/:id              - Update space listing
// DELETE /api/v1/spaces/:id              - Remove space listing
// GET    /api/v1/spaces/:id/availability - Check space availability
// POST   /api/v1/spaces/:id/book         - Book storage space
// GET    /api/v1/spaces/bookings         - Get space bookings
// POST   /api/v1/spaces/:id/access       - Generate digital access key
// GET    /api/v1/spaces/:id/usage        - Get space usage analytics
// POST   /api/v1/spaces/:id/measurements - Upload space measurements
// GET    /api/v1/spaces/:id/optimization - Get storage optimization suggestions
// POST   /api/v1/spaces/:id/security     - Configure security settings
// GET    /api/v1/spaces/:id/access-log   - Get access history
// PUT    /api/v1/spaces/:id/pricing      - Update pricing strategy
// POST   /api/v1/spaces/:id/maintenance  - Schedule maintenance
// GET    /api/v1/spaces/nearby           - Find nearby storage spaces
// POST   /api/v1/spaces/:id/photos       - Upload space photos
```

### 7. Food Sharing Network
```javascript
// Food safety tracking with expiry management
// Dietary preference matching
// Community meal coordination
// Waste reduction tracking
// Health compliance monitoring

// Key endpoints to implement:
// GET    /api/v1/food                    - Browse available food items
// POST   /api/v1/food                    - Share food item
// GET    /api/v1/food/:id                - Get food item details
// PUT    /api/v1/food/:id                - Update food item
// DELETE /api/v1/food/:id                - Remove food item
// POST   /api/v1/food/:id/request        - Request food item
// GET    /api/v1/food/requests           - Get food requests
// POST   /api/v1/food/events             - Create community meal event
// GET    /api/v1/food/events             - Get community meal events
// POST   /api/v1/food/events/:id/rsvp    - RSVP to community meal
// GET    /api/v1/food/preferences        - Get dietary preferences
// PUT    /api/v1/food/preferences        - Update dietary preferences
// GET    /api/v1/food/safety-guidelines  - Get food safety guidelines
// POST   /api/v1/food/:id/safety-report  - Report food safety concern
// GET    /api/v1/food/expiring           - Get items expiring soon
// POST   /api/v1/food/:id/pickup         - Confirm food pickup
// GET    /api/v1/food/waste-analytics    - Get food waste reduction metrics
// POST   /api/v1/food/recipes            - Share community recipes
// GET    /api/v1/food/recipes            - Get community recipes
```

### 8. Real-time Chat & Communication Hub
```javascript
// WebSocket-based real-time messaging
// Group chats with role-based permissions
// File sharing and media support
// Message encryption and security
// AI-powered chat assistance

// Key endpoints to implement:
// GET    /api/v1/chat/conversations      - Get user's conversations
// POST   /api/v1/chat/conversations      - Start new conversation
// GET    /api/v1/chat/conversations/:id  - Get conversation details
// POST   /api/v1/chat/conversations/:id/messages - Send message
// GET    /api/v1/chat/conversations/:id/messages - Get conversation messages
// PUT    /api/v1/chat/messages/:id       - Edit message
// DELETE /api/v1/chat/messages/:id       - Delete message
// POST   /api/v1/chat/messages/:id/read  - Mark message as read
// POST   /api/v1/chat/upload             - Upload file/media to chat
// GET    /api/v1/chat/search             - Search messages
// POST   /api/v1/chat/groups             - Create group chat
// POST   /api/v1/chat/groups/:id/members - Add members to group
// DELETE /api/v1/chat/groups/:id/members/:userId - Remove group member
// PUT    /api/v1/chat/groups/:id/settings - Update group settings
// POST   /api/v1/chat/report             - Report inappropriate message
// GET    /api/v1/chat/archived           - Get archived conversations
// POST   /api/v1/chat/archive/:id        - Archive conversation
// PUT    /api/v1/chat/settings           - Update chat preferences
```

### 9. Advanced Payment & Financial System
```javascript
// Stripe integration with complex fee structures
// Digital wallet with multiple currencies
// Escrow system for secure transactions
// Automated billing and invoicing
// Financial analytics and reporting

// Key endpoints to implement:
// POST   /api/v1/payments/create-intent  - Create payment intent
// POST   /api/v1/payments/confirm        - Confirm payment
// POST   /api/v1/payments/refund         - Process refund
// GET    /api/v1/payments/history        - Get payment history
// GET    /api/v1/payments/methods        - Get saved payment methods
// POST   /api/v1/payments/methods        - Add payment method
// DELETE /api/v1/payments/methods/:id    - Remove payment method
// GET    /api/v1/wallet/balance          - Get wallet balance
// POST   /api/v1/wallet/add-funds        - Add funds to wallet
// POST   /api/v1/wallet/transfer         - Transfer funds between users
// GET    /api/v1/wallet/transactions     - Get wallet transaction history
// POST   /api/v1/payments/escrow/create  - Create escrow transaction
// POST   /api/v1/payments/escrow/release - Release escrow funds
// GET    /api/v1/payments/invoices       - Get invoices
// POST   /api/v1/payments/invoices       - Create invoice
// GET    /api/v1/payments/analytics      - Get financial analytics
// POST   /api/v1/payments/dispute        - Create payment dispute
// GET    /api/v1/payments/fees           - Get fee structure
// POST   /api/v1/payments/payout         - Initiate payout to provider
```

### 10. Community Features & Social Network
```javascript
// Neighborhood-based community management
// Activity feeds with real-time updates
// Community events and coordination
// Trust network and reputation system
// Gamification with achievements

// Key endpoints to implement:
// GET    /api/v1/community/feed          - Get community activity feed
// POST   /api/v1/community/posts         - Create community post
// GET    /api/v1/community/posts/:id     - Get post details
// POST   /api/v1/community/posts/:id/like - Like/unlike post
// POST   /api/v1/community/posts/:id/comment - Comment on post
// GET    /api/v1/community/events        - Get community events
// POST   /api/v1/community/events        - Create community event
// POST   /api/v1/community/events/:id/rsvp - RSVP to event
// GET    /api/v1/community/members       - Get community members
// GET    /api/v1/community/boundaries    - Get community geographical boundaries
// POST   /api/v1/community/join          - Join community
// POST   /api/v1/community/invite        - Invite neighbor to community
// GET    /api/v1/community/trust-network - Get trust network visualization
// POST   /api/v1/community/verify-neighbor - Verify neighbor identity
// GET    /api/v1/community/achievements  - Get user achievements
// GET    /api/v1/community/leaderboard   - Get community leaderboard
// POST   /api/v1/community/goals         - Set community goals
// GET    /api/v1/community/impact        - Get environmental impact metrics
// POST   /api/v1/community/polls         - Create community poll
// POST   /api/v1/community/polls/:id/vote - Vote on poll
```

### 11. Advanced Analytics & Business Intelligence
```javascript
// Comprehensive analytics with real-time insights
// Resource utilization and demand forecasting
// Community health and engagement metrics
// Revenue and business performance analytics
// Machine learning-powered predictions

// Key endpoints to implement:
// GET    /api/v1/analytics/dashboard     - Get main analytics dashboard
// GET    /api/v1/analytics/resources     - Get resource utilization metrics
// GET    /api/v1/analytics/bookings      - Get booking analytics
// GET    /api/v1/analytics/revenue       - Get revenue analytics
// GET    /api/v1/analytics/users         - Get user engagement metrics
// GET    /api/v1/analytics/community     - Get community health metrics
// GET    /api/v1/analytics/demand-forecast - Get demand predictions
// GET    /api/v1/analytics/pricing-insights - Get pricing optimization data
// GET    /api/v1/analytics/geographic    - Get geographic distribution data
// GET    /api/v1/analytics/environmental - Get environmental impact data
// GET    /api/v1/analytics/retention     - Get user retention metrics
// GET    /api/v1/analytics/performance   - Get app performance metrics
// POST   /api/v1/analytics/custom-query  - Run custom analytics query
// GET    /api/v1/analytics/reports       - Get scheduled reports
// POST   /api/v1/analytics/reports       - Create custom report
// GET    /api/v1/analytics/export        - Export analytics data
// GET    /api/v1/analytics/real-time     - Get real-time metrics
// GET    /api/v1/analytics/trends        - Get trending patterns
```

### 12. Admin Panel & Management System
```javascript
// Comprehensive admin dashboard for platform management
// User management and moderation tools
// Content moderation and community guidelines
// System monitoring and health checks
// Financial management and reporting

// Key endpoints to implement:
// GET    /api/v1/admin/dashboard         - Get admin dashboard overview
// GET    /api/v1/admin/users             - Get all users with filters
// GET    /api/v1/admin/users/:id         - Get detailed user information
// PUT    /api/v1/admin/users/:id/status  - Update user status (ban/suspend)
// GET    /api/v1/admin/resources         - Get all resources for moderation
// PUT    /api/v1/admin/resources/:id/status - Approve/reject resource
// GET    /api/v1/admin/reports           - Get user reports and complaints
// PUT    /api/v1/admin/reports/:id       - Handle report (resolve/escalate)
// GET    /api/v1/admin/transactions      - Get all financial transactions
// GET    /api/v1/admin/communities       - Manage communities
// POST   /api/v1/admin/communities       - Create new community
// GET    /api/v1/admin/system-health     - Get system health metrics
// GET    /api/v1/admin/logs              - Get system logs
// POST   /api/v1/admin/announcements     - Create system announcements
// GET    /api/v1/admin/analytics         - Get comprehensive platform analytics
// PUT    /api/v1/admin/settings          - Update platform settings
// POST   /api/v1/admin/backup            - Trigger database backup
// GET    /api/v1/admin/audit-trail       - Get audit trail logs
```

## 🛡️ Security & Performance Requirements

### Advanced Security Implementation
```javascript
// Comprehensive security measures
const securityMiddleware = {
  // JWT authentication with refresh token rotation
  authentication: jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: (req) => {
      // Extract token from multiple sources
      return req.headers.authorization?.split(' ')[1] || 
             req.cookies.token || 
             req.query.token;
    }
  }),
  
  // Advanced rate limiting with sliding window
  rateLimiting: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
      // Different limits based on user type
      if (req.user?.isPremium) return 1000;
      return req.user ? 500 : 100;
    },
    keyGenerator: (req) => {
      return req.user?.id || req.ip;
    }
  }),
  
  // Input validation and sanitization
  validation: (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message)
      });
    }
    next();
  },
  
  // XSS and injection protection
  sanitization: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
};
```

### Performance Optimization Strategies
```javascript
// MongoDB performance optimization
const optimizedQueries = {
  // Geospatial indexing for location-based searches
  setupIndexes: async () => {
    await Resource.collection.createIndex({ location: "2dsphere" });
    await User.collection.createIndex({ "location": "2dsphere" });
    await Resource.collection.createIndex({ 
      title: "text", 
      description: "text", 
      tags: "text" 
    });
    await Resource.collection.createIndex({ category: 1, status: 1 });
    await Booking.collection.createIndex({ resourceId: 1, startDate: 1, endDate: 1 });
  },
  
  // Aggregation pipelines for complex queries
  nearbyResourcesWithStats: (userLat, userLng, maxDistance = 10000) => [
    {
      $geoNear: {
        near: { type: "Point", coordinates: [userLng, userLat] },
        distanceField: "distance",
        maxDistance,
        spherical: true
      }
    },
    {
      $lookup: {
        from: "bookings",
        localField: "_id",
        foreignField: "resourceId",
        as: "bookings"
      }
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
        totalBookings: { $size: "$bookings" },
        isAvailable: {
          $not: {
            $anyElementTrue: {
              $map: {
                input: "$bookings",
                as: "booking",
                in: {
                  $and: [
                    { $lte: ["$$booking.startDate", new Date()] },
                    { $gte: ["$$booking.endDate", new Date()] }
                  ]
                }
              }
            }
          }
        }
      }
    },
    { $sort: { distance: 1, averageRating: -1 } }
  ]
};

// Redis caching strategy
const cacheService = {
  // Cache frequently accessed data
  cacheResource: async (resourceId, data, ttl = 3600) => {
    await redis.setex(`resource:${resourceId}`, ttl, JSON.stringify(data));
  },
  
  // Cache search results
  cacheSearchResults: async (searchKey, results, ttl = 1800) => {
    await redis.setex(`search:${searchKey}`, ttl, JSON.stringify(results));
  },
  
  // Real