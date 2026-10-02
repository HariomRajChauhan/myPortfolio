import express from 'express';
import { body, param } from 'express-validator';
import Certificate from '../models/Certificate.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import validate from '../middleware/validate.js';

const router = express.Router();
const certificateValidation = [
  body('title').trim().isLength({ min: 2, max: 160 }),
  body('issuer').trim().isLength({ min: 2, max: 160 }),
  body('date').isISO8601(),
  body('credentialUrl').optional({ values: 'falsy' }).isURL(),
  body('imageUrl').optional({ values: 'falsy' }).isString().isLength({ max: 1000 }),
  body('description').optional().trim().isLength({ max: 1000 }),
];

router.get('/', asyncHandler(async (req, res) => {
  res.json(await Certificate.find().sort({ date: -1, createdAt: -1 }));
}));

router.post('/', protect, certificateValidation, validate, asyncHandler(async (req, res) => {
  res.status(201).json(await Certificate.create(req.body));
}));

router.put('/:id', protect, param('id').isMongoId(), certificateValidation, validate, asyncHandler(async (req, res) => {
  const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
  res.json(certificate);
}));

router.delete('/:id', protect, param('id').isMongoId(), validate, asyncHandler(async (req, res) => {
  const certificate = await Certificate.findByIdAndDelete(req.params.id);
  if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
  res.status(204).end();
}));

export default router;
