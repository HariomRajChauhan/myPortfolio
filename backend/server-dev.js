import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Load env vars
dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// In-memory data store (for development without MongoDB)
let projects = [
  {
    _id: '1',
    title: 'Smart Multi-Crop Disease Detection and Yield Prediction',
    description: 'AI-powered system using CNN for disease detection and LSTM for yield prediction. Developed as a 4-member team for Software Engineering minor project (ENCT 352).',
    objective: 'Help farmers identify crop diseases early and predict yields using deep learning.',
    techStack: ['Python', 'TensorFlow', 'CNN', 'LSTM', 'OpenCV', 'Flask'],
    githubUrl: null,
    liveUrl: null,
    imageUrl: '/placeholder-project.png',
    featured: true,
    order: 1
  },
  {
    _id: '2',
    title: 'TCP-Based Web Server (WEB_server)',
    description: 'Framework-free HTTP server built in C++17 with socket and server abstraction layers. Implements HTTP/1.1 protocol from scratch.',
    objective: 'Deep understanding of networking, sockets, and HTTP protocol implementation.',
    techStack: ['C++17', 'Socket Programming', 'TCP/IP', 'HTTP/1.1', 'Linux'],
    githubUrl: 'https://github.com/HariomRajChauhan/WEB_server',
    liveUrl: null,
    imageUrl: '/placeholder-project.png',
    featured: true,
    order: 2
  },
  {
    _id: '3',
    title: 'Feelings - React Native App',
    description: 'Mobile application for mood tracking and emotional wellbeing built with React Native.',
    objective: 'Create an intuitive mobile experience for mental health awareness.',
    techStack: ['React Native', 'JavaScript', 'Firebase', 'Redux'],
    githubUrl: null,
    liveUrl: null,
    imageUrl: '/placeholder-project.png',
    featured: true,
    order: 3
  },
  {
    _id: '4',
    title: 'Exe_Cleaner',
    description: 'Utility tool for cleaning executable files and optimizing system performance.',
    objective: 'Automate system cleanup tasks efficiently.',
    techStack: ['C++', 'Windows API', 'System Programming'],
    githubUrl: null,
    liveUrl: null,
    imageUrl: '/placeholder-project.png',
    featured: false,
    order: 4
  },
  {
    _id: '5',
    title: 'Personal Portfolio (hariomchauhan.com.np)',
    description: 'Full-stack MERN portfolio with JWT-authenticated admin panel, deployed on Netlify and Render.',
    objective: 'Showcase projects and skills with a professional online presence.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'TailwindCSS'],
    githubUrl: 'https://github.com/HariomRajChauhan',
    liveUrl: 'https://hariomchauhan.com.np',
    imageUrl: '/placeholder-project.png',
    featured: true,
    order: 0
  }
];

let certificates = [
  {
    _id: '1',
    title: 'Full Stack Web Development',
    issuer: 'freeCodeCamp',
    date: new Date('2024-01-15'),
    credentialUrl: null,
    imageUrl: '/placeholder-certificate.png'
  },
  {
    _id: '2',
    title: 'Machine Learning Specialization',
    issuer: 'Coursera - Stanford University',
    date: new Date('2023-11-20'),
    credentialUrl: null,
    imageUrl: '/placeholder-certificate.png'
  },
  {
    _id: '3',
    title: 'UI/UX Design Fundamentals',
    issuer: 'Google Career Certificates',
    date: new Date('2023-08-10'),
    credentialUrl: null,
    imageUrl: '/placeholder-certificate.png'
  }
];

let videos = [];

let contacts = [];
let visitCount = 0;
let resumeData = {
  fileName: 'Hariom_Chauhan_Resume.pdf',
  filePath: '/resumes/Hariom_Chauhan_Resume.pdf',
  downloadCount: 0
};

// Education entries
let education = [
  {
    _id: '1',
    institution: 'IOE Purwanchal Campus',
    degree: 'Bachelor of Engineering',
    field: 'Computer Engineering',
    startDate: new Date('2021-09-01'),
    endDate: null,
    expected: true,
    description: 'Currently in 3rd year, 2nd part. Roll No. PUR080BCT033',
    createdAt: new Date()
  }
];

// Experience entries
let experience = [
  {
    _id: '1',
    title: 'Technical Manager',
    company: 'ACES (Association of Computer Engineering Students)',
    location: 'Dharan, Nepal',
    startDate: new Date('2023-01-01'),
    endDate: null,
    current: true,
    description: 'Leading technical initiatives and managing student engineering programs.',
    achievements: [
      'Organized multiple technical workshops and hackathons',
      'Managed team of 15+ volunteers',
      'Coordinated with industry professionals for guest lectures'
    ],
    createdAt: new Date()
  },
  {
    _id: '2',
    title: 'Graphics Designer',
    company: 'ACES (Association of Computer Engineering Students)',
    location: 'Dharan, Nepal',
    startDate: new Date('2022-01-01'),
    endDate: new Date('2023-12-31'),
    current: false,
    description: 'Created visual content for events and campaigns over 2 years.',
    achievements: [
      'Designed 50+ posters, banners, and promotional materials',
      'Developed brand identity for major campus events',
      'Mentored junior designers in graphic design principles'
    ],
    createdAt: new Date()
  },
  {
    _id: '3',
    title: 'Graphics Lead',
    company: 'Taranga: The Wave of Technology',
    location: 'Nepal',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-09-30'),
    current: false,
    description: 'Led graphics team for national-level technology festival.',
    achievements: [
      'Managed graphics for 1000+ participant event',
      'Created cohesive visual identity across all platforms',
      'Coordinated with marketing team for campaign rollout'
    ],
    createdAt: new Date()
  }
];

