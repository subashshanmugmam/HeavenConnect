import User from '../models/User.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadService } from '../services/uploadService.js';

/**
 * User Controller
 */
class UserController {
  /**
   * Get current user profile
   */
  getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .populate('communities.communityId', 'name description')
      .select('-password -refreshTokens');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  });

  /**
   * Update user profile
   */
  updateProfile = asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      bio,
      dateOfBirth,
      location,
      skills,
      interests,
      preferences
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;
    
    // Update location
    if (location) {
      if (location.coordinates) {
        user.location.coordinates = location.coordinates;
      }
      if (location.address) {
        user.location.address = { ...user.location.address, ...location.address };
      }
      if (location.privacy) {
        user.location.privacy = location.privacy;
      }
    }

    // Update preferences
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    // Remove sensitive fields from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshTokens;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse
    });
  });

  /**
   * Upload user avatar
   */
  uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError('Please provide an image file', 400);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete old avatar if exists
    if (user.avatar.publicId) {
      await uploadService.deleteImage(user.avatar.publicId);
    }

    // Upload new avatar
    const result = await uploadService.uploadImage(req.file.buffer, {
      folder: 'avatars',
      width: 300,
      height: 300,
      crop: 'fill'
    });

    user.avatar = {
      url: result.secure_url,
      publicId: result.public_id
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: user.avatar
      }
    });
  });

  /**
   * Remove user avatar
   */
  removeAvatar = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete avatar from cloud storage
    if (user.avatar.publicId) {
      await uploadService.deleteImage(user.avatar.publicId);
    }

    user.avatar = {
      url: undefined,
      publicId: undefined
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar removed successfully'
    });
  });

  /**
   * Get user settings
   */
  getSettings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .select('notifications privacy preferences twoFactorAuth');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        notifications: user.notifications,
        privacy: user.privacy,
        preferences: user.preferences,
        twoFactorAuth: {
          enabled: user.twoFactorAuth.enabled
        }
      }
    });
  });

  /**
   * Update user settings
   */
  updateSettings = asyncHandler(async (req, res) => {
    const { notifications, privacy, preferences } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (notifications) {
      user.notifications = { ...user.notifications, ...notifications };
    }

    if (privacy) {
      user.privacy = { ...user.privacy, ...privacy };
    }

    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        notifications: user.notifications,
        privacy: user.privacy,
        preferences: user.preferences
      }
    });
  });

  /**
   * Search users
   */
  searchUsers = asyncHandler(async (req, res) => {
    const {
      q,
      location,
      skills,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      select: 'firstName lastName avatar bio location skills trustScore',
      sort: { trustScore: -1, createdAt: -1 }
    };

    // Text search
    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ];
    }

    // Location-based search
    if (location) {
      const [lng, lat, radius = 10000] = location.split(',').map(Number);
      filter['location.coordinates'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radius
        }
      };
    }

    // Skills filter
    if (skills) {
      const skillArray = skills.split(',');
      filter.skills = { $in: skillArray };
    }

    // Exclude current user
    filter._id = { $ne: req.user._id };

    const users = await User.paginate(filter, options);

    res.status(200).json({
      success: true,
      data: users
    });
  });

  /**
   * Get user by ID
   */
  getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate('communities.communityId', 'name description')
      .select('-password -refreshTokens -email -phone');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check privacy settings
    const isCurrentUser = req.user._id.toString() === id;
    if (!isCurrentUser && user.privacy.profileVisibility === 'private') {
      throw new AppError('This profile is private', 403);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  });

  /**
   * Follow a user
   */
  followUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === id) {
      throw new AppError('You cannot follow yourself', 400);
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(id)
    ]);

    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    // Check if already following
    const isAlreadyFollowing = currentUser.following.some(
      followId => followId.toString() === id
    );

    if (isAlreadyFollowing) {
      throw new AppError('You are already following this user', 400);
    }

    // Add to following/followers
    currentUser.following.push(id);
    targetUser.followers.push(currentUserId);

    await Promise.all([
      currentUser.save(),
      targetUser.save()
    ]);

    res.status(200).json({
      success: true,
      message: 'User followed successfully'
    });
  });

  /**
   * Unfollow a user
   */
  unfollowUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(id)
    ]);

    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    // Remove from following/followers
    currentUser.following = currentUser.following.filter(
      followId => followId.toString() !== id
    );
    targetUser.followers = targetUser.followers.filter(
      followerId => followerId.toString() !== currentUserId.toString()
    );

    await Promise.all([
      currentUser.save(),
      targetUser.save()
    ]);

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully'
    });
  });

  /**
   * Get user followers
   */
  getFollowers = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const followers = await User.paginate(
      { _id: { $in: user.followers } },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        select: 'firstName lastName avatar bio trustScore'
      }
    );

    res.status(200).json({
      success: true,
      data: followers
    });
  });

  /**
   * Get users followed by user
   */
  getFollowing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const following = await User.paginate(
      { _id: { $in: user.following } },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        select: 'firstName lastName avatar bio trustScore'
      }
    );

    res.status(200).json({
      success: true,
      data: following
    });
  });

  /**
   * Report a user
   */
  reportUser = asyncHandler(async (req, res) => {
    const { userId, reason, description } = req.body;
    const reporterId = req.user._id;

    if (reporterId.toString() === userId) {
      throw new AppError('You cannot report yourself', 400);
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    // Check if already reported
    const existingReport = targetUser.reports.find(
      report => report.reporterId.toString() === reporterId.toString()
    );

    if (existingReport) {
      throw new AppError('You have already reported this user', 400);
    }

    // Add report
    targetUser.reports.push({
      reporterId,
      reason,
      description,
      createdAt: new Date()
    });

    await targetUser.save();

    res.status(200).json({
      success: true,
      message: 'User reported successfully'
    });
  });

  /**
   * Delete user account
   */
  deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Delete user avatar from cloud storage
    const user = await User.findById(userId);
    if (user.avatar.publicId) {
      await uploadService.deleteImage(user.avatar.publicId);
    }

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  });
}

export default new UserController();