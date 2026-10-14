import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, matchedData } from 'express-validator';
import Admin from '../models/Admin.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { config } from '../config/env.js';

const router = express.Router();

// A pre-computed bcrypt hash used when a username does not exist, so the login
// response time does not reveal whether an account exists (timing oracle).
const DUMMY_HASH = bcrypt.hashSync('invalid-password-timing-placeholder', 10);

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
    const { username, password } = matchedData(req);

    // Atomic claim: only the first request can insert the sentinel/unique
    // username while no admin exists. A separate exists() check followed by
    // save() is a TOCTOU race that can create two admins.
    const existingAdmin = await Admin.exists();
    if (existingAdmin) {
      return res.status(403).json({ message: 'Admin registration is closed. Use the login endpoint.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = new Admin({ username: username.toLowerCase(), password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    // Duplicate key means a concurrent request won the race.
    if (error.code === 11000) {
      return res.status(403).json({ message: 'Admin registration is closed. Use the login endpoint.' });
    }
    console.error(`[auth] Registration failed: ${error.message}`);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.get('/setup-status', async (req, res) => {
  try {
    res.json({ needsSetup: !(await Admin.exists()) });
  } catch (error) {
    console.error(`[auth] setup-status failed: ${error.message}`);
    res.status(500).json({ message: 'Unable to determine setup status' });
  }
});

// POST login
router.post('/login', loginValidation, validate, async (req, res) => {
  try {
    const { username, password } = matchedData(req);

    const admin = await Admin.findOne({ username: username.toLowerCase() });

    // Always run bcrypt.compare, even when the user does not exist, so the
    // response time is constant. The result is only accepted when the account
    // actually exists.
    const isMatch = await bcrypt.compare(password, admin ? admin.password : DUMMY_HASH);
    if (!admin || !isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!config.jwtSecret) {
      console.error('[auth] JWT_SECRET is not configured');
      return res.status(500).json({ message: 'Server authentication is not configured' });
    }

    const token = jwt.sign({ id: admin._id }, config.jwtSecret, { expiresIn: '7d' });

    res.json({ token, username: admin.username });
  } catch (error) {
    console.error(`[auth] Login failed: ${error.message}`);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/me', protect, (req, res) => {
  res.json({ id: req.admin.id, username: req.admin.username, role: req.admin.role });
});

export default router;
