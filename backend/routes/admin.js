const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

// In-memory admin storage (for dev mode without database)
let adminData = {
  username: 'admin',
  passwordHash: bcrypt.hashSync('admin123', 10)
};

// Login endpoint
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check username
    if (username !== adminData.username) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = bcrypt.compareSync(password, adminData.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: adminData.username, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        username: adminData.username,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get admin profile (protected)
router.get('/profile', auth, (req, res) => {
  res.json({
    admin: {
      username: adminData.username,
      role: 'admin'
    }
  });
});

// Change password (protected)
router.put('/change-password', auth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    // Verify current password
    const isPasswordValid = bcrypt.compareSync(currentPassword, adminData.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and update new password
    adminData.passwordHash = bcrypt.hashSync(newPassword, 10);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
});

module.exports = router;
