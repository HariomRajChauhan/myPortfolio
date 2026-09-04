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
import adminContactsRoutes from './routes/adminContacts.js';
import adminProjectsRoutes from './routes/adminProjects.js';
import adminCertificatesRoutes from './routes/adminCertificates.js';
import adminAnalyticsRoutes from './routes/adminAnalytics.js';

// Import middleware
import { protect } from './middleware/auth.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Admin routes (protected)
app.use('/api/admin/contacts', adminContactsRoutes);
app.use('/api/admin/projects', adminProjectsRoutes);
app.use('/api/admin/certificates', adminCertificatesRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);

// Protected admin routes example
app.get('/api/admin/stats', protect, async (req, res) => {
  // Import models dynamically to avoid circular dependencies
  const Project = (await import('./models/Project.js')).default;
  const Certificate = (await import('./models/Certificate.js')).default;
  const Contact = (await import('./models/Contact.js')).default;
  const Visit = (await import('./models/Visit.js')).default;

  try {
    const projectCount = await Project.countDocuments();
    const certificateCount = await Certificate.countDocuments();
    const contactCount = await Contact.countDocuments();
    const visitCount = await Visit.countDocuments();

    res.json({
      projects: projectCount,
      certificates: certificateCount,
      contacts: contactCount,
      visits: visitCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
