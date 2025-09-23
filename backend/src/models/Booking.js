import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  // Basic Booking Information
  bookingId: {
    type: String,
    required: [true, 'Booking ID is required'],
    unique: true,
    default: function() {
      return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
  },
  
  // Parties Involved
  renter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Renter is required'] 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Owner is required'] 
  },
  resource: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resource', 
    required: [true, 'Resource is required'] 
  },
  
  // Booking Timeline
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Start date cannot be in the past'
    }
  },
  endDate: { 
    type: Date, 
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  requestedAt: { type: Date, default: Date.now },
  confirmedAt: Date,
  cancelledAt: Date,
  completedAt: Date,
  
  // Booking Status
  status: {
    type: String,
    enum: {
      values: [
        'pending',     // Awaiting owner approval
        'confirmed',   // Owner approved, payment processed
        'active',      // Currently in use
        'completed',   // Successfully finished
        'cancelled',   // Cancelled by either party
        'disputed',    // Under dispute resolution
        'expired'      // Expired without confirmation
      ],
      message: 'Status must be one of the predefined options'
    },
    default: 'pending'
  },
  
  // Pricing and Payment
  pricing: {
    baseAmount: { 
      type: Number, 
      required: [true, 'Base amount is required'], 
      min: [0, 'Base amount cannot be negative'] 
    },
    deposit: { 
      type: Number, 
      default: 0, 
      min: [0, 'Deposit cannot be negative'] 
    },
    serviceFee: { 
      type: Number, 
      default: 0, 
      min: [0, 'Service fee cannot be negative'] 
    },
    deliveryFee: { 
      type: Number, 
      default: 0, 
      min: [0, 'Delivery fee cannot be negative'] 
    },
    taxes: { 
      type: Number, 
      default: 0, 
      min: [0, 'Taxes cannot be negative'] 
    },
    totalAmount: { 
      type: Number, 
      required: [true, 'Total amount is required'], 
      min: [0, 'Total amount cannot be negative'] 
    },
    currency: { type: String, default: 'USD' }
  },
  
  // Payment Information
  payment: {
    stripePaymentIntentId: String,
    stripeChargeId: String,
    paymentMethod: {
      type: String,
      enum: ['card', 'bank_transfer', 'digital_wallet', 'cash'],
      default: 'card'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    paidAt: Date,
    refundAmount: { type: Number, default: 0 },
    refundedAt: Date,
    refundReason: String
  },
  
  // Delivery and Pickup
  delivery: {
    isRequired: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['pickup', 'delivery', 'meetup'],
      default: 'pickup'
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      instructions: String
    },
    scheduledPickupTime: Date,
    actualPickupTime: Date,
    scheduledReturnTime: Date,
    actualReturnTime: Date,
    deliveryInstructions: String,
    trackingInfo: {
      status: {
        type: String,
        enum: ['pending', 'picked_up', 'in_transit', 'delivered', 'returned'],
        default: 'pending'
      },
      trackingNumber: String,
      estimatedDelivery: Date,
      updates: [{
        timestamp: { type: Date, default: Date.now },
        status: String,
        location: String,
        description: String
      }]
    }
  },
  
  // Communication and Messages
  messages: [{
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: [true, 'Message sender is required']
    },
    message: { 
      type: String, 
      required: [true, 'Message content is required'],
      maxLength: [1000, 'Message cannot exceed 1000 characters']
    },
    attachments: [{
      type: String, // URLs to uploaded files
      filename: String,
      mimeType: String,
      size: Number
    }],
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }],
  
  // Condition Reports
  conditionReports: {
    preRental: {
      photos: [String], // URLs to condition photos
      description: String,
      reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reportedAt: Date,
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'damaged']
      },
      issues: [String]
    },
    postRental: {
      photos: [String],
      description: String,
      reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reportedAt: Date,
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'damaged']
      },
      issues: [String],
      damagesClaimed: [{
        description: String,
        estimatedCost: Number,
        photos: [String]
      }]
    }
  },
  
  // Reviews and Ratings
  reviews: {
    renterReview: {
      rating: { 
        type: Number, 
        min: [1, 'Rating must be at least 1'], 
        max: [5, 'Rating cannot exceed 5'] 
      },
      comment: { 
        type: String, 
        maxLength: [1000, 'Review comment cannot exceed 1000 characters'] 
      },
      photos: [String],
      aspects: {
        condition: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 },
        convenience: { type: Number, min: 1, max: 5 },
        value: { type: Number, min: 1, max: 5 }
      },
      submittedAt: Date
    },
    ownerReview: {
      rating: { 
        type: Number, 
        min: [1, 'Rating must be at least 1'], 
        max: [5, 'Rating cannot exceed 5'] 
      },
      comment: { 
        type: String, 
        maxLength: [1000, 'Review comment cannot exceed 1000 characters'] 
      },
      aspects: {
        care: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 },
        punctuality: { type: Number, min: 1, max: 5 },
        following_rules: { type: Number, min: 1, max: 5 }
      },
      submittedAt: Date
    }
  },
  
  // Special Requirements and Instructions
  specialRequirements: {
    instructions: [String],
    restrictions: [String],
    additionalFees: [{
      description: String,
      amount: { type: Number, min: 0 },
      isOptional: { type: Boolean, default: false }
    }]
  },
  
  // Insurance and Protection
  insurance: {
    isCovered: { type: Boolean, default: false },
    provider: String,
    policyNumber: String,
    coverageAmount: { type: Number, min: 0 },
    deductible: { type: Number, min: 0 }
  },
  
  // IoT and Smart Features
  iot: {
    deviceConnected: { type: Boolean, default: false },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'IoTDevice' },
    trackingEnabled: { type: Boolean, default: false },
    lastLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    },
    usageData: [{
      timestamp: { type: Date, default: Date.now },
      metric: String, // e.g., 'runtime', 'location', 'temperature'
      value: mongoose.Schema.Types.Mixed,
      unit: String
    }],
    alerts: [{
      type: {
        type: String,
        enum: ['misuse', 'damage', 'theft', 'maintenance', 'low_battery']
      },
      message: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
      },
      timestamp: { type: Date, default: Date.now },
      resolved: { type: Boolean, default: false }
    }]
  },
  
  // Dispute and Resolution
  dispute: {
    isDisputed: { type: Boolean, default: false },
    reason: {
      type: String,
      enum: ['damage', 'no_show', 'late_return', 'condition_mismatch', 'payment_issue', 'other']
    },
    description: String,
    evidence: [{
      type: String, // photo, video, document
      url: String,
      description: String,
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now }
    }],
    resolution: {
      status: {
        type: String,
        enum: ['pending', 'investigating', 'resolved', 'escalated'],
        default: 'pending'
      },
      mediator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      decision: String,
      compensation: {
        toRenter: { type: Number, default: 0 },
        toOwner: { type: Number, default: 0 }
      },
      resolvedAt: Date
    },
    createdAt: { type: Date, default: Date.now }
  },
  
  // Analytics and Metadata
  analytics: {
    responseTime: Number, // Time to confirm in minutes
    modificationCount: { type: Number, default: 0 },
    viewedByOwner: { type: Boolean, default: false },
    viewedAt: Date,
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    referrer: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
BookingSchema.index({ renter: 1, status: 1, startDate: -1 });
BookingSchema.index({ owner: 1, status: 1, startDate: -1 });
BookingSchema.index({ resource: 1, status: 1, startDate: 1, endDate: 1 });
BookingSchema.index({ bookingId: 1 }, { unique: true });
BookingSchema.index({ startDate: 1, endDate: 1 });
BookingSchema.index({ 'payment.paymentStatus': 1 });

// Virtual for booking duration in hours
BookingSchema.virtual('durationHours').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60));
});

