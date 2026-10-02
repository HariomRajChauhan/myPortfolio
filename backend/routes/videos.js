import express from 'express';
import { body, param } from 'express-validator';
import Video from '../models/Video.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';
import validate from '../middleware/validate.js';

const router = express.Router();
const channelUrl = 'https://www.youtube.com/@techhrch/videos';

const getYouTubeId = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1);
    return parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop();
  } catch {
    return null;
  }
};

const serializeVideo = (video) => {
  const data = video.toObject ? video.toObject() : video;
  const youtubeId = data.youtubeId || getYouTubeId(data.youtubeUrl);
  return {
    ...data,
    youtubeId,
    embedUrl: youtubeId ? `https://www.youtube-nocookie.com/embed/${youtubeId}` : null,
    thumbnailUrl: data.thumbnailUrl || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null),
  };
};

const videoValidation = [
  body('title').trim().isLength({ min: 2, max: 180 }),
  body('description').trim().isLength({ min: 2, max: 5000 }),
  body('youtubeUrl').trim().isURL().withMessage('A valid YouTube URL is required'),
  body('thumbnailUrl').optional({ values: 'falsy' }).isURL(),
  body('publishedAt').optional().isISO8601(),
];

router.get('/', asyncHandler(async (req, res) => {
  const videos = await Video.find().sort({ publishedAt: -1 });
  res.json({ videos: videos.map(serializeVideo), channelUrl });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  res.json(serializeVideo(video));
}));

router.post('/', protect, videoValidation, validate, asyncHandler(async (req, res) => {
  const youtubeId = getYouTubeId(req.body.youtubeUrl);
  if (!youtubeId) return res.status(422).json({ message: 'A valid YouTube video URL is required' });
  const video = await Video.create({ ...req.body, youtubeId });
  res.status(201).json(serializeVideo(video));
}));

router.put('/:id', protect, param('id').isMongoId(), videoValidation, validate, asyncHandler(async (req, res) => {
  const youtubeId = getYouTubeId(req.body.youtubeUrl);
  if (!youtubeId) return res.status(422).json({ message: 'A valid YouTube video URL is required' });
  const video = await Video.findByIdAndUpdate(req.params.id, { ...req.body, youtubeId }, { new: true, runValidators: true });
  if (!video) return res.status(404).json({ message: 'Video not found' });
  res.json(serializeVideo(video));
}));

router.delete('/:id', protect, param('id').isMongoId(), validate, asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndDelete(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  res.status(204).end();
}));

export default router;
