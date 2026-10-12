import express from 'express';
import mongoose from 'mongoose';
import Image from '../models/Image.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { cloudinaryEnabled, uploadImage, deleteImage } from '../config/cloudinary.js';

const router = express.Router();

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const DATA_URL_PATTERN = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i;

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// Upload image (protected)
router.post('/upload', protect, asyncHandler(async (req, res) => {
  const { filename, data, contentType, size } = req.body;

  if (!filename || !data || !contentType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Reject anything that is not an inline base64 image before it is stored or
  // forwarded to Cloudinary.
  if (typeof data !== 'string' || !DATA_URL_PATTERN.test(data)) {
    return res.status(400).json({ message: 'Malformed image payload' });
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' });
  }

  if (Number(size) > MAX_SIZE_BYTES) {
    return res.status(400).json({ message: 'File size exceeds 5MB limit' });
  }

  if (cloudinaryEnabled) {
    const uploaded = await uploadImage(data);
    const image = await Image.create({
      filename,
      contentType,
      size: uploaded.bytes || Number(size),
      provider: 'cloudinary',
      url: uploaded.url,
      publicId: uploaded.publicId,
      uploadedBy: req.admin.id
    });

    // An absolute CDN URL means the browser fetches the file directly, so
    // neither Netlify nor Render pays for image bandwidth.
    return res.status(201).json({
      id: image._id,
      url: uploaded.url,
      filename: image.filename,
      contentType: image.contentType,
      size: image.size,
      provider: 'cloudinary'
    });
  }

  const image = await Image.create({
    filename,
    data,
    contentType,
    size: Number(size),
    provider: 'mongodb',
    uploadedBy: req.admin.id
  });

  return res.status(201).json({
    id: image._id,
    url: `/api/images/${image._id}`,
    filename: image.filename,
    contentType: image.contentType,
    size: image.size,
    provider: 'mongodb'
  });
}));

// Get image by ID (public)
router.get('/:id', asyncHandler(async (req, res) => {
  if (!isObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Image not found' });
  }

  const image = await Image.findById(req.params.id);
  if (!image) {
    return res.status(404).json({ message: 'Image not found' });
  }

  // Legacy records predate the provider field
  const provider = image.provider || 'mongodb';

  if (provider === 'cloudinary') {
    // Hand off to the CDN. Relative URLs stored in content still resolve
    // because the redirect is transparent to <img src>.
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    return res.redirect(301, image.url);
  }

  if (!image.data) {
    return res.status(404).json({ message: 'Image not found' });
  }

  res.set('Content-Type', image.contentType);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(Buffer.from(image.data.split(',')[1], 'base64'));
}));

// Get all images (protected)
router.get('/', protect, asyncHandler(async (req, res) => {
  const images = await Image.find()
    .select('-data')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(images.map((img) => ({
    id: img._id,
    url: img.provider === 'cloudinary' ? img.url : `/api/images/${img._id}`,
    filename: img.filename,
    contentType: img.contentType,
    size: img.size,
    provider: img.provider || 'mongodb',
    uploadedAt: img.createdAt
  })));
}));

// Delete image (protected)
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  if (!isObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Image not found' });
  }

  const image = await Image.findById(req.params.id);
  if (!image) {
    return res.status(404).json({ message: 'Image not found' });
  }

  if ((image.provider || 'mongodb') === 'cloudinary' && image.publicId && cloudinaryEnabled) {
    await deleteImage(image.publicId);
  }

  await image.deleteOne();
  res.status(204).end();
}));

export default router;
