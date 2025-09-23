import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema({
  // Core Relationship
  community: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Community', 
    required: [true, 'Community is required'] 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User is required'] 
  },
  
  // Membership Status
  status: {
    type: String,
    enum: {
      values: ['pending', 'active', 'suspended', 'removed', 'banned'],
      message: 'Status must be one of the predefined options'
    },
    default: 'pending'
  },
  
  // Role and Permissions
  role: {
    type: String,
    enum: {
      values: ['member', 'moderator', 'admin', 'creator'],
      message: 'Role must be one of the predefined options'
    },
    default: 'member'
  },
  customPermissions: {
    canPost: { type: Boolean, default: true },
    canComment: { type: Boolean, default: true },
    canShareResources: { type: Boolean, default: true },
    canBookResources: { type: Boolean, default: true },
    canCreateEvents: { type: Boolean, default: false },
    canInviteMembers: { type: Boolean, default: false }
  },
  
  // Membership Timeline
  requestedAt: { type: Date, default: Date.now },
  joinedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  lastActiveAt: Date,
  
  // Suspension/Removal Details
  suspendedAt: Date,
  suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  suspensionReason: String,
  suspensionEndDate: Date,
  removedAt: Date,
  removedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  removalReason: String,
  
  // Invitation Details (if invited)
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  invitationCode: String,
  invitationToken: String,
  invitationExpiresAt: Date,
  
  // Member Preferences
  preferences: {
    emailNotifications: {
      newPosts: { type: Boolean, default: true },
      newResources: { type: Boolean, default: true },
      bookingUpdates: { type: Boolean, default: true },
      events: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
      directMessages: { type: Boolean, default: true }
    },
    pushNotifications: {
      newPosts: { type: Boolean, default: false },
      newResources: { type: Boolean, default: true },
      bookingUpdates: { type: Boolean, default: true },
      events: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
      directMessages: { type: Boolean, default: true }
    },
    visibility: {
      showOnline: { type: Boolean, default: true },
      showActivity: { type: Boolean, default: true },
      showResources: { type: Boolean, default: true }
    }
  },
  
  // Activity and Engagement
  activity: {
    postsCreated: { type: Number, default: 0 },
    commentsCreated: { type: Number, default: 0 },
    resourcesShared: { type: Number, default: 0 },
    bookingsMade: { type: Number, default: 0 },
    bookingsReceived: { type: Number, default: 0 },
    eventsAttended: { type: Number, default: 0 },
    eventsCreated: { type: Number, default: 0 },
    helpfulVotes: { type: Number, default: 0 },
    reputationScore: { type: Number, default: 0 }
  },
  
  // Points and Rewards (if community has point system)
  points: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }, // Points not yet spent
    earned: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    history: [{
      action: String,
      points: Number,
      reason: String,
      timestamp: { type: Date, default: Date.now },
      relatedId: mongoose.Schema.Types.ObjectId // ID of related post, booking, etc.
    }]
  },
  
  // Badges and Achievements
  badges: [{
    badgeId: String,
    name: String,
    description: String,
    iconUrl: String,
    earnedAt: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ['participation', 'contribution', 'milestone', 'special']
    }
  }],
  
  // Trust and Reputation
  trust: {
    score: { type: Number, default: 50, min: 0, max: 100 },
    level: {
      type: String,
      enum: ['new', 'trusted', 'verified', 'expert'],
      default: 'new'
    },
    reviews: [{
      reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      category: {
        type: String,
        enum: ['communication', 'reliability', 'resource_quality', 'general']
      },
      createdAt: { type: Date, default: Date.now }
    }],
    violations: [{
      type: {
        type: String,
        enum: ['spam', 'inappropriate_content', 'fake_listing', 'no_show', 'damage', 'harassment']
      },
      description: String,
      reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      severity: {
        type: String,
        enum: ['minor', 'moderate', 'major', 'severe']
      },
      resolved: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  
  // Communication Preferences
  communication: {
    preferredLanguage: { type: String, default: 'en' },
    timezone: String,
    allowDirectMessages: { type: Boolean, default: true },
    allowMentions: { type: Boolean, default: true },
    muteNotifications: { type: Boolean, default: false },
    mutedUntil: Date
  },
  
  // Analytics
  analytics: {
    loginFrequency: { type: Number, default: 0 }, // Days per month
    averageSessionDuration: { type: Number, default: 0 }, // Minutes
    lastLoginAt: Date,
    totalTimeSpent: { type: Number, default: 0 }, // Minutes
    favoriteCategories: [String],
    peakActivityHours: [Number] // Hours 0-23
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound unique index to prevent duplicate memberships
MembershipSchema.index({ community: 1, user: 1 }, { unique: true });

// Additional indexes for performance
MembershipSchema.index({ community: 1, status: 1, role: 1 });
MembershipSchema.index({ user: 1, status: 1 });
MembershipSchema.index({ status: 1, joinedAt: -1 });
MembershipSchema.index({ 'trust.score': -1 });

// Virtual for membership duration
MembershipSchema.virtual('membershipDuration').get(function() {
  if (!this.joinedAt) return 0;
  return Math.floor((new Date() - this.joinedAt) / (1000 * 60 * 60 * 24)); // Days
});

// Virtual for checking if member is active
MembershipSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

// Virtual for checking if member is suspended
MembershipSchema.virtual('isSuspended').get(function() {
  if (this.status !== 'suspended') return false;
  if (!this.suspensionEndDate) return true;
  return new Date() < this.suspensionEndDate;
});

// Virtual for available badges count
MembershipSchema.virtual('badgeCount').get(function() {
  return this.badges.length;
});

// Pre-save middleware
MembershipSchema.pre('save', function(next) {
  // Set joinedAt when status changes to active
  if (this.isModified('status') && this.status === 'active' && !this.joinedAt) {
    this.joinedAt = new Date();
  }
  
  // Update trust level based on score
  if (this.isModified('trust.score')) {
    if (this.trust.score >= 90) {
      this.trust.level = 'expert';
    } else if (this.trust.score >= 70) {
      this.trust.level = 'verified';
    } else if (this.trust.score >= 50) {
      this.trust.level = 'trusted';
    } else {
      this.trust.level = 'new';
    }
  }
  
  // Calculate reputation score
  this.activity.reputationScore = this.calculateReputationScore();
  
  next();
});

// Static method to get community members with filters
MembershipSchema.statics.getCommunityMembers = function(communityId, filters = {}) {
  const {
    status = 'active',
    role,
    search,
    sortBy = 'joinedAt',
    page = 1,
    limit = 20
  } = filters;

  const pipeline = [
    { $match: { community: mongoose.Types.ObjectId(communityId), status } }
  ];

  // Role filtering
  if (role) {
    pipeline.push({ $match: { role } });
  }

  // Lookup user information
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'userInfo',
      pipeline: [
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
            avatar: 1,
            trustScore: 1,
            isVerified: 1
          }
        }
      ]
    }
  });

  // Search filtering
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { 'userInfo.firstName': { $regex: search, $options: 'i' } },
          { 'userInfo.lastName': { $regex: search, $options: 'i' } },
          { 'userInfo.email': { $regex: search, $options: 'i' } }
        ]
      }
    });
  }

  // Add user info to root
  pipeline.push({
    $addFields: {
      user: { $arrayElemAt: ['$userInfo', 0] }
    }
  });

  // Remove userInfo field
  pipeline.push({
    $project: { userInfo: 0 }
  });

  // Sorting
  const sortOptions = {
    joinedAt: { joinedAt: -1 },
    name: { 'user.firstName': 1, 'user.lastName': 1 },
    activity: { lastActiveAt: -1 },
    reputation: { 'activity.reputationScore': -1 },
    trust: { 'trust.score': -1 }
  };

  pipeline.push({ $sort: sortOptions[sortBy] || sortOptions.joinedAt });

  // Pagination
  const skip = (page - 1) * limit;
  pipeline.push({ $skip: skip }, { $limit: Number(limit) });

  return this.aggregate(pipeline);
};

