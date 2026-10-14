import express from 'express';
import rateLimit from 'express-rate-limit';
import Visit from '../models/Visit.js';
import { protect } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// The visit endpoint is unauthenticated, so it is rate limited separately and
// more tightly than the general API ceiling to limit storage-growth abuse.
const visitLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many visits logged. Please slow down.' }
});

const MAX_HEADER_LENGTH = 512;
const DEDUPE_WINDOW_MS = 30 * 1000;

router.post('/', visitLimiter, asyncHandler(async (req, res) => {
  // Cap and stringify every stored value: these come from client headers and
  // are otherwise unlimited in length.
  const ipAddress = String(req.ip || 'unknown').slice(0, 64);

  // Collapse rapid repeat hits from the same IP (page refreshes, double mounts)
  // into a single Visit record.
  const recent = await Visit.findOne({
    ipAddress,
    visitedAt: { $gte: new Date(Date.now() - DEDUPE_WINDOW_MS) }
  }).select('_id').lean();

  if (recent) {
    return res.status(200).json({ success: true, deduped: true });
  }

  const userAgent = String(req.get('user-agent') || 'unknown').slice(0, MAX_HEADER_LENGTH);
  const referrer = (req.get('referer') || '').slice(0, MAX_HEADER_LENGTH) || null;

  await Visit.create({ ipAddress, userAgent, referrer });
  res.status(201).json({ success: true });
}));

router.get('/', asyncHandler(async (req, res) => {
  res.json({ count: await Visit.countDocuments() });
}));

router.get('/stats', protect, asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [totalVisits, todayVisits, uniqueResult, recentVisits] = await Promise.all([
    Visit.countDocuments(),
    Visit.countDocuments({ visitedAt: { $gte: today } }),
    // Aggregation streams the count server-side; distinct() would load every
    // unique IP into memory and is capped at 16MB of results.
    Visit.aggregate([{ $group: { _id: '$ipAddress' } }, { $count: 'total' }]),
    Visit.find().sort({ visitedAt: -1 }).limit(10).select('-userAgent'),
  ]);
  res.json({
    totalVisits,
    todayVisits,
    uniqueVisitors: uniqueResult[0]?.total || 0,
    recentVisits,
  });
}));

export default router;
