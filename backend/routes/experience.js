import express from 'express';
import { body, param } from 'express-validator';
import Experience from '../models/Experience.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import validate from '../middleware/validate.js';

const router = express.Router();
const experienceValidation = [
  body('title').trim().isLength({ min: 2, max: 140 }),
  body('company').trim().isLength({ min: 2, max: 140 }),
  body('location').optional().trim().isLength({ max: 140 }),
  body('startDate').isISO8601(),
  body('endDate').optional({ values: 'falsy' }).isISO8601(),
  body('current').optional().isBoolean(),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('achievements').optional().isArray({ max: 12 }),
  body('achievements.*').optional().trim().isLength({ min: 1, max: 240 }),
  body('order').optional().isInt({ min: 0 }),
];

router.get('/', asyncHandler(async (req, res) => {
  res.json(await Experience.find().sort({ current: -1, startDate: -1, order: 1 }));
}));

router.post('/', protect, experienceValidation, validate, asyncHandler(async (req, res) => {
  res.status(201).json(await Experience.create(req.body));
}));

router.put('/:id', protect, param('id').isMongoId(), experienceValidation, validate, asyncHandler(async (req, res) => {
  const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!experience) return res.status(404).json({ message: 'Experience not found' });
  res.json(experience);
}));

router.delete('/:id', protect, param('id').isMongoId(), validate, asyncHandler(async (req, res) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);
  if (!experience) return res.status(404).json({ message: 'Experience not found' });
  res.status(204).end();
}));

export default router;
