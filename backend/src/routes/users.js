import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { body, param, query } from 'express-validator';
import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', [
  authenticate,
  validate([
    body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
    body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
    body('bio').optional().isLength({ max: 500 }),
    body('location.address.street').optional().isString(),
    body('location.address.city').optional().isString(),
    body('location.address.state').optional().isString(),
    body('location.address.zipCode').optional().isString(),
    body('location.privacy').optional().isIn(['public', 'community', 'private'])
  ])
], userController.updateProfile);

/**
 * @route   POST /api/users/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
router.post('/avatar', 
  authenticate, 
  upload.single('avatar'), 
  userController.uploadAvatar
);

/**
 * @route   DELETE /api/users/avatar
 * @desc    Remove user avatar
 * @access  Private
 */
router.delete('/avatar', authenticate, userController.removeAvatar);

/**
 * @route   GET /api/users/settings
 * @desc    Get user settings
 * @access  Private
 */
router.get('/settings', authenticate, userController.getSettings);

/**
 * @route   PUT /api/users/settings
 * @desc    Update user settings
 * @access  Private
 */
router.put('/settings', [
  authenticate,
  validate([
    body('notifications.email').optional().isBoolean(),
    body('notifications.push').optional().isBoolean(),
    body('notifications.sms').optional().isBoolean(),
    body('privacy.showLocation').optional().isBoolean(),
    body('privacy.showContactInfo').optional().isBoolean(),
    body('preferences.language').optional().isIn(['en', 'es', 'fr', 'de']),
    body('preferences.theme').optional().isIn(['light', 'dark', 'auto'])
  ])
], userController.updateSettings);

/**
 * @route   GET /api/users/search
 * @desc    Search users
 * @access  Private
 */
router.get('/search', [
  authenticate,
  validate([
    query('q').optional().isString().isLength({ min: 1 }),
    query('location').optional().isString(),
    query('skills').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ])
], userController.searchUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', [
  authenticate,
  validate([
    param('id').isMongoId()
  ])
], userController.getUserById);

/**
 * @route   POST /api/users/:id/follow
 * @desc    Follow a user
 * @access  Private
 */
router.post('/:id/follow', [
  authenticate,
  validate([
    param('id').isMongoId()
  ])
], userController.followUser);

/**
 * @route   DELETE /api/users/:id/follow
 * @desc    Unfollow a user
 * @access  Private
 */
router.delete('/:id/follow', [
  authenticate,
  validate([
    param('id').isMongoId()
  ])
], userController.unfollowUser);

/**
 * @route   GET /api/users/:id/followers
 * @desc    Get user followers
 * @access  Private
 */
router.get('/:id/followers', [
  authenticate,
  validate([
    param('id').isMongoId(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ])
], userController.getFollowers);

/**
 * @route   GET /api/users/:id/following
 * @desc    Get users followed by user
 * @access  Private
 */
router.get('/:id/following', [
  authenticate,
  validate([
    param('id').isMongoId(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ])
], userController.getFollowing);

/**
 * @route   POST /api/users/report
 * @desc    Report a user
 * @access  Private
 */
router.post('/report', [
  authenticate,
  validate([
    body('userId').isMongoId(),
    body('reason').isIn(['spam', 'harassment', 'inappropriate', 'fraud', 'other']),
    body('description').optional().isLength({ max: 500 })
  ])
], userController.reportUser);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticate, userController.deleteAccount);

export default router;