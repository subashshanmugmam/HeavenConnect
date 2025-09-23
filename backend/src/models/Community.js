import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: [true, 'Community name is required'], 
    trim: true, 
    maxLength: [100, 'Community name cannot exceed 100 characters'],
    unique: true
  },
  slug: {
    type: String,
    required: [true, 'Community slug is required'],
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'], 
    maxLength: [2000, 'Description cannot exceed 2000 characters'] 
  },
  tagline: {
    type: String,
    maxLength: [150, 'Tagline cannot exceed 150 characters']
  },
  
  // Visual Identity
  avatar: {
    url: String,
    publicId: String // Cloudinary public ID
  },
  banner: {
    url: String,
    publicId: String
  },
  theme: {
    primaryColor: { type: String, default: '#2196F3' },
    secondaryColor: { type: String, default: '#FFC107' },
    backgroundColor: { type: String, default: '#FFFFFF' }
  },
  
  // Community Type and Category
  type: {
    type: String,
    enum: {
      values: ['public', 'private', 'invite_only'],
      message: 'Type must be public, private, or invite_only'
    },
    default: 'public'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'neighborhood', 'building', 'workplace', 'university', 'hobby', 
        'professional', 'family', 'sports', 'gaming', 'arts', 'technology', 
        'health', 'environment', 'charity', 'other'
      ],
      message: 'Category must be one of the predefined options'
    }
  },
  tags: [{ 
    type: String, 
    lowercase: true, 
    trim: true 
  }],
  
  // Location and Geographic Scope
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { 
      type: [Number], 
      index: '2dsphere',
      validate: {
        validator: function(coords) {
          return !coords || (coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90);     // latitude
        },
        message: 'Invalid coordinates format'
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    radius: { type: Number, default: 5000 }, // meters
    isLocationBased: { type: Boolean, default: true }
  },
  
  // Membership Management
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Creator is required'] 
  },
  admins: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permissions: {
      manageMembers: { type: Boolean, default: true },
      moderateContent: { type: Boolean, default: true },
      manageEvents: { type: Boolean, default: true },
      editCommunity: { type: Boolean, default: false },
      manageBilling: { type: Boolean, default: false }
    }
  }],
  moderators: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permissions: {
      moderateContent: { type: Boolean, default: true },
      managePosts: { type: Boolean, default: true },
      manageComments: { type: Boolean, default: true },
      issueWarnings: { type: Boolean, default: true }
    }
  }],
  
  // Membership Stats
  memberStats: {
    totalMembers: { type: Number, default: 0 },
    activeMembers: { type: Number, default: 0 }, // Active in last 30 days
    pendingRequests: { type: Number, default: 0 },
    memberLimit: { type: Number, default: 10000 }
  },
  
  // Community Rules and Guidelines
  rules: [{
    title: {
      type: String,
      required: [true, 'Rule title is required'],
      maxLength: [100, 'Rule title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Rule description is required'],
      maxLength: [500, 'Rule description cannot exceed 500 characters']
    },
    severity: {
      type: String,
      enum: ['warning', 'minor', 'major', 'ban'],
      default: 'warning'
    },
    order: { type: Number, default: 0 }
  }],
  
  // Content Guidelines
  guidelines: {
    allowedResourceTypes: [{
      type: String,
      enum: ['electronics', 'furniture', 'tools', 'vehicles', 'books', 'sports', 'clothing', 'kitchen', 'garden', 'other']
    }],
    requireApproval: { type: Boolean, default: false },
    allowExternal: { type: Boolean, default: true }, // Allow non-members to book
    minimumTrustScore: { type: Number, default: 0 },
    maximumRentalDays: { type: Number, default: 30 }
  },
  
  // Features and Settings
  features: {
    enableChat: { type: Boolean, default: true },
    enableEvents: { type: Boolean, default: true },
    enableMarketplace: { type: Boolean, default: true },
    enableAnnouncements: { type: Boolean, default: true },
    enablePolls: { type: Boolean, default: true },
    enableResourceSharing: { type: Boolean, default: true },
    enablePoints: { type: Boolean, default: false },
    enableBadges: { type: Boolean, default: false }
  },
  
  // Communication Settings
  communication: {
    allowDirectMessages: { type: Boolean, default: true },
    requireMembershipForPosting: { type: Boolean, default: true },
    autoModeration: { type: Boolean, default: true },
    welcomeMessage: String,
    pinnedAnnouncements: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post' 
    }]
  },
  
  // Analytics and Insights
  analytics: {
    totalPosts: { type: Number, default: 0 },
    totalResources: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    growthRate: { type: Number, default: 0 }, // Monthly growth percentage
    retentionRate: { type: Number, default: 0 }, // Member retention percentage
    lastActivityAt: Date
  },
  
  // Verification and Trust
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationType: {
      type: String,
      enum: ['manual', 'automated', 'partner'],
      default: 'manual'
    },
    verificationDocuments: [String] // URLs to verification documents
  },
  
  // Status and Lifecycle
  status: {
    type: String,
    enum: {
      values: ['active', 'suspended', 'archived', 'deleted'],
      message: 'Status must be active, suspended, archived, or deleted'
    },
    default: 'active'
  },
  suspensionReason: String,
  suspendedAt: Date,
  suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Events and Activities
  events: [{
    title: String,
    description: String,
    date: Date,
    location: String,
    attendeeLimit: Number,
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Point System (if enabled)
  pointSystem: {
    enabled: { type: Boolean, default: false },
    rules: [{
      action: {
        type: String,
        enum: ['post', 'comment', 'share_resource', 'book_resource', 'review', 'refer_member']
      },
      points: { type: Number, default: 0 },
      dailyLimit: { type: Number, default: -1 } // -1 for unlimited
    }],
    rewards: [{
      name: String,
      description: String,
      pointsCost: Number,
      type: {
        type: String,
        enum: ['discount', 'badge', 'privilege', 'physical']
      },
      isActive: { type: Boolean, default: true }
    }]
  },
  
  // Integration Settings
  integrations: {
    slack: {
      enabled: { type: Boolean, default: false },
      webhookUrl: String,
      channelId: String
    },
    discord: {
      enabled: { type: Boolean, default: false },
      webhookUrl: String,
      serverId: String
    },
    calendar: {
      enabled: { type: Boolean, default: false },
      calendarId: String,
      syncEvents: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
CommunitySchema.index({ 'location.coordinates': '2dsphere' });
CommunitySchema.index({ name: 'text', description: 'text', tags: 'text' });
CommunitySchema.index({ category: 1, type: 1, status: 1 });
CommunitySchema.index({ slug: 1 }, { unique: true });
CommunitySchema.index({ creator: 1 });
CommunitySchema.index({ 'memberStats.totalMembers': -1 });

// Virtual for member count
CommunitySchema.virtual('memberCount').get(function() {
  return this.memberStats.totalMembers;
});

// Virtual for checking if user is admin
CommunitySchema.virtual('isUserAdmin').get(function() {
  if (!this._currentUser) return false;
  return this.creator.toString() === this._currentUser.toString() ||
         this.admins.some(admin => admin.user.toString() === this._currentUser.toString());
});

// Virtual for checking if user is moderator
CommunitySchema.virtual('isUserModerator').get(function() {
  if (!this._currentUser) return false;
  return this.isUserAdmin ||
         this.moderators.some(mod => mod.user.toString() === this._currentUser.toString());
});

// Pre-save middleware
CommunitySchema.pre('save', function(next) {
  // Generate slug from name if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Ensure creator is in admins list
  if (this.isNew) {
    const creatorAdmin = {
      user: this.creator,
      addedAt: new Date(),
      addedBy: this.creator,
      permissions: {
        manageMembers: true,
        moderateContent: true,
        manageEvents: true,
        editCommunity: true,
        manageBilling: true
      }
    };
    this.admins.push(creatorAdmin);
  }
  
  next();
});

// Static method to find nearby communities
CommunitySchema.statics.findNearby = function(longitude, latitude, radius = 10000, filters = {}) {
  const matchConditions = {
    status: 'active',
    'location.isLocationBased': true,
    ...filters
  };

  return this.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [longitude, latitude] },
        distanceField: "distance",
        maxDistance: radius,
        spherical: true,
        query: matchConditions
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creatorInfo",
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              avatar: 1
            }
          }
        ]
      }
    },
    {
      $addFields: {
        creator: { $arrayElemAt: ["$creatorInfo", 0] }
      }
    },
    {
      $project: {
        creatorInfo: 0
      }
    },
    {
      $sort: { distance: 1, 'memberStats.totalMembers': -1 }
    }
  ]);
};

