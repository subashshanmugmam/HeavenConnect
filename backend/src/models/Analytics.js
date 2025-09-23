import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  // Event Identity and Classification
  eventId: {
    type: String,
    unique: true,
    default: function() {
      return 'EVT' + Date.now() + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
  },
  
  // Event Type and Category
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: {
      values: [
        // User Events
        'user_signup', 'user_login', 'user_logout', 'profile_update',
        'email_verification', 'phone_verification', 'password_reset',
        
        // Resource Events
        'resource_created', 'resource_viewed', 'resource_searched',
        'resource_favorited', 'resource_shared', 'resource_updated',
        'resource_deleted', 'resource_reported',
        
        // Booking Events
        'booking_initiated', 'booking_confirmed', 'booking_cancelled',
        'booking_completed', 'booking_disputed', 'booking_reviewed',
        'booking_payment_failed', 'booking_reminder_sent',
        
        // Payment Events
        'payment_initiated', 'payment_completed', 'payment_failed',
        'payment_refunded', 'payout_processed', 'subscription_created',
        
        // Community Events
        'community_joined', 'community_left', 'community_created',
        'post_created', 'comment_created', 'event_created',
        
        // Communication Events
        'message_sent', 'message_read', 'notification_sent',
        'notification_clicked', 'email_opened', 'sms_delivered',
        
        // IoT Events
        'device_connected', 'device_disconnected', 'sensor_reading',
        'alert_triggered', 'geofence_event', 'device_maintenance',
        
        // System Events
        'error_occurred', 'performance_metric', 'security_event',
        'feature_flag_toggled', 'api_call', 'webhook_triggered'
      ],
      message: 'Event type must be one of the predefined options'
    }
  },
  
  category: {
    type: String,
    enum: {
      values: [
        'user_lifecycle', 'engagement', 'transaction', 'content',
        'communication', 'system', 'security', 'performance',
        'iot', 'marketing', 'support'
      ],
      message: 'Category must be one of the predefined options'
    },
    required: [true, 'Event category is required']
  },
  
  // Related Entities
  entities: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      sparse: true
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      sparse: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      sparse: true
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      sparse: true
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      sparse: true
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      sparse: true
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IoTDevice',
      sparse: true
    }
  },
  
  // Event Properties and Data
  properties: {
    // Flexible object to store event-specific data
    data: mongoose.Schema.Types.Mixed,
    
    // Common properties
    value: Number, // Monetary value or count
    quantity: Number,
    duration: Number, // Duration in seconds
    success: Boolean,
    errorCode: String,
    errorMessage: String,
    
    // Performance metrics
    responseTime: Number, // milliseconds
    loadTime: Number,
    memoryUsage: Number,
    cpuUsage: Number
  },
  
  // User and Session Context
  context: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      sparse: true
    },
    sessionId: String,
    deviceId: String,
    fingerprint: String,
    isAuthenticated: { type: Boolean, default: false },
    userRole: String,
    userSegment: String, // Premium, free, etc.
    
    // Geographic context
    location: {
      country: String,
      region: String,
      city: String,
      timezone: String,
      coordinates: [Number] // [longitude, latitude]
    },
    
    // Device and technical context
    device: {
      type: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet', 'iot', 'api']
      },
      os: String,
      browser: String,
      version: String,
      screenResolution: String,
      userAgent: String
    },
    
    // App context
    app: {
      version: String,
      platform: {
        type: String,
        enum: ['web', 'ios', 'android', 'api']
      },
      environment: {
        type: String,
        enum: ['production', 'staging', 'development'],
        default: 'production'
      }
    }
  },
  
  // Source and Attribution
  source: {
    channel: {
      type: String,
      enum: [
        'direct', 'search', 'social', 'email', 'referral',
        'paid_search', 'display', 'affiliate', 'mobile_app'
      ]
    },
    medium: String,
    campaign: String,
    content: String,
    term: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmContent: String,
    utmTerm: String
  },
  
  // Timing Information
  timestamp: {
    occurred: { type: Date, default: Date.now },
    processed: Date,
    received: Date
  },
  
  // Funnel and Conversion Tracking
  funnel: {
    step: String,
    stepNumber: Number,
    funnelId: String,
    isConversion: { type: Boolean, default: false },
    conversionValue: Number,
    conversionType: String,
    timeToConvert: Number // seconds from funnel start
  },
  
  // A/B Testing and Experiments
  experiments: [{
    experimentId: String,
    experimentName: String,
    variant: String,
    isControlGroup: { type: Boolean, default: false }
  }],
  
  // Cohort Analysis
  cohort: {
    signupWeek: String, // YYYY-WW format
    signupMonth: String, // YYYY-MM format
    userAge: Number, // Days since signup
    segment: String
  },
  
  // Revenue and Business Metrics
  revenue: {
    amount: Number,
    currency: { type: String, default: 'USD' },
    isRecurring: { type: Boolean, default: false },
    planType: String,
    discountAmount: Number,
    taxAmount: Number
  },
  
  // Customer Journey
  journey: {
    touchpoint: String,
    touchpointNumber: Number,
    journeyId: String,
    previousEvent: String,
    nextEventPrediction: String,
    customerLifecycleStage: {
      type: String,
      enum: ['prospect', 'new', 'active', 'dormant', 'churned']
    }
  },
  
  // Quality and Validation
  quality: {
    isValid: { type: Boolean, default: true },
    validationErrors: [String],
    confidence: Number, // 0-1
    isAnomaly: { type: Boolean, default: false },
    anomalyScore: Number
  },
  
  // Privacy and Compliance
  privacy: {
    isPersonalData: { type: Boolean, default: false },
    consentGiven: { type: Boolean, default: true },
    dataRetentionDays: { type: Number, default: 365 },
    shouldAnonymize: { type: Boolean, default: false },
    gdprCompliant: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
  // Add sharding key for large collections
  shardKey: { 'timestamp.occurred': 1 },
  // TTL index for automatic deletion
  expireAfterSeconds: 31536000 // 1 year
});

