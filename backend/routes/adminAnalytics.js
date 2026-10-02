import express from 'express';
import Visit from '../models/Visit.js';
import Project from '../models/Project.js';
import Certificate from '../models/Certificate.js';
import Contact from '../models/Contact.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET analytics (protected)
router.get('/', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [totalVisits, todayVisits, projects, certificates, contacts] = await Promise.all([
      Visit.countDocuments(),
      Visit.countDocuments({ visitedAt: { $gte: today } }),
      Project.countDocuments(),
      Certificate.countDocuments(),
      Contact.countDocuments(),
    ]);

    res.json({
      total: totalVisits,
      today: todayVisits,
      count: totalVisits,
      projects,
      certificates,
      contacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
