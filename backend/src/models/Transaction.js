import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  // Transaction Identity
  transactionId: {
    type: String,
    required: [true, 'Transaction ID is required'],
    unique: true,
    default: function() {
      return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
  },
  
  // Transaction Type and Category
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: [
        'booking_payment', 'booking_refund', 'deposit_hold', 'deposit_release',
        'service_fee', 'delivery_fee', 'late_fee', 'damage_fee', 
        'subscription', 'payout', 'tip', 'community_fee', 'withdrawal'
      ],
      message: 'Transaction type must be one of the predefined options'
    }
  },
  category: {
    type: String,
    enum: {
      values: ['rental', 'service', 'refund', 'fee', 'payout', 'subscription'],
      message: 'Category must be one of the predefined options'
    },
    required: [true, 'Transaction category is required']
  },
  
  // Parties Involved
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payer is required']
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true // For system fees, there might not be a specific payee
  },
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Platform/system user for service fees
    sparse: true
  },
  
  // Related Entities
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    sparse: true
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    sparse: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    sparse: true
  },
  parentTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    sparse: true // For refunds, splits, etc.
  },
  
  // Financial Details
  amount: {
    gross: {
      type: Number,
      required: [true, 'Gross amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    net: {
      type: Number,
      required: [true, 'Net amount is required']
    },
    fees: {
      platform: { type: Number, default: 0 },
      payment: { type: Number, default: 0 },
      processing: { type: Number, default: 0 },
      stripe: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    }
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD',
    uppercase: true
  },
  
  // Payment Method and Gateway
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'bank_transfer', 'digital_wallet', 'crypto', 'cash', 'store_credit'],
      required: [true, 'Payment method type is required']
    },
    provider: {
      type: String,
      enum: ['stripe', 'paypal', 'venmo', 'bank', 'cash', 'internal'],
      required: [true, 'Payment provider is required']
    },
    details: {
      cardLast4: String,
      cardBrand: String,
      bankName: String,
      accountLast4: String,
      walletType: String // apple_pay, google_pay, etc.
    }
  },
  
  // Transaction Status and Processing
  status: {
    type: String,
    enum: {
      values: [
        'pending', 'processing', 'completed', 'failed', 
        'cancelled', 'refunded', 'partially_refunded', 'disputed'
      ],
      message: 'Status must be one of the predefined options'
    },
    default: 'pending'
  },
  processingStatus: {
    type: String,
    enum: ['initiated', 'authorized', 'captured', 'settled', 'cleared'],
    sparse: true
  },
  
  // Gateway Integration
  gateway: {
    provider: String, // stripe, paypal, etc.
    transactionId: String, // Gateway's transaction ID
    paymentIntentId: String, // Stripe Payment Intent ID
    chargeId: String, // Stripe Charge ID
    transferId: String, // For payouts
    metadata: mongoose.Schema.Types.Mixed,
    webhookEvents: [{
      eventType: String,
      eventId: String,
      timestamp: { type: Date, default: Date.now },
      data: mongoose.Schema.Types.Mixed
    }]
  },
  
  // Timing Information
  timestamps: {
    initiatedAt: { type: Date, default: Date.now },
    authorizedAt: Date,
    capturedAt: Date,
    settledAt: Date,
    failedAt: Date,
    cancelledAt: Date,
    refundedAt: Date
  },
  
  // Refund Information
  refund: {
    reason: {
      type: String,
      enum: [
        'customer_request', 'duplicate', 'fraudulent', 
        'not_received', 'damaged', 'cancelled_booking', 'system_error'
      ]
    },
    amount: { type: Number, min: 0 },
    refundId: String, // Gateway refund ID
    processedAt: Date,
    notes: String
  },
  
  // Dispute Information
  dispute: {
    isDisputed: { type: Boolean, default: false },
    disputeId: String, // Gateway dispute ID
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'under_review', 'won', 'lost', 'accepted']
    },
    amount: Number,
    evidence: [{
      type: String,
      url: String,
      description: String,
      submittedAt: { type: Date, default: Date.now }
    }],
    timeline: [{
      event: String,
      timestamp: { type: Date, default: Date.now },
      description: String
    }]
  },
  
  // Authorization and Holds
  authorization: {
    isAuthorized: { type: Boolean, default: false },
    authorizationId: String,
    authorizedAmount: Number,
    expiresAt: Date,
    capturedAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 }
  },
  
  // Split Payments (for multiple parties)
  splits: [{
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Split recipient is required']
    },
    amount: {
      type: Number,
      required: [true, 'Split amount is required'],
      min: [0, 'Split amount cannot be negative']
    },
    percentage: Number,
    type: {
      type: String,
      enum: ['fixed', 'percentage'],
      default: 'fixed'
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    },
    transferId: String,
    processedAt: Date
  }],
  
  // Tax Information
  tax: {
    applicable: { type: Boolean, default: false },
    rate: { type: Number, default: 0 }, // percentage
    amount: { type: Number, default: 0 },
    taxId: String,
    jurisdiction: String,
    type: {
      type: String,
      enum: ['sales', 'vat', 'gst', 'service']
    }
  },
  
  // Description and Metadata
  description: {
    type: String,
    required: [true, 'Transaction description is required'],
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  internalNotes: String,
  customerNotes: String,
  
  // Reconciliation and Accounting
  reconciliation: {
    isReconciled: { type: Boolean, default: false },
    reconciledAt: Date,
    reconciledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    discrepancy: Number,
    notes: String
  },
  accountingPeriod: {
    month: Number,
    year: Number,
    quarter: Number
  },
  
  // Risk and Security
  risk: {
    score: { type: Number, min: 0, max: 100 },
    level: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    factors: [String],
    ipAddress: String,
    userAgent: String,
    deviceFingerprint: String,
    location: {
      country: String,
      region: String,
      city: String
    }
  },
  
  // Analytics and Reporting
  analytics: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api', 'admin'],
      default: 'web'
    },
    channel: String, // marketing channel
    campaign: String,
    referrer: String,
    conversionTime: Number, // Time from first interaction to payment (seconds)
    retryCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance and queries
