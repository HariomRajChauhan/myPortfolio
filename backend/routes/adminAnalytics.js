import express from 'express';
import Visit from '../models/Visit.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET analytics (protected)
router.get('/', protect, async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();
    
    // Get today's visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisits = await Visit.countDocuments({ createdAt: { $gte: today } });
    
    res.json({
      total: totalVisits,
      today: todayVisits
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