// Static method for community search
CommunitySchema.statics.search = function(searchParams) {
  const {
    query,
    category,
    type,
    location,
    radius = 10000,
    minMembers,
    maxMembers,
    sortBy = 'relevance',
    page = 1,
    limit = 20
  } = searchParams;

  const pipeline = [];

  // Base match conditions
  const baseMatch = { status: 'active' };
  
  // Location filtering
  if (location) {
    const [lat, lng] = location.split(',').map(Number);
    pipeline.push({
      $geoNear: {
        near: { type: "Point", coordinates: [lng, lat] },
        distanceField: "distance",
        maxDistance: radius,
        spherical: true,
        query: baseMatch
      }
    });
  } else {
    pipeline.push({ $match: baseMatch });
  }

  // Text search
  if (query) {
    pipeline.push({
      $match: {
        $or: [
          { $text: { $search: query } },
          { name: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    });
  }

  // Category filtering
  if (category) {
    pipeline.push({ $match: { category } });
  }

  // Type filtering
  if (type) {
    pipeline.push({ $match: { type } });
  }

  // Member count filtering
  if (minMembers || maxMembers) {
    const memberMatch = {};
    if (minMembers) memberMatch['memberStats.totalMembers'] = { $gte: Number(minMembers) };
    if (maxMembers) memberMatch['memberStats.totalMembers'] = { ...memberMatch['memberStats.totalMembers'], $lte: Number(maxMembers) };
    pipeline.push({ $match: memberMatch });
  }

  // Add engagement score calculation
  pipeline.push({
    $addFields: {
      engagementScore: {
        $add: [
          { $multiply: ["$memberStats.totalMembers", 0.3] },
          { $multiply: ["$analytics.totalPosts", 0.2] },
          { $multiply: ["$analytics.totalBookings", 0.3] },
          { $multiply: ["$analytics.averageRating", 4] }
        ]
      }
    }
  });

  // Sorting
  const sortOptions = {
    relevance: { engagementScore: -1, 'memberStats.totalMembers': -1 },
    members: { 'memberStats.totalMembers': -1 },
    newest: { createdAt: -1 },
    activity: { 'analytics.lastActivityAt': -1 },
    distance: { distance: 1 }
  };

  pipeline.push({ $sort: sortOptions[sortBy] || sortOptions.relevance });

  // Pagination
  const skip = (page - 1) * limit;
  pipeline.push({ $skip: skip }, { $limit: Number(limit) });

  return this.aggregate(pipeline);
};

// Instance method to add member
CommunitySchema.methods.addMember = async function(userId, addedBy = null) {
  const Membership = mongoose.model('Membership');
  
  // Check if already a member
  const existingMembership = await Membership.findOne({
    community: this._id,
    user: userId,
    status: { $in: ['active', 'pending'] }
  });
  
  if (existingMembership) {
    throw new Error('User is already a member or has a pending request');
  }
  
  // Create membership
  const membership = new Membership({
    community: this._id,
    user: userId,
    addedBy: addedBy,
    status: this.type === 'public' ? 'active' : 'pending',
    joinedAt: this.type === 'public' ? new Date() : undefined
  });
  
  await membership.save();
  
  // Update member count if approved
  if (membership.status === 'active') {
    this.memberStats.totalMembers += 1;
    await this.save();
  } else {
    this.memberStats.pendingRequests += 1;
    await this.save();
  }
  
  return membership;
};

// Instance method to remove member
CommunitySchema.methods.removeMember = async function(userId, removedBy = null, reason = null) {
  const Membership = mongoose.model('Membership');
  
  const membership = await Membership.findOne({
    community: this._id,
    user: userId,
    status: 'active'
  });
  
  if (!membership) {
    throw new Error('User is not a member of this community');
  }
  
  // Update membership status
  membership.status = 'removed';
  membership.removedAt = new Date();
  membership.removedBy = removedBy;
  membership.removalReason = reason;
  await membership.save();
  
  // Update member count
  this.memberStats.totalMembers = Math.max(0, this.memberStats.totalMembers - 1);
  await this.save();
  
  return membership;
};

// Instance method to calculate engagement score
CommunitySchema.methods.calculateEngagementScore = function() {
  const memberWeight = 0.3;
  const postWeight = 0.2;
  const bookingWeight = 0.3;
  const ratingWeight = 0.2;
  
  const score = 
    (this.memberStats.totalMembers * memberWeight) +
    (this.analytics.totalPosts * postWeight) +
    (this.analytics.totalBookings * bookingWeight) +
    (this.analytics.averageRating * 20 * ratingWeight);
    
  return Math.round(score * 100) / 100;
};

// Instance method to check user permissions
CommunitySchema.methods.getUserPermissions = function(userId) {
  const userIdStr = userId.toString();
  
  // Creator has all permissions
  if (this.creator.toString() === userIdStr) {
    return {
      isCreator: true,
      isAdmin: true,
      isModerator: true,
      canManageMembers: true,
      canModerateContent: true,
      canManageEvents: true,
      canEditCommunity: true,
      canManageBilling: true
    };
  }
  
  // Check admin permissions
  const admin = this.admins.find(a => a.user.toString() === userIdStr);
  if (admin) {
    return {
      isCreator: false,
      isAdmin: true,
      isModerator: true,
      ...admin.permissions
    };
  }
  
  // Check moderator permissions
  const moderator = this.moderators.find(m => m.user.toString() === userIdStr);
  if (moderator) {
    return {
      isCreator: false,
      isAdmin: false,
      isModerator: true,
      canManageMembers: false,
      canEditCommunity: false,
      canManageBilling: false,
      ...moderator.permissions
    };
  }
  
  // Regular member
  return {
    isCreator: false,
    isAdmin: false,
    isModerator: false,
    canManageMembers: false,
    canModerateContent: false,
    canManageEvents: false,
    canEditCommunity: false,
    canManageBilling: false
  };
};

export default mongoose.model('Community', CommunitySchema);