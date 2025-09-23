import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  // Review Identity
  reviewId: {
    type: String,
    unique: true,
    default: function() {
      return 'REV' + Date.now() + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
  },
  
  // Review Type and Target
  reviewType: {
    type: String,
    enum: {
      values: ['resource', 'user_as_renter', 'user_as_owner', 'community', 'booking_experience'],
      message: 'Review type must be one of the predefined options'
    },
    required: [true, 'Review type is required']
  },
  
  // Parties Involved
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer is required']
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'revieweeModel',
    required: [true, 'Reviewee is required']
  },
  revieweeModel: {
    type: String,
    enum: ['User', 'Resource', 'Community'],
    required: [true, 'Reviewee model is required']
  },
  
  // Related Entities
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    sparse: true // Not all reviews are booking-related
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
  
  // Core Review Content
  rating: {
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    // Aspect-specific ratings
    aspects: {
      // For resource reviews
      condition: { type: Number, min: 1, max: 5 },
      description_accuracy: { type: Number, min: 1, max: 5 },
      value_for_money: { type: Number, min: 1, max: 5 },
      ease_of_use: { type: Number, min: 1, max: 5 },
      
      // For user reviews
      communication: { type: Number, min: 1, max: 5 },
      reliability: { type: Number, min: 1, max: 5 },
      punctuality: { type: Number, min: 1, max: 5 },
      care_of_items: { type: Number, min: 1, max: 5 },
      following_rules: { type: Number, min: 1, max: 5 },
      
      // For community reviews
      organization: { type: Number, min: 1, max: 5 },
      activity_level: { type: Number, min: 1, max: 5 },
      helpful_members: { type: Number, min: 1, max: 5 },
      resource_quality: { type: Number, min: 1, max: 5 }
    }
  },
  
  // Review Text Content
  content: {
    title: {
      type: String,
      maxLength: [100, 'Review title cannot exceed 100 characters'],
      trim: true
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxLength: [2000, 'Review comment cannot exceed 2000 characters'],
      trim: true
    },
    pros: [String], // List of positive aspects
    cons: [String], // List of negative aspects
    recommendations: String // Additional recommendations
  },
  
  // Media Attachments
  media: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: [true, 'Media type is required']
    },
    url: {
      type: String,
      required: [true, 'Media URL is required']
    },
    publicId: String, // Cloudinary public ID
    caption: String,
    thumbnail: String, // For videos
    metadata: {
      width: Number,
      height: Number,
      size: Number, // bytes
      format: String
    }
  }],
  
  // Review Status and Moderation
  status: {
    type: String,
    enum: {
      values: ['draft', 'published', 'pending_moderation', 'hidden', 'deleted'],
      message: 'Status must be one of the predefined options'
    },
    default: 'published'
  },
  isVerified: { type: Boolean, default: false }, // Verified booking-based review
  
  // Moderation
  moderation: {
    isReported: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
    reports: [{
      reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: {
        type: String,
        enum: ['fake', 'inappropriate', 'spam', 'off_topic', 'personal_attack', 'other']
      },
      description: String,
      reportedAt: { type: Date, default: Date.now }
    }],
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,
    moderationNotes: String,
    autoModeration: {
      flagged: { type: Boolean, default: false },
      confidence: Number, // 0-1
      reasons: [String],
      sentiment: {
        type: String,
        enum: ['positive', 'neutral', 'negative']
      },
      toxicity: Number // 0-1
    }
  },
  
  // Interaction and Engagement
  interactions: {
    helpfulVotes: { type: Number, default: 0 },
    unhelpfulVotes: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 },
    helpfulPercentage: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  
  // Voting Details
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['helpful', 'unhelpful']
    },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Responses and Follow-up
  responses: [{
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    responderRole: {
      type: String,
      enum: ['owner', 'admin', 'moderator', 'customer_service']
    },
    content: {
      type: String,
      maxLength: [1000, 'Response cannot exceed 1000 characters']
    },
    timestamp: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: true }
  }],
  
  // Timeline and History
  timeline: {
    submittedAt: { type: Date, default: Date.now },
    publishedAt: Date,
    lastModifiedAt: Date,
    moderatedAt: Date,
    deletedAt: Date
  },
  
  // Edit History
  editHistory: [{
    previousContent: {
      rating: Number,
      comment: String,
      title: String
    },
    editedAt: { type: Date, default: Date.now },
    reason: String,
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Analytics and Metadata
  analytics: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'email_prompt', 'sms_prompt', 'in_app'],
      default: 'web'
    },
    timeToSubmit: Number, // Days from booking completion to review
    deviceType: String,
    location: {
      country: String,
      region: String,
      city: String
    },
    referrer: String,
    campaignId: String
  },
  
  // Verification and Trust
  verification: {
    isBookingVerified: { type: Boolean, default: false },
    bookingCompletedAt: Date,
    verificationMethod: {
      type: String,
      enum: ['booking', 'receipt', 'photo', 'manual']
    },
    trustScore: { type: Number, min: 0, max: 100, default: 50 },
    factors: [String] // Factors affecting trust score
  },
  
  // Sentiment Analysis
  sentiment: {
    overall: {
      type: String,
      enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative']
    },
    confidence: Number, // 0-1
    keywords: [String],
    emotions: [{
      emotion: {
        type: String,
        enum: ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation']
      },
      confidence: Number
    }]
  },
  
  // Impact Tracking
  impact: {
    influencedBookings: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    revenue_influenced: { type: Number, default: 0 },
    trust_score_change: Number // Change in reviewee's trust score
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to prevent duplicate reviews
ReviewSchema.index({ 
  reviewer: 1, 
  reviewee: 1, 
  booking: 1 
}, { 
  unique: true, 
  sparse: true,
  partialFilterExpression: { booking: { $exists: true } }
});

// Additional indexes for performance
ReviewSchema.index({ reviewee: 1, revieweeModel: 1, status: 1 });
ReviewSchema.index({ reviewer: 1, status: 1, createdAt: -1 });
ReviewSchema.index({ 'rating.overall': -1, status: 1 });
ReviewSchema.index({ reviewId: 1 }, { unique: true });
ReviewSchema.index({ booking: 1 }, { sparse: true });

// Virtual for helpful percentage
ReviewSchema.virtual('helpfulPercentage').get(function() {
  if (this.interactions.totalVotes === 0) return 0;
  return Math.round((this.interactions.helpfulVotes / this.interactions.totalVotes) * 100);
});

// Virtual for review age
ReviewSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for average aspect rating
ReviewSchema.virtual('averageAspectRating').get(function() {
  const aspects = this.rating.aspects;
  const ratings = Object.values(aspects).filter(rating => rating != null);
  if (ratings.length === 0) return this.rating.overall;
  
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
});

// Pre-save middleware
ReviewSchema.pre('save', function(next) {
  // Update interaction calculations
  this.interactions.totalVotes = this.interactions.helpfulVotes + this.interactions.unhelpfulVotes;
  
  if (this.interactions.totalVotes > 0) {
    this.interactions.helpfulPercentage = Math.round(
      (this.interactions.helpfulVotes / this.interactions.totalVotes) * 100
    );
  }
  
  // Set published date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.timeline.publishedAt) {
    this.timeline.publishedAt = new Date();
  }
  
  // Update last modified date
  if (this.isModified(['content.comment', 'content.title', 'rating.overall'])) {
    this.timeline.lastModifiedAt = new Date();
  }
  
  // Calculate verification trust score
  this.calculateTrustScore();
  
  next();
});

