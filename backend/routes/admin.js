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

// In-memory data storage for dev mode
let experiences = [
  {
    _id: '1',
    title: 'Technical Manager',
    company: 'ACES (Association of Computer Engineering Students)',
    location: 'IOE Purwanchal Campus, Dharan',
    startDate: new Date('2023-01-01'),
    endDate: null,
    description: 'Leading technical initiatives and managing student engineering projects',
    highlights: ['Organized technical workshops', 'Managed student projects', 'Coordinated tech events'],
    order: 1
  },
  {
    _id: '2',
    title: 'Graphics Designer',
    company: 'ACES',
    location: 'IOE Purwanchal Campus, Dharan',
    startDate: new Date('2021-06-01'),
    endDate: new Date('2023-01-01'),
    description: 'Created visual content for events and campaigns',
    highlights: ['Designed event posters', 'Created social media graphics', 'Branding materials'],
    order: 2
  },
  {
    _id: '3',
    title: 'Graphics Lead',
    company: 'Taranga: The Wave of Technology',
    location: 'National Techfest',
    startDate: new Date('2022-09-01'),
    endDate: new Date('2022-12-01'),
    description: 'Led graphics team for national-level technology festival',
    highlights: ['Managed design team', 'Created event branding', 'Designed promotional materials'],
    order: 3
  }
];

let educations = [
  {
    _id: '1',
    institution: 'IOE Purwanchal Campus',
    degree: 'Bachelor of Engineering',
    field: 'Computer Engineering',
    location: 'Dharan, Nepal',
    startDate: new Date('2021-09-01'),
    endDate: null,
    gpa: '',
    description: 'Currently in 3rd year, 2nd part. Roll No. PUR080BCT033',
    order: 1
  }
];

// Get all experiences
router.get('/experiences', auth, (req, res) => {
  res.json(experiences);
});

// Create experience
router.post('/experiences', auth, (req, res) => {
  try {
    const { title, company, location, startDate, endDate, description, highlights, order } = req.body;
    
    if (!title || !company || !startDate) {
      return res.status(400).json({ message: 'Title, company, and start date are required' });
    }

    const newExperience = {
      _id: Date.now().toString(),
      title,
      company,
      location: location || '',
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      description: description || '',
      highlights: highlights || [],
      order: order || experiences.length + 1
    };

    experiences.push(newExperience);
    res.status(201).json(newExperience);
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ message: 'Server error while creating experience' });
  }
});

// Update experience
router.put('/experiences/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, startDate, endDate, description, highlights, order } = req.body;
    
    const index = experiences.findIndex(exp => exp._id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    experiences[index] = {
      ...experiences[index],
      title: title || experiences[index].title,
      company: company || experiences[index].company,
      location: location !== undefined ? location : experiences[index].location,
      startDate: startDate ? new Date(startDate) : experiences[index].startDate,
      endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : experiences[index].endDate,
      description: description !== undefined ? description : experiences[index].description,
      highlights: highlights || experiences[index].highlights,
      order: order !== undefined ? order : experiences[index].order
    };

    res.json(experiences[index]);
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ message: 'Server error while updating experience' });
  }
});

// Delete experience
router.delete('/experiences/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const index = experiences.findIndex(exp => exp._id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    experiences.splice(index, 1);
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ message: 'Server error while deleting experience' });
  }
});

// Get all educations
router.get('/educations', auth, (req, res) => {
  res.json(educations);
});

// Create education
router.post('/educations', auth, (req, res) => {
  try {
    const { institution, degree, field, location, startDate, endDate, gpa, description, order } = req.body;
    
    if (!institution || !degree || !startDate) {
      return res.status(400).json({ message: 'Institution, degree, and start date are required' });
    }

    const newEducation = {
      _id: Date.now().toString(),
      institution,
      degree,
      field: field || '',
      location: location || '',
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      gpa: gpa || '',
      description: description || '',
      order: order || educations.length + 1
    };

    educations.push(newEducation);
    res.status(201).json(newEducation);
  } catch (error) {
    console.error('Create education error:', error);
    res.status(500).json({ message: 'Server error while creating education' });
  }
});

// Update education
router.put('/educations/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { institution, degree, field, location, startDate, endDate, gpa, description, order } = req.body;
    
    const index = educations.findIndex(edu => edu._id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Education not found' });
    }

    educations[index] = {
      ...educations[index],
      institution: institution || educations[index].institution,
      degree: degree || educations[index].degree,
      field: field !== undefined ? field : educations[index].field,
      location: location !== undefined ? location : educations[index].location,
      startDate: startDate ? new Date(startDate) : educations[index].startDate,
      endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : educations[index].endDate,
      gpa: gpa !== undefined ? gpa : educations[index].gpa,
      description: description !== undefined ? description : educations[index].description,
      order: order !== undefined ? order : educations[index].order
    };

    res.json(educations[index]);
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ message: 'Server error while updating education' });
  }
});

// Delete education
router.delete('/educations/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const index = educations.findIndex(edu => edu._id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Education not found' });
    }

    educations.splice(index, 1);
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ message: 'Server error while deleting education' });
  }
});

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
