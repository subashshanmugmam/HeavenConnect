import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  // Message Identity
  messageId: {
    type: String,
    unique: true,
    default: function() {
      return 'MSG' + Date.now() + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
  },
  
  // Message Type and Context
  type: {
    type: String,
    enum: {
      values: [
        'text', 'image', 'file', 'location', 'system', 
        'booking_update', 'payment_update', 'resource_inquiry',
        'automated', 'notification'
      ],
      message: 'Message type must be one of the predefined options'
    },
    default: 'text'
  },
  
  // Conversation Context
  conversationType: {
    type: String,
    enum: {
      values: ['direct', 'group', 'community', 'booking', 'support'],
      message: 'Conversation type must be one of the predefined options'
    },
    required: [true, 'Conversation type is required']
  },
  
  // Participants
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user is required']
    },
    deliveredAt: Date,
    readAt: Date,
    isRead: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false }
  }],
  
  // Thread and Grouping
  threadId: {
    type: String,
    required: [true, 'Thread ID is required'],
    index: true
  },
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    sparse: true // For replies
  },
  isThreadStarter: { type: Boolean, default: false },
  
  // Related Entities
  relatedEntities: {
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
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      sparse: true
    }
  },
  
  // Message Content
  content: {
    text: {
      type: String,
      maxLength: [4000, 'Message text cannot exceed 4000 characters'],
      trim: true
    },
    html: String, // Rich text content
    mentions: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      startIndex: Number,
      length: Number,
      displayName: String
    }],
    hashtags: [String],
    urls: [{
      url: String,
      title: String,
      description: String,
      image: String,
      domain: String
    }]
  },
  
  // Attachments and Media
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document', 'location'],
      required: [true, 'Attachment type is required']
    },
    url: {
      type: String,
      required: [true, 'Attachment URL is required']
    },
    publicId: String, // Cloudinary public ID
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number, // bytes
    dimensions: {
      width: Number,
      height: Number
    },
    duration: Number, // for audio/video in seconds
    thumbnail: String, // thumbnail URL for videos
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Location Data (for location messages)
  location: {
    coordinates: {
      type: [Number], // [longitude, latitude]
      validate: {
        validator: function(coords) {
          return !coords || (coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && 
                 coords[1] >= -90 && coords[1] <= 90);
        },
        message: 'Invalid coordinates format'
      }
    },
    address: String,
    name: String, // Place name
    accuracy: Number // meters
  },
  
  // Message Status and State
  status: {
    type: String,
    enum: {
      values: ['sent', 'delivered', 'read', 'failed', 'deleted'],
      message: 'Status must be one of the predefined options'
    },
    default: 'sent'
  },
  isEdited: { type: Boolean, default: false },
  editHistory: [{
    previousContent: String,
    editedAt: { type: Date, default: Date.now },
    reason: String
  }],
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Reactions and Interactions
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reaction user is required']
    },
    emoji: {
      type: String,
      required: [true, 'Reaction emoji is required']
    },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Priority and Urgency
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  isImportant: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  
  // Moderation and Safety
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
        enum: ['spam', 'harassment', 'inappropriate', 'fraud', 'other']
      },
      description: String,
      reportedAt: { type: Date, default: Date.now }
    }],
    isHidden: { type: Boolean, default: false },
    hiddenAt: Date,
    hiddenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    autoModeration: {
      flagged: { type: Boolean, default: false },
      confidence: Number, // 0-1
      reasons: [String],
      action: {
        type: String,
        enum: ['none', 'flag', 'hide', 'delete']
      }
    }
  },
  
  // System and Automated Messages
  system: {
    isSystemMessage: { type: Boolean, default: false },
    template: String, // Template name for system messages
    variables: mongoose.Schema.Types.Mixed, // Template variables
    action: {
      type: String,
      enum: [
        'booking_created', 'booking_confirmed', 'booking_cancelled',
        'payment_processed', 'user_joined', 'user_left', 'resource_shared'
      ]
    }
  },
  
  // Encryption and Security
  encryption: {
    isEncrypted: { type: Boolean, default: false },
    algorithm: String,
    keyId: String,
    salt: String
  },
  
  // Delivery and Read Receipts
  delivery: {
    attempts: { type: Number, default: 0 },
    lastAttempt: Date,
    deliveredCount: { type: Number, default: 0 },
    readCount: { type: Number, default: 0 },
    failureReason: String
  },
  
  // Analytics and Metadata
  analytics: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api', 'system'],
      default: 'web'
    },
    deviceType: String,
    ipAddress: String,
    userAgent: String,
    responseTime: Number, // Time to send response in seconds
  },
  
  // Scheduling (for future messages)
  scheduling: {
    isScheduled: { type: Boolean, default: false },
    scheduledFor: Date,
    timezone: String,
    recurring: {
      enabled: { type: Boolean, default: false },
      pattern: {
        type: String,
        enum: ['daily', 'weekly', 'monthly']
      },
      interval: Number,
      endDate: Date
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
MessageSchema.index({ threadId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ 'recipients.user': 1, 'recipients.isRead': 1 });
MessageSchema.index({ messageId: 1 }, { unique: true });
MessageSchema.index({ type: 1, conversationType: 1 });
MessageSchema.index({ 'relatedEntities.booking': 1 }, { sparse: true });
MessageSchema.index({ status: 1, createdAt: -1 });

// Virtual for message age
MessageSchema.virtual('ageInMinutes').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60));
});

// Virtual for checking if message has attachments
MessageSchema.virtual('hasAttachments').get(function() {
  return this.attachments && this.attachments.length > 0;
});

