import express from 'express';
import { body } from 'express-validator';
import Resume from '../models/Resume.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const resume = await Resume.findOne().sort({ uploadedAt: -1 });
  if (!resume) return res.status(404).json({ message: 'No resume found' });
  res.json(resume);
}));

router.post('/download', asyncHandler(async (req, res) => {
  const resume = await Resume.findOne().sort({ uploadedAt: -1 });
  if (!resume) return res.status(404).json({ message: 'No resume found' });
  resume.downloadCount += 1;
  await resume.save();
  res.json({ downloadUrl: resume.filePath, fileName: resume.fileName });
}));

router.put('/', protect, [
  body('fileName').trim().isLength({ min: 1, max: 160 }),
  body('filePath').trim().isLength({ min: 1, max: 1000 }),
], validate, asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndUpdate(
    {},
    { fileName: req.body.fileName, filePath: req.body.filePath, uploadedAt: new Date() },
    { new: true, upsert: true, runValidators: true },
  );
  res.json(resume);
}));

export default router;
