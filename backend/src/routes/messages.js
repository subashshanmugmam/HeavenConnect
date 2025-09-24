import express from 'express';
import messageController from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { body, param, query } from 'express-validator';
import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * @route   GET /api/messages/conversations
 * @desc    Get user's conversations
 * @access  Private
 */
router.get('/conversations', [
  authenticate,
  validate([
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('search').optional().isString()
  ])
], messageController.getConversations);

/**
 * @route   POST /api/messages/conversations
 * @desc    Start a new conversation
 * @access  Private
 */
router.post('/conversations', [
  authenticate,
  validate([
    body('participantId').isMongoId().withMessage('Valid participant ID is required'),
    body('initialMessage').optional().isLength({ min: 1, max: 1000 })
  ])
], messageController.startConversation);

/**
 * @route   GET /api/messages/conversations/:conversationId
 * @desc    Get messages in a conversation
 * @access  Private
 */
router.get('/conversations/:conversationId', [
  authenticate,
  validate([
    param('conversationId').isMongoId(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('before').optional().isMongoId()
  ])
], messageController.getMessages);

/**
 * @route   POST /api/messages/conversations/:conversationId
 * @desc    Send a message
 * @access  Private
 */
router.post('/conversations/:conversationId', [
  authenticate,
  upload.array('attachments', 5),
  validate([
    param('conversationId').isMongoId(),
    body('content').optional().isLength({ min: 1, max: 1000 }),
    body('type').optional().isIn(['text', 'image', 'file', 'location', 'contact']),
    body('replyTo').optional().isMongoId()
  ])
], messageController.sendMessage);

/**
 * @route   PUT /api/messages/:messageId/read
 * @desc    Mark message as read
 * @access  Private
 */
router.put('/:messageId/read', [
  authenticate,
  validate([
    param('messageId').isMongoId()
  ])
], messageController.markAsRead);

/**
 * @route   DELETE /api/messages/:messageId
 * @desc    Delete a message
 * @access  Private
 */
router.delete('/:messageId', [
  authenticate,
  validate([
    param('messageId').isMongoId()
  ])
], messageController.deleteMessage);

/**
 * @route   PUT /api/messages/:messageId/react
 * @desc    React to a message
 * @access  Private
 */
router.put('/:messageId/react', [
  authenticate,
  validate([
    param('messageId').isMongoId(),
    body('reaction').isIn(['like', 'love', 'laugh', 'angry', 'sad', 'wow'])
  ])
], messageController.reactToMessage);

/**
 * @route   DELETE /api/messages/:messageId/react
 * @desc    Remove reaction from message
 * @access  Private
 */
router.delete('/:messageId/react', [
  authenticate,
  validate([
    param('messageId').isMongoId()
  ])
], messageController.removeReaction);

/**
 * @route   POST /api/messages/conversations/:conversationId/typing
 * @desc    Send typing indicator
 * @access  Private
 */
router.post('/conversations/:conversationId/typing', [
  authenticate,
  validate([
    param('conversationId').isMongoId(),
    body('isTyping').isBoolean()
  ])
], messageController.sendTypingIndicator);

/**
 * @route   PUT /api/messages/conversations/:conversationId/mute
 * @desc    Mute/unmute conversation
 * @access  Private
 */
router.put('/conversations/:conversationId/mute', [
  authenticate,
  validate([
    param('conversationId').isMongoId(),
    body('muted').isBoolean(),
    body('muteUntil').optional().isISO8601()
  ])
], messageController.muteConversation);

/**
 * @route   DELETE /api/messages/conversations/:conversationId
 * @desc    Delete conversation
 * @access  Private
 */
router.delete('/conversations/:conversationId', [
  authenticate,
  validate([
    param('conversationId').isMongoId()
  ])
], messageController.deleteConversation);

/**
 * @route   GET /api/messages/search
 * @desc    Search messages
 * @access  Private
 */
router.get('/search', [
  authenticate,
  validate([
    query('q').isString().isLength({ min: 1 }),
    query('conversationId').optional().isMongoId(),
    query('fromDate').optional().isISO8601(),
    query('toDate').optional().isISO8601(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ])
], messageController.searchMessages);

/**
 * @route   GET /api/messages/unread-count
 * @desc    Get unread message count
 * @access  Private
 */
router.get('/unread-count', authenticate, messageController.getUnreadCount);

export default router;