// Virtual for unread recipient count
MessageSchema.virtual('unreadCount').get(function() {
  return this.recipients.filter(r => !r.isRead).length;
});

// Virtual for total recipient count
MessageSchema.virtual('recipientCount').get(function() {
  return this.recipients.length;
});

// Pre-save middleware
MessageSchema.pre('save', function(next) {
  // Update delivery statistics
  this.delivery.deliveredCount = this.recipients.filter(r => r.isDelivered).length;
  this.delivery.readCount = this.recipients.filter(r => r.isRead).length;
  
  // Update overall status based on recipients
  if (this.delivery.readCount === this.recipients.length && this.recipients.length > 0) {
    this.status = 'read';
  } else if (this.delivery.deliveredCount === this.recipients.length && this.recipients.length > 0) {
    this.status = 'delivered';
  }
  
  // Generate thread ID if not provided
  if (!this.threadId) {
    if (this.conversationType === 'direct') {
      const participants = [this.sender, ...this.recipients.map(r => r.user)].sort();
      this.threadId = participants.join('_');
    } else {
      this.threadId = this.relatedEntities.community || 
                     this.relatedEntities.booking || 
                     new mongoose.Types.ObjectId().toString();
    }
  }
  
  next();
});

// Static method to get conversation history
MessageSchema.statics.getConversationHistory = function(threadId, options = {}) {
  const {
    page = 1,
    limit = 50,
    before,
    after,
    messageType
  } = options;

  const query = { threadId, isDeleted: false };
  
  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }
  
  if (after) {
    query.createdAt = { ...query.createdAt, $gt: new Date(after) };
  }
  
  if (messageType) {
    query.type = messageType;
  }

  const skip = (page - 1) * limit;

  return this.find(query)
    .populate('sender', 'firstName lastName avatar')
    .populate('recipients.user', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to mark messages as read
MessageSchema.statics.markAsRead = function(threadId, userId) {
  return this.updateMany(
    {
      threadId,
      'recipients.user': userId,
      'recipients.isRead': false
    },
    {
      $set: {
        'recipients.$.isRead': true,
        'recipients.$.readAt': new Date()
      }
    }
  );
};

// Static method to get unread count for user
MessageSchema.statics.getUnreadCount = function(userId) {
  return this.aggregate([
    {
      $match: {
        'recipients.user': mongoose.Types.ObjectId(userId),
        'recipients.isRead': false,
        isDeleted: false
      }
    },
    {
      $group: {
        _id: '$threadId',
        count: { $sum: 1 },
        lastMessage: { $max: '$createdAt' }
      }
    },
    {
      $group: {
        _id: null,
        totalUnreadThreads: { $sum: 1 },
        totalUnreadMessages: { $sum: '$count' }
      }
    }
  ]);
};

// Static method to get conversation threads for user
MessageSchema.statics.getUserThreads = function(userId, options = {}) {
  const { limit = 20, page = 1 } = options;
  const skip = (page - 1) * limit;

  return this.aggregate([
    {
      $match: {
        $or: [
          { sender: mongoose.Types.ObjectId(userId) },
          { 'recipients.user': mongoose.Types.ObjectId(userId) }
        ],
        isDeleted: false
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$threadId',
        lastMessage: { $first: '$$ROOT' },
        messageCount: { $sum: 1 },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $in: [mongoose.Types.ObjectId(userId), '$recipients.user'] },
                  { $eq: ['$recipients.isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.sender',
        foreignField: '_id',
        as: 'senderInfo'
      }
    },
    {
      $addFields: {
        lastMessage: {
          $mergeObjects: [
            '$lastMessage',
            { sender: { $arrayElemAt: ['$senderInfo', 0] } }
          ]
        }
      }
    },
    {
      $project: {
        senderInfo: 0
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    }
  ]);
};

// Instance method to add reaction
MessageSchema.methods.addReaction = function(userId, emoji) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
  
  // Add new reaction
  this.reactions.push({
    user: userId,
    emoji,
    timestamp: new Date()
  });
  
  return this.save();
};

// Instance method to remove reaction
MessageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Instance method to edit message
MessageSchema.methods.editContent = function(newContent, reason = 'User edit') {
  // Store previous content in history
  this.editHistory.push({
    previousContent: this.content.text,
    editedAt: new Date(),
    reason
  });
  
  this.content.text = newContent;
  this.isEdited = true;
  
  return this.save();
};

// Instance method to soft delete
MessageSchema.methods.softDelete = function(deletedBy = null) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  
  return this.save();
};

// Instance method to mark as delivered for specific user
MessageSchema.methods.markDelivered = function(userId) {
  const recipient = this.recipients.find(
    r => r.user.toString() === userId.toString()
  );
  
  if (recipient && !recipient.isDelivered) {
    recipient.isDelivered = true;
    recipient.deliveredAt = new Date();
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Instance method to mark as read for specific user
MessageSchema.methods.markRead = function(userId) {
  const recipient = this.recipients.find(
    r => r.user.toString() === userId.toString()
  );
  
  if (recipient && !recipient.isRead) {
    recipient.isRead = true;
    recipient.readAt = new Date();
    
    if (!recipient.isDelivered) {
      recipient.isDelivered = true;
      recipient.deliveredAt = new Date();
    }
    
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Instance method to report message
MessageSchema.methods.reportMessage = function(reporterId, reason, description = '') {
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

// Instance method to create system message
MessageSchema.statics.createSystemMessage = function(data) {
  return new this({
    ...data,
    type: 'system',
    system: {
      isSystemMessage: true,
      ...data.system
    },
    sender: data.systemSender || new mongoose.Types.ObjectId() // System user ID
  });
};

export default mongoose.model('Message', MessageSchema);