// Indexes for performance and time-series queries
AnalyticsSchema.index({ eventType: 1, 'timestamp.occurred': -1 });
AnalyticsSchema.index({ category: 1, 'timestamp.occurred': -1 });
AnalyticsSchema.index({ 'context.userId': 1, 'timestamp.occurred': -1 });
AnalyticsSchema.index({ 'entities.user': 1, 'timestamp.occurred': -1 });
AnalyticsSchema.index({ 'entities.resource': 1, eventType: 1 });
AnalyticsSchema.index({ 'entities.booking': 1, eventType: 1 });
AnalyticsSchema.index({ eventId: 1 }, { unique: true });

// Compound indexes for common queries
AnalyticsSchema.index({ 
  eventType: 1, 
  'context.app.platform': 1, 
  'timestamp.occurred': -1 
});

AnalyticsSchema.index({
  'funnel.funnelId': 1,
  'funnel.stepNumber': 1,
  'timestamp.occurred': 1
});

// Virtual for event age
AnalyticsSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.timestamp.occurred.getTime()) / (1000 * 60 * 60));
});

// Virtual for determining if event is recent
AnalyticsSchema.virtual('isRecent').get(function() {
  const hoursSinceEvent = this.ageInHours;
  return hoursSinceEvent <= 24; // Within 24 hours
});

// Pre-save middleware
AnalyticsSchema.pre('save', function(next) {
  // Set processed timestamp
  if (!this.timestamp.processed) {
    this.timestamp.processed = new Date();
  }
  
  // Calculate cohort data if user is present
  if (this.context.userId && !this.cohort.signupWeek) {
    // This would need to be populated from user data
    const now = new Date();
    this.cohort.signupMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  }
  
  // Validate privacy compliance
  if (this.privacy.isPersonalData && !this.privacy.consentGiven) {
    this.quality.isValid = false;
    this.quality.validationErrors.push('Personal data without consent');
  }
  
  next();
});

// Static method for time-series analytics
AnalyticsSchema.statics.getTimeSeries = function(options = {}) {
  const {
    eventType,
    startDate,
    endDate,
    interval = 'day',
    filters = {}
  } = options;

  const matchStage = { ...filters };
  
  if (eventType) {
    matchStage.eventType = eventType;
  }
  
  if (startDate || endDate) {
    matchStage['timestamp.occurred'] = {};
    if (startDate) matchStage['timestamp.occurred'].$gte = new Date(startDate);
    if (endDate) matchStage['timestamp.occurred'].$lte = new Date(endDate);
  }

  const groupFormats = {
    hour: { $dateToString: { format: "%Y-%m-%d-%H", date: "$timestamp.occurred" } },
    day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp.occurred" } },
    week: { $dateToString: { format: "%Y-%U", date: "$timestamp.occurred" } },
    month: { $dateToString: { format: "%Y-%m", date: "$timestamp.occurred" } }
  };

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: groupFormats[interval],
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$context.userId' },
        totalValue: { $sum: '$properties.value' },
        averageValue: { $avg: '$properties.value' },
        successRate: {
          $avg: { $cond: ['$properties.success', 1, 0] }
        }
      }
    },
    {
      $addFields: {
        uniqueUserCount: { $size: '$uniqueUsers' },
        date: '$_id'
      }
    },
    {
      $project: {
        uniqueUsers: 0
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method for funnel analysis
AnalyticsSchema.statics.getFunnelAnalysis = function(funnelId, dateRange = {}) {
  const matchStage = {
    'funnel.funnelId': funnelId,
    ...dateRange
  };

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$funnel.step',
        stepNumber: { $first: '$funnel.stepNumber' },
        userCount: { $addToSet: '$context.userId' },
        eventCount: { $sum: 1 },
        conversions: {
          $sum: { $cond: ['$funnel.isConversion', 1, 0] }
        },
        avgTimeToConvert: {
          $avg: '$funnel.timeToConvert'
        }
      }
    },
    {
      $addFields: {
        uniqueUsers: { $size: '$userCount' },
        conversionRate: {
          $cond: [
            { $gt: ['$eventCount', 0] },
            { $multiply: [{ $divide: ['$conversions', '$eventCount'] }, 100] },
            0
          ]
        }
      }
    },
    {
      $project: {
        userCount: 0
      }
    },
    { $sort: { stepNumber: 1 } }
  ]);
};

