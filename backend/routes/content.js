import express from 'express';
import { body, param } from 'express-validator';
import Blog from '../models/Blog.js';
import Community from '../models/Community.js';
import Contribution from '../models/Contribution.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import validate from '../middleware/validate.js';

const router = express.Router();

const hasValidUrl = (value) => !value || /^https?:\/\//i.test(value) || /^\/api\/images\//i.test(value);

const normalizeTags = (req, res, next) => {
  if (typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }
  next();
};
const contentValidation = [
  body('title').trim().isLength({ min: 2, max: 140 }),
  body('type').trim().isLength({ min: 2, max: 48 }),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('link').optional({ values: 'falsy' }).custom(hasValidUrl).withMessage('Link must be a valid http(s) URL'),
  body('order').optional().isInt({ min: 0 }),
  body('published').optional().isBoolean(),
];

const communityValidation = [
  body('name').trim().isLength({ min: 2, max: 120 }),
  body('role').trim().isLength({ min: 2, max: 120 }),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('link').optional({ values: 'falsy' }).custom(hasValidUrl).withMessage('Link must be a valid http(s) URL'),
  body('order').optional().isInt({ min: 0 }),
  body('published').optional().isBoolean(),
];

const blogValidation = [
  body('title').trim().isLength({ min: 2, max: 160 }).withMessage('Title must be 2-160 characters'),
  body('slug').trim().isSlug().withMessage('Slug must be lowercase words separated by hyphens'),
  body('excerpt').trim().isLength({ min: 10, max: 360 }).withMessage('Excerpt must be 10-360 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('coverImage').optional({ values: 'falsy' }).custom(hasValidUrl).withMessage('Cover image must be a valid http(s) URL or uploaded image path'),
  body('tags').optional().isArray({ max: 12 }).withMessage('Tags must be a list of at most 12 items'),
  body('tags.*').optional().trim().isLength({ min: 1, max: 32 }).withMessage('Each tag must be 1-32 characters'),
  body('published').optional().isBoolean(),
];

const idValidation = [param('id').isMongoId(), validate];

router.get('/contributions', asyncHandler(async (req, res) => {
  const items = await Contribution.find({ published: true }).sort({ order: 1, createdAt: -1 });
  res.json(items);
}));

router.get('/community', asyncHandler(async (req, res) => {
  const items = await Community.find({ published: true }).sort({ order: 1, createdAt: -1 });
  res.json(items);
}));

router.get('/blogs', asyncHandler(async (req, res) => {
  const items = await Blog.find({ published: true })
    .select('-content')
    .sort({ publishedAt: -1, createdAt: -1 });
  res.json(items);
}));

router.get('/blogs/:slug', asyncHandler(async (req, res) => {
  const item = await Blog.findOne({ slug: req.params.slug, published: true });
  if (!item) return res.status(404).json({ message: 'Blog post not found' });
  res.json(item);
}));

router.get('/admin/contributions', protect, asyncHandler(async (req, res) => {
  res.json(await Contribution.find().sort({ order: 1, createdAt: -1 }));
}));
router.post('/admin/contributions', protect, contentValidation, validate, asyncHandler(async (req, res) => {
  res.status(201).json(await Contribution.create(req.body));
}));
router.put('/admin/contributions/:id', protect, param('id').isMongoId(), contentValidation, validate, asyncHandler(async (req, res) => {
  const item = await Contribution.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Contribution not found' });
  res.json(item);
}));
router.delete('/admin/contributions/:id', protect, idValidation, asyncHandler(async (req, res) => {
  const item = await Contribution.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Contribution not found' });
  res.status(204).end();
}));

router.get('/admin/community', protect, asyncHandler(async (req, res) => {
  res.json(await Community.find().sort({ order: 1, createdAt: -1 }));
}));
router.post('/admin/community', protect, communityValidation, validate, asyncHandler(async (req, res) => {
  res.status(201).json(await Community.create(req.body));
}));
router.put('/admin/community/:id', protect, param('id').isMongoId(), communityValidation, validate, asyncHandler(async (req, res) => {
  const item = await Community.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Community entry not found' });
  res.json(item);
}));
router.delete('/admin/community/:id', protect, idValidation, asyncHandler(async (req, res) => {
  const item = await Community.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Community entry not found' });
  res.status(204).end();
}));

router.get('/admin/blogs', protect, asyncHandler(async (req, res) => {
  res.json(await Blog.find().sort({ updatedAt: -1 }));
}));
router.post('/admin/blogs', protect, normalizeTags, blogValidation, validate, asyncHandler(async (req, res) => {
  res.status(201).json(await Blog.create(req.body));
}));
router.put('/admin/blogs/:id', protect, param('id').isMongoId(), normalizeTags, blogValidation, validate, asyncHandler(async (req, res) => {
  const item = await Blog.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Blog post not found' });
  Object.assign(item, req.body);
  if (req.body.published === false) item.publishedAt = null;
  if (req.body.published === true && !item.publishedAt) item.publishedAt = new Date();
  await item.save();
  res.json(item);
}));
router.delete('/admin/blogs/:id', protect, idValidation, asyncHandler(async (req, res) => {
  const item = await Blog.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Blog post not found' });
  res.status(204).end();
}));

export default router;