// Static method to get average rating for entity
ReviewSchema.statics.getAverageRating = function(entityId, entityModel = 'Resource') {
  return this.aggregate([
    {
      $match: {
        reviewee: mongoose.Types.ObjectId(entityId),
        revieweeModel: entityModel,
        status: 'published'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating.overall' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating.overall'
        },
        aspectAverages: {
          $addToSet: '$rating.aspects'
        }
      }
    },
    {
      $addFields: {
        ratingBreakdown: {
          $reduce: {
            input: '$ratingDistribution',
            initialValue: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            in: {
              $mergeObjects: [
                '$$value',
                {
                  $arrayToObject: [
                    [{
                      k: { $toString: '$$this' },
                      v: {
                        $add: [
                          { $ifNull: [{ $getField: { field: { $toString: '$$this' }, input: '$$value' } }, 0] },
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
    }
  ]);
};

// Static method to get reviews with filters
ReviewSchema.statics.getReviews = function(filters = {}) {
  const {
    entityId,
    entityModel = 'Resource',
    rating,
    sortBy = 'newest',
    page = 1,
    limit = 20,
    verified = null,
    withMedia = null
  } = filters;

  const matchStage = {
    status: 'published'
  };

  if (entityId) {
    matchStage.reviewee = mongoose.Types.ObjectId(entityId);
    matchStage.revieweeModel = entityModel;
  }

  if (rating) {
    matchStage['rating.overall'] = Number(rating);
  }

  if (verified !== null) {
    matchStage['verification.isBookingVerified'] = verified;
  }

  if (withMedia !== null) {
    if (withMedia) {
      matchStage.media = { $exists: true, $not: { $size: 0 } };
    } else {
      matchStage.$or = [
        { media: { $exists: false } },
        { media: { $size: 0 } }
      ];
    }
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    highest_rated: { 'rating.overall': -1, createdAt: -1 },
    lowest_rated: { 'rating.overall': 1, createdAt: -1 },
    most_helpful: { 'interactions.helpfulVotes': -1, createdAt: -1 }
  };

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'users',
        localField: 'reviewer',
        foreignField: '_id',
        as: 'reviewerInfo',
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              avatar: 1,
              trustScore: 1,
              totalReviews: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        reviewer: { $arrayElemAt: ['$reviewerInfo', 0] }
      }
    },
    {
      $project: {
        reviewerInfo: 0
      }
    },
    { $sort: sortOptions[sortBy] || sortOptions.newest },
    { $skip: (page - 1) * limit },
    { $limit: Number(limit) }
  ];

  return this.aggregate(pipeline);
};

// Instance method to vote on review
ReviewSchema.methods.vote = function(userId, voteType) {
  // Remove existing vote from this user
  this.votes = this.votes.filter(vote => vote.user.toString() !== userId.toString());
  
  // Add new vote
  this.votes.push({
    user: userId,
    type: voteType,
    timestamp: new Date()
  });
  
  // Update vote counts
  this.interactions.helpfulVotes = this.votes.filter(v => v.type === 'helpful').length;
  this.interactions.unhelpfulVotes = this.votes.filter(v => v.type === 'unhelpful').length;
  
  return this.save();
};

// Instance method to add response
ReviewSchema.methods.addResponse = function(responderData) {
  this.responses.push({
    ...responderData,
    timestamp: new Date()
  });
  
  return this.save();
};

// Instance method to report review
ReviewSchema.methods.reportReview = function(reporterId, reason, description = '') {
  this.moderation.isReported = true;
  this.moderation.reportCount += 1;
  
  this.moderation.reports.push({
    reporter: reporterId,
    reason,
    description,
    reportedAt: new Date()
  });
  
  return this.save();
};

// Instance method to calculate trust score
ReviewSchema.methods.calculateTrustScore = function() {
  let score = 50; // Base score
  
  // Booking verification bonus
  if (this.verification.isBookingVerified) {
    score += 30;
  }
  
  // Account age and activity bonus (would need reviewer data)
  // This would be calculated based on reviewer's account age and activity
  
  // Helpful votes bonus
  if (this.interactions.totalVotes > 0) {
    const helpfulRatio = this.interactions.helpfulVotes / this.interactions.totalVotes;
    score += helpfulRatio * 10;
  }
  
  // Review length and detail bonus
  if (this.content.comment.length > 100) {
    score += 5;
  }
  
  if (this.media.length > 0) {
    score += 10;
  }
  
  // Report penalty
  score -= this.moderation.reportCount * 5;
  
  this.verification.trustScore = Math.max(0, Math.min(100, Math.round(score)));
};

// Instance method to moderate review
ReviewSchema.methods.moderate = function(moderatorId, action, notes = '') {
  this.moderation.moderatedBy = moderatorId;
  this.moderation.moderatedAt = new Date();
  this.moderation.moderationNotes = notes;
  
  switch (action) {
    case 'approve':
      this.status = 'published';
      break;
    case 'hide':
      this.status = 'hidden';
      break;
    case 'delete':
      this.status = 'deleted';
      this.timeline.deletedAt = new Date();
      break;
  }
  
  return this.save();
};

// Instance method to get review summary
ReviewSchema.methods.getSummary = function() {
  return {
    id: this.reviewId,
    rating: this.rating.overall,
    title: this.content.title,
    comment: this.content.comment.substring(0, 200) + (this.content.comment.length > 200 ? '...' : ''),
    reviewer: this.reviewer,
    date: this.createdAt,
    helpful: this.interactions.helpfulVotes,
    verified: this.verification.isBookingVerified,
    hasMedia: this.media.length > 0
  };
};

export default mongoose.model('Review', ReviewSchema);