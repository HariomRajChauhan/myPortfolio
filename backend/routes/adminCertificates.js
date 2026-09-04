import express from 'express';
import Certificate from '../models/Certificate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET all certificates (protected)
router.get('/', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ date: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE certificate (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
