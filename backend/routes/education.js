const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Education = require('../models/Education');

// Get all education entries
router.get('/', auth, async (req, res) => {
  try {
    const education = await Education.find().sort({ startDate: -1 });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new education entry
router.post('/', auth, async (req, res) => {
  try {
    const { institution, degree, field, startDate, endDate, expected, description } = req.body;
    
    const education = new Education({
      institution,
      degree,
      field,
      startDate,
      endDate,
      expected,
      description
    });

    await education.save();
    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update education entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { institution, degree, field, startDate, endDate, expected, description } = req.body;
    
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      { institution, degree, field, startDate, endDate, expected, description },
      { new: true, runValidators: true }
    );

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    res.json(education);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete education entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);

    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
