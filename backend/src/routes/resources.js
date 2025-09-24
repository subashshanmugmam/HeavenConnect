import express from 'express';
import resourceController from '../controllers/resourceController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { body, param, query } from 'express-validator';
import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * @route   GET /api/resources
 * @desc    Get all resources with filters
 * @access  Public/Private
 */
router.get('/', [
  validate([
    query('category').optional().isIn(['electronics', 'furniture', 'tools', 'vehicles', 'books', 'sports', 'clothing', 'kitchen', 'garden', 'food', 'other']),
    query('subcategory').optional().isString(),
    query('location').optional().isString(),
    query('radius').optional().isInt({ min: 1, max: 100 }),
    query('priceRange').optional().isString(),
    query('availability').optional().isIn(['available', 'rented', 'maintenance']),
    query('sortBy').optional().isIn(['newest', 'oldest', 'price_low', 'price_high', 'rating', 'distance']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString()
  ])
], resourceController.getResources);

/**
 * @route   POST /api/resources
 * @desc    Create a new resource
 * @access  Private
 */
router.post('/', [
  authenticate,
  upload.array('images', 10),
  validate([
    body('title').isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
    body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('category').isIn(['electronics', 'furniture', 'tools', 'vehicles', 'books', 'sports', 'clothing', 'kitchen', 'garden', 'food', 'other']),
    body('subcategory').optional().isString(),
    body('condition').isIn(['new', 'like_new', 'good', 'fair', 'poor']),
    body('pricing.type').isIn(['free', 'rent', 'sell', 'trade']),
    body('pricing.amount').optional().isFloat({ min: 0 }),
    body('pricing.currency').optional().isIn(['USD', 'EUR', 'GBP']),
    body('pricing.period').optional().isIn(['hour', 'day', 'week', 'month']),
    body('location.coordinates').isArray().withMessage('Location coordinates are required'),
    body('location.address.street').optional().isString(),
    body('location.address.city').isString().withMessage('City is required'),
    body('location.address.state').isString().withMessage('State is required'),
    body('location.address.zipCode').isString().withMessage('ZIP code is required'),
    body('availabilitySchedule.type').optional().isIn(['always', 'scheduled', 'on_request']),
    body('specifications').optional().isObject(),
    body('tags').optional().isArray()
  ])
], resourceController.createResource);

/**
 * @route   GET /api/resources/:id
 * @desc    Get resource by ID
 * @access  Public
 */
router.get('/:id', [
  validate([
    param('id').isMongoId()
  ])
], resourceController.getResourceById);

/**
 * @route   PUT /api/resources/:id
 * @desc    Update resource
 * @access  Private (Owner only)
 */
router.put('/:id', [
  authenticate,
  upload.array('images', 10),
  validate([
    param('id').isMongoId(),
    body('title').optional().isLength({ min: 1, max: 100 }),
    body('description').optional().isLength({ min: 10, max: 1000 }),
    body('category').optional().isIn(['electronics', 'furniture', 'tools', 'vehicles', 'books', 'sports', 'clothing', 'kitchen', 'garden', 'food', 'other']),
    body('condition').optional().isIn(['new', 'like_new', 'good', 'fair', 'poor']),
    body('pricing.amount').optional().isFloat({ min: 0 }),
    body('specifications').optional().isObject(),
    body('tags').optional().isArray()
  ])
], resourceController.updateResource);

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete resource
 * @access  Private (Owner only)
 */
router.delete('/:id', [
  authenticate,
  validate([
    param('id').isMongoId()
  ])
], resourceController.deleteResource);

/**
 * @route   POST /api/resources/:id/request
 * @desc    Request a resource
 * @access  Private
 */
router.post('/:id/request', [
  authenticate,
  validate([
    param('id').isMongoId(),
    body('message').optional().isLength({ max: 500 }),
    body('requestedDates.start').optional().isISO8601(),
    body('requestedDates.end').optional().isISO8601(),
    body('quantity').optional().isInt({ min: 1 })
  ])
], resourceController.requestResource);

/**
 * @route   GET /api/resources/:id/requests
 * @desc    Get resource requests (Owner only)
 * @access  Private
 */
router.get('/:id/requests', [
  authenticate,
  validate([
    param('id').isMongoId(),
    query('status').optional().isIn(['pending', 'approved', 'rejected', 'completed']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ])
], resourceController.getResourceRequests);

/**
 * @route   PUT /api/resources/:id/requests/:requestId
 * @desc    Update request status (Owner only)
 * @access  Private
 */
router.put('/:id/requests/:requestId', [
  authenticate,
  validate([
    param('id').isMongoId(),
    param('requestId').isMongoId(),
    body('status').isIn(['approved', 'rejected']),
    body('message').optional().isLength({ max: 500 })
  ])
], resourceController.updateRequestStatus);

/**
 * @route   POST /api/resources/:id/favorite
 * @desc    Add resource to favorites
 * @access  Private
 */
router.post('/:id/favorite', [
  authenticate,
  validate([
    param('id').isMongoId()
  ])
], resourceController.addToFavorites);

/**
 * @route   DELETE /api/resources/:id/favorite
 * @desc    Remove resource from favorites
 * @access  Private
 */
router.delete('/:id/favorite', [
  authenticate,
  validate([
    param('id').isMongoId()
  ])
], resourceController.removeFromFavorites);

/**
 * @route   POST /api/resources/:id/report
 * @desc    Report a resource
 * @access  Private
 */
router.post('/:id/report', [
  authenticate,
  validate([
    param('id').isMongoId(),
    body('reason').isIn(['inappropriate', 'spam', 'fraud', 'copyright', 'other']),
    body('description').optional().isLength({ max: 500 })
  ])
], resourceController.reportResource);

/**
 * @route   GET /api/resources/nearby
 * @desc    Get nearby resources
 * @access  Public
 */
router.get('/nearby', [
  validate([
    query('lat').isFloat({ min: -90, max: 90 }),
    query('lng').isFloat({ min: -180, max: 180 }),
    query('radius').optional().isInt({ min: 1, max: 100 }),
    query('category').optional().isIn(['electronics', 'furniture', 'tools', 'vehicles', 'books', 'sports', 'clothing', 'kitchen', 'garden', 'food', 'other']),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ])
], resourceController.getNearbyResources);

/**
 * @route   GET /api/resources/categories
 * @desc    Get all categories with counts
 * @access  Public
 */
router.get('/categories', resourceController.getCategories);

/**
 * @route   GET /api/resources/trending
 * @desc    Get trending resources
 * @access  Public
 */
router.get('/trending', [
  validate([
    query('period').optional().isIn(['day', 'week', 'month']),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ])
], resourceController.getTrendingResources);

export default router;