import express from 'express';
import Resume from '../models/Resume.js';

const router = express.Router();

// GET resume info (public)
router.get('/', async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ uploadedAt: -1 });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST increment download count (public)
router.post('/download', async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ uploadedAt: -1 });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }
    resume.downloadCount += 1;
    await resume.save();
    res.json({ downloadCount: resume.downloadCount, filePath: resume.filePath });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update resume (protected)
router.put('/', async (req, res) => {
  try {
    let resume = await Resume.findOne();
    if (resume) {
      resume.fileName = req.body.fileName || resume.fileName;
      resume.filePath = req.body.filePath || resume.filePath;
      await resume.save();
      res.json(resume);
    } else {
      resume = new Resume(req.body);
      const savedResume = await resume.save();
      res.status(201).json(savedResume);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
