import express from 'express';
import { body, param } from 'express-validator';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import validate from '../middleware/validate.js';

const router = express.Router();

const normalizeProject = (project) => {
  const data = project.toObject ? project.toObject() : project;
  return {
    ...data,
    github: data.github || data.githubUrl || null,
    liveDemo: data.liveDemo || data.liveUrl || null,
  };
};

const projectValidation = [
  body('title').trim().isLength({ min: 2, max: 140 }),
  body('description').trim().isLength({ min: 10, max: 1200 }),
  body('objective').optional().trim().isLength({ max: 1200 }),
  body('longDescription').optional().trim().isLength({ max: 5000 }),
  body('techStack').optional().isArray({ max: 20 }),
  body('techStack.*').optional().trim().isLength({ min: 1, max: 40 }),
  body('githubUrl').optional({ values: 'falsy' }).isURL(),
  body('liveUrl').optional({ values: 'falsy' }).isURL(),
  body('imageUrl').optional({ values: 'falsy' }).isString().isLength({ max: 1000 }),
  body('featured').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }),
];

router.get('/', asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ featured: -1, order: 1, createdAt: -1 });
  res.json(projects.map(normalizeProject));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(normalizeProject(project));
}));

router.post('/', protect, projectValidation, validate, asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(normalizeProject(project));
}));

router.put('/:id', protect, param('id').isMongoId(), projectValidation, validate, asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(normalizeProject(project));
}));

router.delete('/:id', protect, param('id').isMongoId(), validate, asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.status(204).end();
}));

export default router;
