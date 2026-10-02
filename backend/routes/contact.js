import express from 'express';
import { body, param } from 'express-validator';
import Contact from '../models/Contact.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import validate from '../middleware/validate.js';

const router = express.Router();
const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('subject').trim().isLength({ min: 2, max: 160 }),
  body('message').trim().isLength({ min: 10, max: 5000 }),
];

router.post('/', contactValidation, validate, asyncHandler(async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({ success: true, message: 'Message sent successfully', id: contact.id });
}));

router.get('/', protect, asyncHandler(async (req, res) => {
  res.json(await Contact.find().sort({ createdAt: -1 }));
}));

router.patch('/:id/status', protect, param('id').isMongoId(), body('status').isIn(['new', 'read', 'replied']), validate, asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.json(contact);
}));

router.delete('/:id', protect, param('id').isMongoId(), validate, asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.status(204).end();
}));

export default router;