// Mock admin (in production, this would be in MongoDB)
let admin = {
  _id: '1',
  username: 'admin',
  password: bcrypt.hashSync('admin123', 10)
};

// Auth middleware for dev
const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    // For dev, just check if token exists (not validating signature)
    req.admin = { id: '1' };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes

// Projects
app.get('/api/projects', (req, res) => {
  const sorted = [...projects].sort((a, b) => {
    if (b.featured !== a.featured) return b.featured - a.featured;
    return a.order - b.order;
  });
  res.json(sorted);
});

// Certificates
app.get('/api/certificates', (req, res) => {
  res.json(certificates);
});

// Videos (protected admin routes)
app.get('/api/videos', protect, (req, res) => {
  const sorted = [...videos].sort((a, b) => {
    if (b.featured !== a.featured) return b.featured - a.featured;
    return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
  });
  res.json(sorted);
});

app.post('/api/videos', protect, (req, res) => {
  const newVideo = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  videos.push(newVideo);
  res.status(201).json(newVideo);
});

app.put('/api/videos/:id', protect, (req, res) => {
  const index = videos.findIndex(v => v._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Video not found' });
  }
  videos[index] = { ...videos[index], ...req.body };
  res.json(videos[index]);
});

app.delete('/api/videos/:id', protect, (req, res) => {
  videos = videos.filter(v => v._id !== req.params.id);
  res.json({ message: 'Video deleted successfully' });
});

// Resume
app.get('/api/resume', (req, res) => {
  res.json(resumeData);
});

app.post('/api/resume/download', (req, res) => {
  resumeData.downloadCount += 1;
  res.json({ downloadCount: resumeData.downloadCount, filePath: resumeData.filePath });
});

app.post('/api/resume', (req, res) => {
  resumeData.downloadCount += 1;
  res.json({ downloadCount: resumeData.downloadCount, filePath: resumeData.filePath });
});

// Contact form (log to console and store)
app.post('/api/contact', (req, res) => {
  const newContact = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };
  contacts.push(newContact);
  console.log('📩 New contact form submission:', req.body);
  res.status(201).json({ message: 'Contact form submitted successfully' });
});

// Visit tracking
app.post('/api/visit', (req, res) => {
  visitCount += 1;
  res.json({ message: 'Visit logged', totalVisits: visitCount });
});

app.get('/api/visit', (req, res) => {
  res.json({ totalVisits: visitCount });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running (development mode)' });
});

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (admin) {
    return res.status(400).json({ message: 'Admin already exists' });
  }
  admin = {
    _id: '1',
    username,
    password: await bcrypt.hash(password, 10)
  };
  res.status(201).json({ message: 'Admin created successfully' });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!admin || username !== admin.username) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: admin.username });
});

// Admin routes (protected)
app.get('/api/admin/contacts', protect, (req, res) => {
  res.json(contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.delete('/api/admin/contacts/:id', protect, (req, res) => {
  contacts = contacts.filter(c => c._id !== req.params.id);
  res.json({ message: 'Contact deleted successfully' });
});

app.get('/api/admin/projects', protect, (req, res) => {
  res.json(projects);
});

app.delete('/api/admin/projects/:id', protect, (req, res) => {
  projects = projects.filter(p => p._id !== req.params.id);
  res.json({ message: 'Project deleted successfully' });
});

app.get('/api/admin/certificates', protect, (req, res) => {
  res.json(certificates);
});

app.delete('/api/admin/certificates/:id', protect, (req, res) => {
  certificates = certificates.filter(c => c._id !== req.params.id);
  res.json({ message: 'Certificate deleted successfully' });
});

app.get('/api/admin/analytics', protect, (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // For simplicity in dev mode, just return total
  res.json({
    total: visitCount,
    today: Math.floor(visitCount / 10) // Mock today's visits
  });
});

// Education routes
app.get('/api/education', protect, (req, res) => {
  res.json(education);
});

app.post('/api/education', protect, (req, res) => {
  const newEdu = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  education.push(newEdu);
  res.status(201).json(newEdu);
});

app.put('/api/education/:id', protect, (req, res) => {
  const index = education.findIndex(e => e._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Education not found' });
  }
  education[index] = { ...education[index], ...req.body };
  res.json(education[index]);
});

app.delete('/api/education/:id', protect, (req, res) => {
  education = education.filter(e => e._id !== req.params.id);
  res.json({ message: 'Education deleted successfully' });
});

// Experience routes
app.get('/api/experience', protect, (req, res) => {
  res.json(experience);
});

app.post('/api/experience', protect, (req, res) => {
  const newExp = {
    _id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  experience.push(newExp);
  res.status(201).json(newExp);
});

app.put('/api/experience/:id', protect, (req, res) => {
  const index = experience.findIndex(e => e._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Experience not found' });
  }
  experience[index] = { ...experience[index], ...req.body };
  res.json(experience[index]);
});

app.delete('/api/experience/:id', protect, (req, res) => {
  experience = experience.filter(e => e._id !== req.params.id);
  res.json({ message: 'Experience deleted successfully' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running in DEVELOPMENT MODE (no database) on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Projects: http://localhost:${PORT}/api/projects`);
  console.log(`   Admin login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   ⚠️  Data is stored in memory and will reset on restart`);
  console.log(`   📝 Default admin: admin / admin123`);
});

export default app;