// Static method to get user's communities
MembershipSchema.statics.getUserCommunities = function(userId, status = 'active') {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), status } },
    {
      $lookup: {
        from: 'communities',
        localField: 'community',
        foreignField: '_id',
        as: 'communityInfo'
      }
    },
    {
      $addFields: {
        community: { $arrayElemAt: ['$communityInfo', 0] }
      }
    },
    {
      $project: { communityInfo: 0 }
    },
    { $sort: { joinedAt: -1 } }
  ]);
};

// Instance method to calculate reputation score
MembershipSchema.methods.calculateReputationScore = function() {
  const weights = {
    postsCreated: 2,
    commentsCreated: 1,
    resourcesShared: 5,
    bookingsMade: 3,
    bookingsReceived: 4,
    eventsAttended: 2,
    eventsCreated: 5,
    helpfulVotes: 3
  };

  let score = 0;
  Object.keys(weights).forEach(key => {
    score += (this.activity[key] || 0) * weights[key];
  });

  // Bonus for trust score
  score += (this.trust.score - 50) * 2;

  // Penalty for violations
  const violationPenalty = this.trust.violations.reduce((penalty, violation) => {
    const severityMultiplier = {
      minor: 1,
      moderate: 3,
      major: 10,
      severe: 25
    };
    return penalty + (severityMultiplier[violation.severity] || 1);
  }, 0);

  score = Math.max(0, score - violationPenalty);

  return Math.round(score);
};

