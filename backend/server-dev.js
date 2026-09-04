import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const app = express();

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

let visitCount = 0;
let resumeData = {
  fileName: 'Hariom_Chauhan_Resume.pdf',
  filePath: '/resumes/Hariom_Chauhan_Resume.pdf',
  downloadCount: 0
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

// Videos (empty for now)
app.get('/api/videos', (req, res) => {
  res.json([]);
});

// Resume
app.get('/api/resume', (req, res) => {
  res.json(resumeData);
});

app.post('/api/resume/download', (req, res) => {
  resumeData.downloadCount += 1;
  res.json({ downloadCount: resumeData.downloadCount, filePath: resumeData.filePath });
});

// Contact form (log to console)
app.post('/api/contact', (req, res) => {
  console.log('📩 New contact form submission:', req.body);
  res.status(201).json({ message: 'Contact form submitted successfully' });
});

// Visit tracking
app.post('/api/visit', (req, res) => {
  visitCount += 1;
  res.json({ message: 'Visit logged', totalVisits: visitCount });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running (development mode)' });
});

// Auth endpoints (mock)
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'Admin created successfully (mock)' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ token: 'mock-jwt-token', username: 'admin' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
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
  console.log(`   ⚠️  Data is stored in memory and will reset on restart`);
});

export default app;