// Static method for cohort analysis
AnalyticsSchema.statics.getCohortAnalysis = function(options = {}) {
  const {
    metric = 'retention',
    period = 'week',
    startDate,
    endDate
  } = options;

  const matchStage = {};
  
  if (startDate || endDate) {
    matchStage['timestamp.occurred'] = {};
    if (startDate) matchStage['timestamp.occurred'].$gte = new Date(startDate);
    if (endDate) matchStage['timestamp.occurred'].$lte = new Date(endDate);
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          cohort: period === 'week' ? '$cohort.signupWeek' : '$cohort.signupMonth',
          period: {
            $dateTrunc: {
              date: '$timestamp.occurred',
              unit: period
            }
          }
        },
        users: { $addToSet: '$context.userId' },
        events: { $sum: 1 },
        value: { $sum: '$properties.value' }
      }
    },
    {
      $addFields: {
        userCount: { $size: '$users' }
      }
    },
    {
      $group: {
        _id: '$_id.cohort',
        periods: {
          $push: {
            period: '$_id.period',
            userCount: '$userCount',
            events: '$events',
            value: '$value'
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method for user behavior analysis
AnalyticsSchema.statics.getUserBehavior = function(userId, options = {}) {
  const {
    startDate,
    endDate,
    eventTypes = []
  } = options;

  const matchStage = {
    'context.userId': mongoose.Types.ObjectId(userId)
  };
  
  if (eventTypes.length > 0) {
    matchStage.eventType = { $in: eventTypes };
  }
  
  if (startDate || endDate) {
    matchStage['timestamp.occurred'] = {};
    if (startDate) matchStage['timestamp.occurred'].$gte = new Date(startDate);
    if (endDate) matchStage['timestamp.occurred'].$lte = new Date(endDate);
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        firstOccurrence: { $min: '$timestamp.occurred' },
        lastOccurrence: { $max: '$timestamp.occurred' },
        totalValue: { $sum: '$properties.value' },
        avgSessionDuration: { $avg: '$properties.duration' }
      }
    },
    {
      $addFields: {
        daysBetween: {
          $divide: [
            { $subtract: ['$lastOccurrence', '$firstOccurrence'] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Static method for A/B test analysis
AnalyticsSchema.statics.getExperimentAnalysis = function(experimentId) {
  return this.aggregate([
    {
      $match: {
        'experiments.experimentId': experimentId
      }
    },
    {
      $unwind: '$experiments'
    },
    {
      $match: {
        'experiments.experimentId': experimentId
      }
    },
    {
      $group: {
        _id: '$experiments.variant',
        userCount: { $addToSet: '$context.userId' },
        eventCount: { $sum: 1 },
        conversions: {
          $sum: { $cond: ['$funnel.isConversion', 1, 0] }
        },
        totalValue: { $sum: '$properties.value' },
        avgValue: { $avg: '$properties.value' }
      }
    },
    {
      $addFields: {
        uniqueUsers: { $size: '$userCount' },
        conversionRate: {
          $cond: [
            { $gt: ['$eventCount', 0] },
            { $multiply: [{ $divide: ['$conversions', '$eventCount'] }, 100] },
            0
          ]
        }
      }
    },
    {
      $project: {
        userCount: 0
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Instance method to track conversion
AnalyticsSchema.methods.markAsConversion = function(value = 0, type = 'purchase') {
  this.funnel.isConversion = true;
  this.funnel.conversionValue = value;
  this.funnel.conversionType = type;
  
  if (this.revenue) {
    this.revenue.amount = value;
  }
  
  return this.save();
};

// Instance method to add experiment
AnalyticsSchema.methods.addExperiment = function(experimentData) {
  this.experiments.push(experimentData);
  return this.save();
};

// Static method to create event
AnalyticsSchema.statics.track = function(eventData) {
  const event = new this(eventData);
  return event.save();
};

// Static method for real-time dashboard data
AnalyticsSchema.statics.getDashboardData = function(timeframe = '24h') {
  const hours = parseInt(timeframe);
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - hours);

  return this.aggregate([
    {
      $match: {
        'timestamp.occurred': { $gte: startDate }
      }
    },
    {
      $facet: {
        totalEvents: [
          { $count: 'count' }
        ],
        uniqueUsers: [
          { $group: { _id: '$context.userId' } },
          { $count: 'count' }
        ],
        topEvents: [
          { $group: { _id: '$eventType', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        errorRate: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              errors: {
                $sum: { $cond: [{ $eq: ['$properties.success', false] }, 1, 0] }
              }
            }
          },
          {
            $addFields: {
              errorRate: {
                $multiply: [{ $divide: ['$errors', '$total'] }, 100]
              }
            }
          }
        ]
      }
    }
  ]);
};

export default mongoose.model('Analytics', AnalyticsSchema);