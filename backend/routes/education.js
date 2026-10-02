import express from 'express';
import { body, param } from 'express-validator';
import Education from '../models/Education.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import validate from '../middleware/validate.js';

const router = express.Router();
const educationValidation = [
  body('institution').trim().isLength({ min: 2, max: 160 }),
  body('degree').trim().isLength({ min: 2, max: 160 }),
  body('field').optional().trim().isLength({ max: 160 }),
  body('location').optional().trim().isLength({ max: 160 }),
  body('startDate').isISO8601(),
  body('endDate').optional({ values: 'falsy' }).isISO8601(),
  body('expected').optional().isBoolean(),
  body('gpa').optional().trim().isLength({ max: 32 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('order').optional().isInt({ min: 0 }),
];

router.get('/', asyncHandler(async (req, res) => {
  res.json(await Education.find().sort({ expected: -1, startDate: -1, order: 1 }));
}));

router.post('/', protect, educationValidation, validate, asyncHandler(async (req, res) => {
  res.status(201).json(await Education.create(req.body));
}));

router.put('/:id', protect, param('id').isMongoId(), educationValidation, validate, asyncHandler(async (req, res) => {
  const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!education) return res.status(404).json({ message: 'Education entry not found' });
  res.json(education);
}));

router.delete('/:id', protect, param('id').isMongoId(), validate, asyncHandler(async (req, res) => {
  const education = await Education.findByIdAndDelete(req.params.id);
  if (!education) return res.status(404).json({ message: 'Education entry not found' });
  res.status(204).end();
}));

export default router;