// Virtual for booking duration in days
BookingSchema.virtual('durationDays').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Virtual for checking if booking is active
BookingSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && this.startDate <= now && this.endDate >= now;
});

// Virtual for checking if booking is upcoming
BookingSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return this.status === 'confirmed' && this.startDate > now;
});

// Virtual for checking if booking is overdue
BookingSchema.virtual('isOverdue').get(function() {
  const now = new Date();
  return this.status === 'active' && this.endDate < now;
});

// Pre-save middleware
BookingSchema.pre('save', function(next) {
  // Validate that renter is not the owner
  if (this.renter.toString() === this.owner.toString()) {
    return next(new Error('Renter cannot be the same as the owner'));
  }
  
  // Auto-calculate total amount if not set
  if (!this.pricing.totalAmount) {
    this.pricing.totalAmount = 
      this.pricing.baseAmount + 
      this.pricing.deposit + 
      this.pricing.serviceFee + 
      this.pricing.deliveryFee + 
      this.pricing.taxes;
  }
  
  // Set timestamps based on status changes
  if (this.isModified('status')) {
    const now = new Date();
    switch (this.status) {
      case 'confirmed':
        if (!this.confirmedAt) this.confirmedAt = now;
        break;
      case 'cancelled':
        if (!this.cancelledAt) this.cancelledAt = now;
        break;
      case 'completed':
        if (!this.completedAt) this.completedAt = now;
        break;
    }
  }
  
  next();
});

