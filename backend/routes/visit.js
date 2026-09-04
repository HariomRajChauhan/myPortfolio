import express from 'express';
import Visit from '../models/Visit.js';

const router = express.Router();

// POST log visit (public)
router.post('/', async (req, res) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const referrer = req.headers['referer'] || req.headers['referrer'] || null;

    const visit = new Visit({ ipAddress, userAgent, referrer });
    await visit.save();

    // Get total visit count
    const totalVisits = await Visit.countDocuments();
    res.json({ message: 'Visit logged', totalVisits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET visit stats (protected)
router.get('/stats', async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();
    const uniqueVisitors = await Visit.distinct('ipAddress').then(arr => arr.length);
    const recentVisits = await Visit.find().sort({ visitedAt: -1 }).limit(10);

    res.json({
      totalVisits,
      uniqueVisitors,
      recentVisits
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
