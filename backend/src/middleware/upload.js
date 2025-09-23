import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from './errorHandler.js';
import logger from '../utils/logger.js';

// Ensure upload directories exist
const uploadDirs = [
  'uploads/images/profiles',
  'uploads/images/resources',
  'uploads/images/communities', 
  'uploads/images/messages',
  'uploads/documents/verification',
  'uploads/documents/resources',
  'uploads/temp'
];

const ensureUploadDirs = async () => {
  for (const dir of uploadDirs) {
    try {
      await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
    } catch (error) {
      logger.error(`Failed to create upload directory ${dir}:`, error);
    }
  }
};

// Initialize upload directories
ensureUploadDirs();

/**
 * File filter function
 */
const createFileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`, 400), false);
    }
  };
};

/**
 * Storage configuration for different file types
 */
const createStorage = (destination) => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), destination);
      try {
        await fs.mkdir(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } catch (error) {
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = uuidv4();
      const extension = path.extname(file.originalname);
      const filename = `${uniqueSuffix}${extension}`;
      cb(null, filename);
    }
  });
};

/**
 * Image upload configurations
 */
export const profileImageUpload = multer({
  storage: createStorage('uploads/images/profiles'),
  fileFilter: createFileFilter(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

export const resourceImageUpload = multer({
  storage: createStorage('uploads/images/resources'),
  fileFilter: createFileFilter(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10
  }
});

export const communityImageUpload = multer({
  storage: createStorage('uploads/images/communities'),
  fileFilter: createFileFilter(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

export const messageImageUpload = multer({
  storage: createStorage('uploads/images/messages'),
  fileFilter: createFileFilter(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  }
});

/**
 * Document upload configurations
 */
export const verificationDocumentUpload = multer({
  storage: createStorage('uploads/documents/verification'),
  fileFilter: createFileFilter([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
    files: 5
  }
});

export const resourceDocumentUpload = multer({
  storage: createStorage('uploads/documents/resources'),
  fileFilter: createFileFilter([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
    files: 3
  }
});

/**
 * General file upload for messages
 */
export const messageFileUpload = multer({
  storage: createStorage('uploads/temp'),
  fileFilter: createFileFilter([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'audio/mpeg',
    'audio/wav',
    'video/mp4',
    'video/webm'
  ]),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 5
  }
});

/**
 * Image processing middleware
 */
export const processImage = (options = {}) => {
  return async (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }

    try {
      const files = req.files || [req.file];
      const processedFiles = [];

      for (const file of files) {
        if (!file.mimetype.startsWith('image/')) {
          processedFiles.push(file);
          continue;
        }

        const originalPath = file.path;
        const processedPath = originalPath.replace(path.extname(originalPath), '_processed.webp');

        // Process image with sharp
        await sharp(originalPath)
          .resize(options.width || 1200, options.height || 1200, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: options.quality || 80 })
          .toFile(processedPath);

        // Remove original file
        await fs.unlink(originalPath);

        // Update file information
        file.path = processedPath;
        file.filename = path.basename(processedPath);
        file.mimetype = 'image/webp';

        // Generate thumbnail if requested
        if (options.thumbnail) {
          const thumbnailPath = processedPath.replace('_processed.webp', '_thumbnail.webp');
          await sharp(processedPath)
            .resize(options.thumbnail.width || 200, options.thumbnail.height || 200, {
              fit: 'cover'
            })
            .webp({ quality: 70 })
            .toFile(thumbnailPath);

          file.thumbnail = {
            path: thumbnailPath,
            filename: path.basename(thumbnailPath)
          };
        }

        processedFiles.push(file);
      }

      if (req.files) {
        req.files = processedFiles;
      } else {
        req.file = processedFiles[0];
      }

      next();
    } catch (error) {
      logger.error('Image processing error:', error);
      next(new AppError('Failed to process image', 500));
    }
  };
};

/**
 * File cleanup middleware for error cases
 */
export const cleanupFiles = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;

  const cleanup = async () => {
    if (res.statusCode >= 400) {
      const files = req.files || (req.file ? [req.file] : []);
      
      for (const file of files) {
        try {
          await fs.unlink(file.path);
          if (file.thumbnail) {
            await fs.unlink(file.thumbnail.path);
          }
        } catch (error) {
          logger.error(`Failed to cleanup file ${file.path}:`, error);
        }
      }
    }
  };

  res.send = function(...args) {
    cleanup();
    return originalSend.apply(this, args);
  };

  res.json = function(...args) {
    cleanup();
    return originalJson.apply(this, args);
  };

  next();
};

/**
 * File URL generation helper
 */
export const generateFileUrl = (req, filepath) => {
  if (!filepath) return null;
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const relativePath = filepath.replace(process.cwd(), '').replace(/\\/g, '/');
  return `${baseUrl}${relativePath}`;
};

/**
 * File metadata extraction
 */
export const extractFileMetadata = async (file) => {
  const stats = await fs.stat(file.path);
  
  const metadata = {
    originalName: file.originalname,
    filename: file.filename,
    mimetype: file.mimetype,
    size: stats.size,
    uploadDate: stats.birthtime,
    path: file.path
  };

  // Extract image metadata if it's an image
  if (file.mimetype.startsWith('image/')) {
    try {
      const imageMetadata = await sharp(file.path).metadata();
      metadata.image = {
        width: imageMetadata.width,
        height: imageMetadata.height,
        format: imageMetadata.format,
        hasAlpha: imageMetadata.hasAlpha,
        orientation: imageMetadata.orientation
      };
    } catch (error) {
      logger.error('Failed to extract image metadata:', error);
    }
  }

  return metadata;
};

/**
 * Virus scanning middleware (placeholder for future implementation)
 */
export const virusScan = (req, res, next) => {
  // Placeholder for virus scanning integration
  // Could integrate with ClamAV or other antivirus solutions
  next();
};

/**
 * File validation middleware
 */
export const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return next(new AppError('No file uploaded', 400));
  }

  const files = req.files || [req.file];
  
  for (const file of files) {
    // Check file size
    if (file.size === 0) {
      return next(new AppError('Empty file uploaded', 400));
    }

    // Check file extension matches mimetype
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeToExt = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm']
    };

    const allowedExtensions = mimeToExt[file.mimetype];
    if (allowedExtensions && !allowedExtensions.includes(extension)) {
      return next(new AppError(`File extension ${extension} does not match file type ${file.mimetype}`, 400));
    }
  }

  next();
};

export default {
  profileImage: profileImageUpload,
  resourceImage: resourceImageUpload,
  communityImage: communityImageUpload,
  messageImage: messageImageUpload,
  verificationDocument: verificationDocumentUpload,
  resourceDocument: resourceDocumentUpload,
  messageFile: messageFileUpload,
  processImage,
  cleanupFiles,
  generateFileUrl,
  extractFileMetadata,
  virusScan,
  validateFileUpload
};