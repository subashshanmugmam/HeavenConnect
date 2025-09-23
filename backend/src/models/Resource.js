import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  // Basic Information
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    trim: true, 
    maxLength: [100, 'Title cannot exceed 100 characters'] 
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'], 
    maxLength: [2000, 'Description cannot exceed 2000 characters'] 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: {
      values: ['electronics', 'furniture', 'tools', 'vehicles', 'books', 'sports', 'clothing', 'kitchen', 'garden', 'other'],
      message: 'Category must be one of the predefined options'
    }
  },
  subCategory: String,
  tags: [{ 
    type: String, 
    lowercase: true, 
    trim: true 
  }],
  
  // Ownership and Management
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Owner is required'] 
  },
  status: { 
    type: String, 
    enum: {
      values: ['available', 'rented', 'maintenance', 'unavailable', 'pending_approval', 'rejected'],
      message: 'Status must be one of the predefined options'
    }, 
    default: 'available' 
  },
  
  // Physical Properties
  condition: { 
    type: String, 
    enum: {
      values: ['new', 'excellent', 'good', 'fair', 'poor'],
      message: 'Condition must be one of the predefined options'
    }, 
    required: [true, 'Condition is required'] 
  },
  brand: String,
  model: String,
  year: {
    type: Number,
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  color: String,
  dimensions: {
    length: { type: Number, min: 0 }, // cm
    width: { type: Number, min: 0 },  // cm
    height: { type: Number, min: 0 }, // cm
    weight: { type: Number, min: 0 }  // kg
  },
  
  // Location
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { 
      type: [Number], 
      index: '2dsphere', 
      required: [true, 'Location coordinates are required'],
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates format'
      }
    },
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
    deliveryFee: { type: Number, default: 0, min: 0 }
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
    url: {
      type: String,
      required: [true, 'Image URL is required']
    },
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
    rule: {
      type: String,
      required: [true, 'Rule description is required']
    },
    isRequired: { type: Boolean, default: true }
  }],
  ageRestriction: { 
    type: Number, 
    min: [0, 'Age restriction cannot be negative'], 
    max: [99, 'Age restriction too high'] 
  },
  requiresLicense: { type: Boolean, default: false },
  
  // Reviews and Ratings
  reviews: [{
    reviewer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: [true, 'Reviewer is required']
    },
    booking: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Booking' 
    },
    rating: { 
      type: Number, 
      required: [true, 'Rating is required'], 
      min: [1, 'Rating must be at least 1'], 
      max: [5, 'Rating cannot exceed 5'] 
    },
    comment: { 
      type: String, 
      maxLength: [1000, 'Comment cannot exceed 1000 characters'] 
    },
    images: [String],
    createdAt: { type: Date, default: Date.now },
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],
  averageRating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
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
      confidence: { type: Number, min: 0, max: 1 } // 0-1
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
    insuranceValue: { type: Number, min: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
ResourceSchema.index({ 'location.coordinates': '2dsphere' });
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
ResourceSchema.index({ category: 1, status: 1, 'pricing.daily': 1 });
ResourceSchema.index({ owner: 1, status: 1 });
ResourceSchema.index({ averageRating: -1, totalReviews: -1 });
ResourceSchema.index({ createdAt: -1 });

// Virtual for primary image
ResourceSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg || this.images[0] || null;
});

// Virtual for availability status
ResourceSchema.virtual('isAvailable').get(function() {
  return this.status === 'available';
});

