import Resource from '../models/Resource.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadService } from '../services/uploadService.js';

/**
 * Resource Controller
 */
class ResourceController {
  /**
   * Get all resources with filters
   */
  getResources = asyncHandler(async (req, res) => {
    const {
      category,
      subcategory,
      location,
      radius = 10,
      priceRange,
      availability,
      sortBy = 'newest',
      page = 1,
      limit = 20,
      search
    } = req.query;

    let filter = { isActive: true };
    let sort = {};

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Subcategory filter
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Location-based filter
    if (location) {
      const [lng, lat] = location.split(',').map(Number);
      filter['location.coordinates'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filter['pricing.amount'] = { $gte: min, $lte: max };
    }

    // Availability filter
    if (availability) {
      filter.availability.status = availability;
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'price_low':
        sort = { 'pricing.amount': 1 };
        break;
      case 'price_high':
        sort = { 'pricing.amount': -1 };
        break;
      case 'rating':
        sort = { 'ratings.average': -1 };
        break;
      case 'distance':
        // Distance sorting is handled by $near
        break;
      default:
        sort = { createdAt: -1 };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: [
        { path: 'owner', select: 'firstName lastName avatar trustScore' },
        { path: 'community', select: 'name' }
      ]
    };

    const resources = await Resource.paginate(filter, options);

    res.status(200).json({
      success: true,
      data: resources
    });
  });

  /**
   * Create a new resource
   */
  createResource = asyncHandler(async (req, res) => {
    const {
      title,
      description,
      category,
      subcategory,
      condition,
      pricing,
      location,
      availabilitySchedule,
      specifications,
      tags,
      isFood
    } = req.body;

    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadService.uploadImage(file.buffer, {
          folder: 'resources',
          width: 800,
          height: 600,
          crop: 'limit'
        })
      );
      
      const uploadResults = await Promise.all(uploadPromises);
      images = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        alt: title
      }));
    }

    const resource = new Resource({
      title,
      description,
      category,
      subcategory,
      condition,
      pricing,
      location: {
        type: 'Point',
        coordinates: location.coordinates,
        address: location.address
      },
      images,
      owner: req.user._id,
      availabilitySchedule,
      specifications,
      tags,
      isFood: isFood || category === 'food'
    });

    // Add food-specific fields if it's a food item
    if (resource.isFood) {
      const { expiryDate, dietaryInfo, allergens, preparationDate, servings } = req.body;
      
      resource.foodDetails = {
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        preparationDate: preparationDate ? new Date(preparationDate) : undefined,
        servings,
        dietaryInfo: dietaryInfo || [],
        allergens: allergens || [],
        safetyCompliance: {
          temperatureControlled: req.body.temperatureControlled || false,
          homeMade: req.body.homeMade || false,
          packaged: req.body.packaged || false
        }
      };
    }

    await resource.save();

    // Populate owner information
    await resource.populate('owner', 'firstName lastName avatar trustScore');

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    });
  });

  /**
   * Get resource by ID
   */
  getResourceById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const resource = await Resource.findById(id)
      .populate('owner', 'firstName lastName avatar trustScore location.address.city')
      .populate('community', 'name description')
      .populate('reviews.userId', 'firstName lastName avatar');

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Increment view count
    resource.analytics.views += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      data: resource
    });
  });

  /**
   * Update resource
   */
  updateResource = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const resource = await Resource.findById(id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check ownership
    if (resource.owner.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to update this resource', 403);
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        uploadService.uploadImage(file.buffer, {
          folder: 'resources',
          width: 800,
          height: 600,
          crop: 'limit'
        })
      );
      
      const uploadResults = await Promise.all(uploadPromises);
      const newImages = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id,
        alt: updateData.title || resource.title
      }));
      
      updateData.images = [...resource.images, ...newImages];
    }

    // Update resource
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        resource[key] = updateData[key];
      }
    });

    resource.updatedAt = new Date();
    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: resource
    });
  });

  /**
   * Delete resource
   */
  deleteResource = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const resource = await Resource.findById(id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check ownership
    if (resource.owner.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to delete this resource', 403);
    }

    // Delete images from cloud storage
    if (resource.images.length > 0) {
      const deletePromises = resource.images.map(image =>
        uploadService.deleteImage(image.publicId)
      );
      await Promise.all(deletePromises);
    }

    await Resource.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  });

  /**
   * Request a resource
   */
  requestResource = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { message, requestedDates, quantity = 1 } = req.body;

    const resource = await Resource.findById(id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check if user is trying to request their own resource
    if (resource.owner.toString() === req.user._id.toString()) {
      throw new AppError('You cannot request your own resource', 400);
    }

    // Check if resource is available
    if (resource.availability.status !== 'available') {
      throw new AppError('Resource is not available', 400);
    }

    // Check if user has already requested this resource
    const existingRequest = resource.requests.find(
      request => request.requester.toString() === req.user._id.toString() && 
                request.status === 'pending'
    );

    if (existingRequest) {
      throw new AppError('You have already requested this resource', 400);
    }

    // Create request
    const request = {
      requester: req.user._id,
      message,
      requestedDates: requestedDates ? {
        start: new Date(requestedDates.start),
        end: new Date(requestedDates.end)
      } : undefined,
      quantity,
      status: 'pending',
      createdAt: new Date()
    };

    resource.requests.push(request);
    await resource.save();

    // Populate requester information
    await resource.populate('requests.requester', 'firstName lastName avatar');

    res.status(200).json({
      success: true,
      message: 'Resource requested successfully',
      data: request
    });
  });

  /**
   * Get resource requests (Owner only)
   */
  getResourceRequests = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const resource = await Resource.findById(id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check ownership
    if (resource.owner.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to view requests', 403);
    }

    let requests = resource.requests;

    // Filter by status
    if (status) {
      requests = requests.filter(request => request.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRequests = requests.slice(startIndex, endIndex);

    // Populate requester information
    await Resource.populate(paginatedRequests, {
      path: 'requester',
      select: 'firstName lastName avatar trustScore'
    });

    res.status(200).json({
      success: true,
      data: {
        requests: paginatedRequests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: requests.length,
          pages: Math.ceil(requests.length / limit)
        }
      }
    });
  });

  /**
   * Update request status (Owner only)
   */
  updateRequestStatus = asyncHandler(async (req, res) => {
    const { id, requestId } = req.params;
    const { status, message } = req.body;

    const resource = await Resource.findById(id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check ownership
    if (resource.owner.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to update requests', 403);
    }

    // Find request
    const request = resource.requests.id(requestId);
    if (!request) {
      throw new AppError('Request not found', 404);
    }

    // Update request
    request.status = status;
    request.responseMessage = message;
    request.respondedAt = new Date();

    // Update resource availability if approved
    if (status === 'approved') {
      resource.availability.status = 'rented';
      resource.availability.rentedTo = request.requester;
      resource.availability.rentedUntil = request.requestedDates?.end;
    }

    await resource.save();

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      data: request
    });
  });

  /**
   * Add resource to favorites
   */
  addToFavorites = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    const resource = await Resource.findById(id);

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check if already in favorites
    const isAlreadyFavorite = user.favorites.resources.includes(id);
    if (isAlreadyFavorite) {
      throw new AppError('Resource is already in favorites', 400);
    }

    // Add to favorites
    user.favorites.resources.push(id);
    resource.analytics.favorites += 1;

    await Promise.all([user.save(), resource.save()]);

    res.status(200).json({
      success: true,
      message: 'Resource added to favorites'
    });
  });

  /**
   * Remove resource from favorites
   */
  removeFromFavorites = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    const resource = await Resource.findById(id);

    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Remove from favorites
    user.favorites.resources = user.favorites.resources.filter(
      resourceId => resourceId.toString() !== id
    );
    resource.analytics.favorites = Math.max(0, resource.analytics.favorites - 1);

    await Promise.all([user.save(), resource.save()]);

    res.status(200).json({
      success: true,
      message: 'Resource removed from favorites'
    });
  });

  /**
   * Report a resource
   */
  reportResource = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason, description } = req.body;

    const resource = await Resource.findById(id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }

    // Check if user already reported this resource
    const existingReport = resource.reports.find(
      report => report.reporterId.toString() === req.user._id.toString()
    );

    if (existingReport) {
      throw new AppError('You have already reported this resource', 400);
    }

    // Add report
    resource.reports.push({
      reporterId: req.user._id,
      reason,
      description,
      createdAt: new Date()
    });

    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource reported successfully'
    });
  });

  /**
   * Get nearby resources
   */
  getNearbyResources = asyncHandler(async (req, res) => {
    const { lat, lng, radius = 10, category, limit = 20 } = req.query;

    const filter = {
      isActive: true,
      'location.coordinates': {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    };

    if (category) {
      filter.category = category;
    }

    const resources = await Resource.find(filter)
      .limit(parseInt(limit))
      .populate('owner', 'firstName lastName avatar trustScore')
      .select('title images pricing location category ratings availability');

    res.status(200).json({
      success: true,
      data: resources
    });
  });

  /**
   * Get all categories with counts
   */
  getCategories = asyncHandler(async (req, res) => {
    const categories = await Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: categories
    });
  });

  /**
   * Get trending resources
   */
  getTrendingResources = asyncHandler(async (req, res) => {
    const { period = 'week', limit = 10 } = req.query;

    let dateFilter = new Date();
    switch (period) {
      case 'day':
        dateFilter.setDate(dateFilter.getDate() - 1);
        break;
      case 'week':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case 'month':
        dateFilter.setMonth(dateFilter.getMonth() - 1);
        break;
    }

    const resources = await Resource.find({
      isActive: true,
      createdAt: { $gte: dateFilter }
    })
      .sort({ 'analytics.views': -1, 'analytics.favorites': -1 })
      .limit(parseInt(limit))
      .populate('owner', 'firstName lastName avatar trustScore')
      .select('title images pricing category ratings analytics');

    res.status(200).json({
      success: true,
      data: resources
    });
  });
}

export default new ResourceController();