// Static method to find conflicting bookings
BookingSchema.statics.findConflicts = function(resourceId, startDate, endDate, excludeBookingId = null) {
  const query = {
    resource: resourceId,
    status: { $in: ['confirmed', 'active'] },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ]
  };
  
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  return this.find(query);
};

// Static method for booking analytics
BookingSchema.statics.getAnalytics = function(filters = {}) {
  const matchStage = { ...filters };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.totalAmount' },
        averageBookingValue: { $avg: '$pricing.totalAmount' },
        averageDuration: { 
          $avg: { 
            $divide: [
              { $subtract: ['$endDate', '$startDate'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        },
        statusBreakdown: {
          $push: '$status'
        }
      }
    },
    {
      $addFields: {
        statusCounts: {
          $reduce: {
            input: '$statusBreakdown',
            initialValue: {},
            in: {
              $mergeObjects: [
                '$$value',
                {
                  $arrayToObject: [
                    [{
                      k: '$$this',
                      v: {
                        $add: [
                          { $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] },
                          1
                        ]
                      }
                    }]
                  ]
                }
              ]
            }
          }
        }
      }
    },
    {
      $project: {
        statusBreakdown: 0
      }
    }
  ]);
};

// Instance method to send notification
BookingSchema.methods.sendNotification = async function(type, recipient, data = {}) {
  // This would integrate with notification service
  const notificationData = {
    type,
    recipient,
    booking: this._id,
    message: this.generateNotificationMessage(type),
    data
  };
  
  // Placeholder for notification service call
  console.log('Sending notification:', notificationData);
};

// Instance method to generate notification messages
BookingSchema.methods.generateNotificationMessage = function(type) {
  const messages = {
    booking_requested: `New booking request for your ${this.resource.title}`,
    booking_confirmed: `Your booking has been confirmed`,
    booking_cancelled: `Booking has been cancelled`,
    payment_received: `Payment received for booking`,
    booking_starting_soon: `Your booking starts in 1 hour`,
    booking_overdue: `Booking return is overdue`,
    review_request: `Please leave a review for your recent booking`
  };
  
  return messages[type] || 'Booking update';
};

// Instance method to calculate refund amount
BookingSchema.methods.calculateRefund = function(reason = 'cancellation') {
  const now = new Date();
  const hoursUntilStart = (this.startDate - now) / (1000 * 60 * 60);
  
  let refundPercentage = 0;
  
  if (reason === 'owner_cancellation') {
    refundPercentage = 1.0; // Full refund
  } else if (reason === 'renter_cancellation') {
    if (hoursUntilStart >= 48) {
      refundPercentage = 0.9; // 90% refund
    } else if (hoursUntilStart >= 24) {
      refundPercentage = 0.5; // 50% refund
    } else {
      refundPercentage = 0; // No refund
    }
  }
  
  const refundAmount = this.pricing.totalAmount * refundPercentage;
  
  return {
    refundAmount,
    refundPercentage,
    serviceFeeRefund: refundPercentage > 0 ? this.pricing.serviceFee : 0
  };
};

export default mongoose.model('Booking', BookingSchema);