// Pre-save middleware to update analytics
ResourceSchema.pre('save', function(next) {
  // Update average rating when reviews change
  if (this.isModified('reviews')) {
    if (this.reviews.length > 0) {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = totalRating / this.reviews.length;
      this.totalReviews = this.reviews.length;
    } else {
      this.averageRating = 0;
      this.totalReviews = 0;
    }
  }
  
  // Ensure at least one image is marked as primary
  if (this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  
  next();
});

// Static method to find nearby resources
ResourceSchema.statics.findNearby = function(longitude, latitude, filters = {}, maxDistance = 10000) {
  const matchConditions = {
    status: 'available',
    ...filters
  };

  return this.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [longitude, latitude] },
        distanceField: "distance",
        maxDistance: maxDistance,
        spherical: true,
        query: matchConditions
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerInfo",
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              avatar: 1,
              trustScore: 1
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: "bookings",
        let: { resourceId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$resource", "$$resourceId"] },
              status: { $in: ["confirmed", "active"] },
              startDate: { $lte: new Date() },
              endDate: { $gte: new Date() }
            }
          }
        ],
        as: "currentBookings"
      }
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$ownerInfo", 0] },
        isCurrentlyBooked: { $gt: [{ $size: "$currentBookings" }, 0] }
      }
    },
    {
      $project: {
        ownerInfo: 0,
        currentBookings: 0
      }
    },
    {
      $sort: { distance: 1, averageRating: -1 }
    }
  ]);
};

// Static method for advanced search
ResourceSchema.statics.advancedSearch = function(searchParams) {
  const {
    query,
    category,
    location,
    radius = 10000,
    minPrice,
    maxPrice,
    condition,
    availability,
    sortBy = 'relevance',
    page = 1,
    limit = 20
  } = searchParams;

  const pipeline = [];

  // Geospatial filtering if location provided
  if (location) {
    const [lat, lng] = location.split(',').map(Number);
    pipeline.push({
      $geoNear: {
        near: { type: "Point", coordinates: [lng, lat] },
        distanceField: "distance",
        maxDistance: radius,
        spherical: true,
        query: { status: 'available' }
      }
    });
  } else {
    pipeline.push({ $match: { status: 'available' } });
  }

  // Text search
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
    pipeline.push({ $match: { category } });
  }

  // Condition filtering
  if (condition) {
    pipeline.push({ $match: { condition } });
  }

  // Price filtering
  if (minPrice || maxPrice) {
    const priceMatch = {};
    if (minPrice) priceMatch['pricing.daily'] = { $gte: Number(minPrice) };
    if (maxPrice) priceMatch['pricing.daily'] = { ...priceMatch['pricing.daily'], $lte: Number(maxPrice) };
    pipeline.push({ $match: priceMatch });
  }

  // Add calculated relevance score
  pipeline.push({
    $addFields: {
      relevanceScore: {
        $add: [
          { $multiply: ["$averageRating", 2] },
          { $divide: ["$analytics.bookings", 10] },
          { $cond: [
            { $gt: ["$analytics.views", 0] }, 
            { $divide: ["$analytics.bookings", "$analytics.views"] }, 
            0
          ] }
        ]
      }
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

  return this.aggregate(pipeline);
};

// Instance method to check availability for specific dates
ResourceSchema.methods.checkAvailability = async function(startDate, endDate) {
  const Booking = mongoose.model('Booking');
  
  const conflictingBookings = await Booking.find({
    resource: this._id,
    status: { $in: ['confirmed', 'active'] },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ]
  });

  return conflictingBookings.length === 0;
};

// Instance method to calculate pricing for duration
ResourceSchema.methods.calculatePricing = function(startDate, endDate) {
  const hours = Math.ceil((endDate - startDate) / (1000 * 60 * 60));
  
  let basePrice = 0;
  
  if (hours <= 24 && this.pricing.daily) {
    basePrice = this.pricing.daily;
  } else if (hours <= 168 && this.pricing.weekly) { // 7 days
    basePrice = this.pricing.weekly;
  } else if (hours <= 720 && this.pricing.monthly) { // 30 days
    basePrice = this.pricing.monthly;
  } else if (this.pricing.hourly) {
    basePrice = this.pricing.hourly * hours;
  } else if (this.pricing.daily) {
    const days = Math.ceil(hours / 24);
    basePrice = this.pricing.daily * days;
  }

  return {
    baseAmount: basePrice,
    deposit: this.pricing.deposit || 0,
    deliveryFee: this.location.isDeliveryAvailable ? this.location.deliveryFee : 0,
    totalAmount: basePrice + (this.pricing.deposit || 0)
  };
};

export default mongoose.model('Resource', ResourceSchema);