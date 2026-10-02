import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import projectRoutes from './routes/projects.js';
import certificateRoutes from './routes/certificates.js';
import videoRoutes from './routes/videos.js';
import resumeRoutes from './routes/resume.js';
import contactRoutes from './routes/contact.js';
import visitRoutes from './routes/visit.js';
import authRoutes from './routes/auth.js';
import adminAnalyticsRoutes from './routes/adminAnalytics.js';
import experienceRoutes from './routes/experience.js';
import educationRoutes from './routes/education.js';
import contentRoutes from './routes/content.js';
import githubRoutes from './routes/github.js';
import imageRoutes from './routes/images.js';

// Import middleware
import { protect } from './middleware/auth.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean) || [];
app.use(cors({
  origin(origin, callback) {
    const normalizedOrigin = origin?.replace(/\/$/, '');
    if (!normalizedOrigin || allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Trust proxy for correct IP behind reverse proxy
app.set('trust proxy', true);

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/visit', visitRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api', contentRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/images', imageRoutes);

app.use('/api/admin/analytics', adminAnalyticsRoutes);

app.use('/api/admin', protect, (req, res) => {
  res.status(404).json({ message: 'Admin route not found' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid resource id' });
  if (err.code === 11000) return res.status(409).json({ message: 'A record with that value already exists' });
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error(`Database connection failed: ${error.message}`);
      process.exit(1);
    });
}

export default app;
