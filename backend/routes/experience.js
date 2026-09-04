const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Experience = require('../models/Experience');

// Get all experience entries
router.get('/', auth, async (req, res) => {
  try {
    const experience = await Experience.find().sort({ startDate: -1 });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new experience entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, location, startDate, endDate, current, description, achievements } = req.body;
    
    const experience = new Experience({
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      description,
      achievements
    });

    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update experience entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, company, location, startDate, endDate, current, description, achievements } = req.body;
    
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { title, company, location, startDate, endDate, current, description, achievements },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete experience entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