TransactionSchema.index({ transactionId: 1 }, { unique: true });
TransactionSchema.index({ payer: 1, status: 1, createdAt: -1 });
TransactionSchema.index({ payee: 1, status: 1, createdAt: -1 });
TransactionSchema.index({ booking: 1 }, { sparse: true });
TransactionSchema.index({ type: 1, status: 1, createdAt: -1 });
TransactionSchema.index({ 'gateway.paymentIntentId': 1 }, { sparse: true });
TransactionSchema.index({ 'timestamps.settledAt': -1 });

// Virtual for transaction age
TransactionSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
});

// Virtual for fee percentage
TransactionSchema.virtual('feePercentage').get(function() {
  if (this.amount.gross === 0) return 0;
  return ((this.amount.fees.total / this.amount.gross) * 100);
});

// Virtual for net amount after all fees
TransactionSchema.virtual('finalAmount').get(function() {
  return this.amount.gross - this.amount.fees.total;
});

// Pre-save middleware
TransactionSchema.pre('save', function(next) {
  // Calculate total fees
  const fees = this.amount.fees;
  fees.total = fees.platform + fees.payment + fees.processing + fees.stripe;
  
  // Calculate net amount
  this.amount.net = this.amount.gross - fees.total;
  
  // Set accounting period
  const date = new Date();
  this.accountingPeriod = {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    quarter: Math.ceil((date.getMonth() + 1) / 3)
  };
  
  // Update authorization remaining amount
  if (this.authorization.isAuthorized) {
    this.authorization.remainingAmount = 
      this.authorization.authorizedAmount - this.authorization.capturedAmount;
  }
  
  next();
});

// Static method for transaction analytics
TransactionSchema.statics.getAnalytics = function(filters = {}) {
  const {
    startDate,
    endDate,
    type,
    status = 'completed',
    groupBy = 'day'
  } = filters;

  const matchStage = { status };
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }
  
  if (type) matchStage.type = type;

  const groupFormat = {
    day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    week: { $dateToString: { format: "%Y-%U", date: "$createdAt" } },
    month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
  };

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: groupFormat[groupBy],
        totalTransactions: { $sum: 1 },
        totalVolume: { $sum: "$amount.gross" },
        totalFees: { $sum: "$amount.fees.total" },
        averageAmount: { $avg: "$amount.gross" },
        types: { $addToSet: "$type" }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method for revenue analytics
