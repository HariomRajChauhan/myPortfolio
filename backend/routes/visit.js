import express from 'express';
import Visit from '../models/Visit.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const ipAddress = req.ip || 'unknown';
  const userAgent = req.get('user-agent') || 'unknown';
  const referrer = req.get('referer') || null;
  await Visit.create({ ipAddress, userAgent, referrer });
  res.status(201).json({ success: true });
}));

router.get('/', asyncHandler(async (req, res) => {
  res.json({ count: await Visit.countDocuments() });
}));

router.get('/stats', protect, asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [totalVisits, todayVisits, uniqueVisitors, recentVisits] = await Promise.all([
    Visit.countDocuments(),
    Visit.countDocuments({ visitedAt: { $gte: today } }),
    Visit.distinct('ipAddress').then((addresses) => addresses.length),
    Visit.find().sort({ visitedAt: -1 }).limit(10).select('-userAgent'),
  ]);
  res.json({ totalVisits, todayVisits, uniqueVisitors, recentVisits });
}));

export default router;