// Instance method to add points
MembershipSchema.methods.addPoints = function(points, action, reason, relatedId = null) {
  this.points.total += points;
  this.points.available += points;
  this.points.earned += points;
  
  this.points.history.push({
    action,
    points,
    reason,
    relatedId,
    timestamp: new Date()
  });

  return this.save();
};

// Instance method to spend points
MembershipSchema.methods.spendPoints = function(points, reason, relatedId = null) {
  if (this.points.available < points) {
    throw new Error('Insufficient points');
  }

  this.points.available -= points;
  this.points.spent += points;
  
  this.points.history.push({
    action: 'spend',
    points: -points,
    reason,
    relatedId,
    timestamp: new Date()
  });

  return this.save();
};

// Instance method to add badge
MembershipSchema.methods.addBadge = function(badgeData) {
  // Check if badge already exists
  const existingBadge = this.badges.find(badge => badge.badgeId === badgeData.badgeId);
  if (existingBadge) {
    return false; // Badge already earned
  }

  this.badges.push({
    ...badgeData,
    earnedAt: new Date()
  });

  return this.save();
};

// Instance method to update activity
MembershipSchema.methods.updateActivity = function(activityType, increment = 1) {
  if (this.activity.hasOwnProperty(activityType)) {
    this.activity[activityType] += increment;
    this.lastActiveAt = new Date();
    return this.save();
  }
  throw new Error('Invalid activity type');
};

// Instance method to add trust review
MembershipSchema.methods.addTrustReview = function(reviewData) {
  this.trust.reviews.push({
    ...reviewData,
    createdAt: new Date()
  });

  // Recalculate trust score
  this.recalculateTrustScore();
  
  return this.save();
};

// Instance method to recalculate trust score
MembershipSchema.methods.recalculateTrustScore = function() {
  const reviews = this.trust.reviews;
  const violations = this.trust.violations;

  if (reviews.length === 0) return;

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  // Base score from ratings (1-5 scale converted to 0-100)
  let score = ((averageRating - 1) / 4) * 100;

  // Penalty for violations
  const violationPenalty = violations.reduce((penalty, violation) => {
    const severityPenalty = {
      minor: 5,
      moderate: 15,
      major: 30,
      severe: 50
    };
    return penalty + (severityPenalty[violation.severity] || 5);
  }, 0);

  score = Math.max(0, Math.min(100, score - violationPenalty));
  
  this.trust.score = Math.round(score);
};

// Instance method to check permissions
MembershipSchema.methods.hasPermission = function(permission) {
  // Creators and admins have all permissions
  if (this.role === 'creator' || this.role === 'admin') {
    return true;
  }

  // Moderators have most permissions
  if (this.role === 'moderator') {
    const modPermissions = [
      'canPost', 'canComment', 'canShareResources', 
      'canBookResources', 'canCreateEvents'
    ];
    return modPermissions.includes(permission);
  }

  // Check custom permissions for regular members
  return this.customPermissions[permission] || false;
};

export default mongoose.model('Membership', MembershipSchema);