TransactionSchema.statics.getRevenueAnalytics = function(timeframe = '30d') {
  const days = parseInt(timeframe);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount.gross" },
        totalFees: { $sum: "$amount.fees.total" },
        netRevenue: { $sum: "$amount.net" },
        transactionCount: { $sum: 1 },
        averageTransactionValue: { $avg: "$amount.gross" },
        revenueByType: {
          $push: {
            type: "$type",
            amount: "$amount.gross"
          }
        }
      }
    },
    {
      $addFields: {
        feePercentage: {
          $multiply: [
            { $divide: ["$totalFees", "$totalRevenue"] },
            100
          ]
        }
      }
    }
  ]);
};

// Instance method to process refund
TransactionSchema.methods.processRefund = async function(amount, reason, notes = '') {
  if (this.status !== 'completed') {
    throw new Error('Can only refund completed transactions');
  }
  
  if (amount > this.amount.net) {
    throw new Error('Refund amount cannot exceed transaction amount');
  }
  
  // Create refund transaction
  const Transaction = mongoose.model('Transaction');
  const refundTransaction = new Transaction({
    type: 'booking_refund',
    category: 'refund',
    payer: this.payee, // Original payee becomes payer for refund
    payee: this.payer, // Original payer becomes payee for refund
    booking: this.booking,
    resource: this.resource,
    parentTransaction: this._id,
    amount: {
      gross: amount,
      net: amount,
      fees: { total: 0 }
    },
    currency: this.currency,
    paymentMethod: this.paymentMethod,
    status: 'processing',
    description: `Refund for transaction ${this.transactionId}`,
    refund: {
      reason,
      amount,
      notes
    }
  });
  
  await refundTransaction.save();
  
  // Update original transaction
  this.refund = {
    reason,
    amount,
    processedAt: new Date(),
    notes
  };
  
  if (amount === this.amount.net) {
    this.status = 'refunded';
  } else {
    this.status = 'partially_refunded';
  }
  
  await this.save();
  
  return refundTransaction;
};

// Instance method to authorize transaction
TransactionSchema.methods.authorize = async function() {
  this.authorization.isAuthorized = true;
  this.authorization.authorizedAmount = this.amount.gross;
  this.authorization.remainingAmount = this.amount.gross;
  this.authorization.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  this.status = 'authorized';
  this.timestamps.authorizedAt = new Date();
  
  return this.save();
};

// Instance method to capture authorized amount
TransactionSchema.methods.capture = async function(amount = null) {
  if (!this.authorization.isAuthorized) {
    throw new Error('Transaction is not authorized');
  }
  
  const captureAmount = amount || this.authorization.remainingAmount;
  
  if (captureAmount > this.authorization.remainingAmount) {
    throw new Error('Capture amount exceeds authorized amount');
  }
  
  this.authorization.capturedAmount += captureAmount;
  this.authorization.remainingAmount -= captureAmount;
  
  if (this.authorization.remainingAmount === 0) {
    this.status = 'completed';
  }
  
  this.timestamps.capturedAt = new Date();
  
  return this.save();
};

// Instance method to calculate platform fee
TransactionSchema.methods.calculatePlatformFee = function(feePercentage = 5) {
  const platformFee = (this.amount.gross * feePercentage) / 100;
  this.amount.fees.platform = Math.round(platformFee * 100) / 100; // Round to 2 decimal places
  return this.amount.fees.platform;
};

// Instance method to add split payment
TransactionSchema.methods.addSplit = function(recipientId, amount, type = 'fixed') {
  let splitAmount;
  
  if (type === 'percentage') {
    splitAmount = (this.amount.gross * amount) / 100;
  } else {
    splitAmount = amount;
  }
  
  this.splits.push({
    recipient: recipientId,
    amount: splitAmount,
    percentage: type === 'percentage' ? amount : null,
    type
  });
  
  return this.save();
};

// Instance method to mark as disputed
TransactionSchema.methods.markAsDisputed = function(disputeData) {
  this.status = 'disputed';
  this.dispute = {
    isDisputed: true,
    ...disputeData,
    timeline: [{
      event: 'dispute_created',
      timestamp: new Date(),
      description: 'Dispute initiated'
    }]
  };
  
  return this.save();
};

// Instance method to get transaction summary
TransactionSchema.methods.getSummary = function() {
  return {
    id: this.transactionId,
    type: this.type,
    amount: this.amount.gross,
    currency: this.currency,
    status: this.status,
    date: this.createdAt,
    description: this.description,
    fees: this.amount.fees.total,
    net: this.amount.net
  };
};

export default mongoose.model('Transaction', TransactionSchema);