import express from 'express';
import Image from '../models/Image.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Upload image (protected)
router.post('/upload', protect, asyncHandler(async (req, res) => {
  const { filename, data, contentType, size } = req.body;

  if (!filename || !data || !contentType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate file size (max 5MB)
  if (size > 5 * 1024 * 1024) {
    return res.status(400).json({ message: 'File size exceeds 5MB limit' });
  }

  // Validate content type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(contentType)) {
    return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' });
  }

  const image = await Image.create({
    filename,
    data,
    contentType,
    size,
    uploadedBy: req.admin.id
  });

  res.status(201).json({
    id: image._id,
    url: `/api/images/${image._id}`,
    filename: image.filename,
    contentType: image.contentType,
    size: image.size
  });
}));

// Get image by ID (public)
router.get('/:id', asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  
  if (!image) {
    return res.status(404).json({ message: 'Image not found' });
  }

  // Set proper content type header
  res.set('Content-Type', image.contentType);
  res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  
  // Send base64 data as buffer
  const buffer = Buffer.from(image.data.split(',')[1], 'base64');
  res.send(buffer);
}));

// Get all images (protected)
router.get('/', protect, asyncHandler(async (req, res) => {
  const images = await Image.find()
    .select('-data')
    .sort({ createdAt: -1 })
    .limit(100);
  
  res.json(images.map(img => ({
    id: img._id,
    url: `/api/images/${img._id}`,
    filename: img.filename,
    contentType: img.contentType,
    size: img.size,
    uploadedAt: img.createdAt
  })));
}));

// Delete image (protected)
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const image = await Image.findByIdAndDelete(req.params.id);
  
  if (!image) {
    return res.status(404).json({ message: 'Image not found' });
  }

  res.status(204).end();
}));

export default router;
