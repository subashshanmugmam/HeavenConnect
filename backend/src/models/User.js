import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { config } from '../config/environment.js';

const UserSchema = new mongoose.Schema({
  // Basic Information
  firstName: { 
    type: String, 
    required: [true, 'First name is required'], 
    trim: true, 
    maxLength: [50, 'First name cannot exceed 50 characters'] 
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'], 
    trim: true, 
    maxLength: [50, 'Last name cannot exceed 50 characters'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email']
  },
  username: { 
    type: String, 
    unique: true, 
    sparse: true, 
    trim: true,
    minLength: [3, 'Username must be at least 3 characters'],
    maxLength: [20, 'Username cannot exceed 20 characters']
  },
  phone: {
    number: { 
      type: String, 
      validate: [validator.isMobilePhone, 'Invalid phone number'] 
    },
    verified: { type: Boolean, default: false },
    verificationCode: String,
    verificationExpires: Date
  },
  
  // Authentication
  password: { 
    type: String, 
    required: [true, 'Password is required'], 
    minLength: [8, 'Password must be at least 8 characters'], 
    select: false 
  },
  refreshTokens: [{ 
    token: String, 
    createdAt: { type: Date, default: Date.now } 
  }],
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
  bio: { 
    type: String, 
    maxLength: [500, 'Bio cannot exceed 500 characters'] 
  },
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
    privacy: { 
      type: String, 
      enum: ['public', 'community', 'private'], 
      default: 'community' 
    }
  },
  communities: [{
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    role: { 
      type: String, 
      enum: ['member', 'moderator', 'admin'], 
      default: 'member' 
    },
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
      type: { 
        type: String, 
        enum: ['verified', 'trusted_neighbor', 'eco_warrior', 'helpful', 'responsive'] 
      },
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
      profileVisibility: { 
        type: String, 
        enum: ['public', 'community', 'private'], 
        default: 'community' 
      },
      showLocation: { type: Boolean, default: true },
      showContactInfo: { type: Boolean, default: false }
    },
    dietary: {
      restrictions: [{ 
        type: String, 
        enum: ['vegetarian', 'vegan', 'gluten_free', 'nut_free', 'dairy_free', 'halal', 'kosher'] 
      }],
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  
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
      type: { 
        type: String, 
        enum: ['license', 'insurance', 'certification', 'background_check'] 
      },
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

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'location.coordinates': '2dsphere' });
UserSchema.index({ 'communities.communityId': 1 });
UserSchema.index({ status: 1, emailVerified: 1 });

// Pre-save middleware for password hashing
UserSchema.pre('save', async function(next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save middleware to update analytics
UserSchema.pre('save', function(next) {
  if (this.isModified('analytics.lastLogin')) {
    this.analytics.totalLogins += 1;
  }
  next();
});

// Instance method to check password
UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to generate JWT token
UserSchema.methods.signToken = function() {
  return jwt.sign({ id: this._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

// Instance method to generate refresh token
UserSchema.methods.signRefreshToken = function() {
  return jwt.sign({ id: this._id }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN
  });
};

// Instance method to create password reset token
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Instance method to create email verification token
UserSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

// Static method to calculate trust score
UserSchema.statics.calculateTrustScore = function(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  // Factor in number of reviews (more reviews = higher confidence)
  const reviewCountFactor = Math.min(reviews.length / 10, 1); // Max factor of 1 at 10+ reviews
  
  return Math.round(averageRating * 20 * reviewCountFactor); // Convert to 0-100 scale
};

// Static method to find nearby users
UserSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000) {
  return this.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [longitude, latitude] },
        distanceField: "distance",
        maxDistance: maxDistance,
        spherical: true,
        query: { 
          status: 'active',
          'location.privacy': { $in: ['public', 'community'] }
        }
      }
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        avatar: 1,
        trustScore: 1,
        distance: 1,
        'location.address.city': 1,
        'location.address.state': 1
      }
    }
  ]);
};

export default mongoose.model('User', UserSchema);