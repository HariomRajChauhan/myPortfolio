import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import Admin from '../models/Admin.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// POST register admin (one-time setup)
const registrationValidation = [
  body('username').trim().isLength({ min: 3, max: 40 }),
  body('password').isLength({ min: 12, max: 128 }),
];

const loginValidation = [
  body('username').trim().isLength({ min: 1, max: 40 }),
  body('password').isLength({ min: 1, max: 128 }),
];

router.post('/register', registrationValidation, validate, async (req, res) => {
  try {
    const username = req.body.username.toLowerCase();
    const { password } = req.body;

    // Registration is only available until the first admin account exists.
    const existingAdmin = await Admin.exists();
    if (existingAdmin) {
      return res.status(403).json({ message: 'Admin registration is closed. Use the login endpoint.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({ username, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/setup-status', async (req, res) => {
  res.json({ needsSetup: !(await Admin.exists()) });
});

// POST login
router.post('/login', loginValidation, validate, async (req, res) => {
  try {
    const username = req.body.username.toLowerCase();
    const { password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server authentication is not configured' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, (req, res) => {
  res.json({ id: req.admin.id, username: req.admin.username, role: req.admin.role });
});

export default router;
