import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Imported first: this loads .env and exits the process on missing config,
// so nothing below ever runs against a half-configured environment.
import { config, cloudinaryEnabled, isOriginAllowed } from './config/env.js';
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

const app = express();

// Must be set before the rate limiters read req.ip. Render terminates TLS at a
// managed proxy, so exactly one hop of X-Forwarded-For is trusted.
app.set('trust proxy', config.trustProxy);

// Security headers. This is a JSON/binary API, so a locked-down CSP is safe:
// no documents are ever served from here. CORP is relaxed so images can be
// embedded from the Netlify origin.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"],
    }
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Gzip JSON responses. Media types that are already compressed are skipped
// automatically by the compressible check inside this middleware.
app.use(compression());

// CORS: only the configured site origins may call the API directly. Note that
// when the frontend goes through the Netlify proxy the request is same-origin
// and CORS is not involved at all.
app.use(cors({
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    const error = new Error(`Origin ${origin} is not allowed by CORS`);
    error.status = 403;
    return callback(error);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  maxAge: 3600
}));

// Image uploads carry base64 payloads, so they need a larger parser ceiling than
// the rest of the API. Mounting it on the exact path means every other route
// falls through to the 1mb parser below, which is a much smaller abuse surface.
app.use('/api/images/upload', express.json({ limit: '8mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Concise logs locally, standard combined logs in production for log drains.
app.use(morgan(config.isProduction ? 'combined' : 'dev'));

// Broad ceiling across the whole API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' }
});

// Brute-force protection for the admin login. Successful requests are not
// counted, so a legitimate admin is never locked out by their own logins.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: 'Too many authentication attempts. Try again in 15 minutes.' }
});

app.use('/api', apiLimiter);

// Routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
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

// Health check. Kept dependency-free so it stays fast when a monitor polls it.
// In production it exposes only liveness so the response cannot be used to
// fingerprint the environment or storage backend.
app.get('/api/health', (req, res) => {
  if (config.isProduction) {
    return res.json({ status: 'OK' });
  }

  res.json({
    status: 'OK',
    message: 'Portfolio API is running',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    imageStorage: cloudinaryEnabled ? 'cloudinary' : 'mongodb'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid resource id' });
  if (err.code === 11000) return res.status(409).json({ message: 'A record with that value already exists' });
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((item) => ({ field: item.path, message: item.message }))
    });
  }

  const status = err.status || 500;
  if (status >= 500) {
    console.error(err.stack);
  }

  res.status(status).json({
    message: status >= 500 && config.isProduction ? 'Something went wrong!' : err.message
  });
});

const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`Image storage: ${cloudinaryEnabled ? 'Cloudinary' : 'MongoDB (base64)'}`);
      });

      // Render sends SIGTERM on redeploy and when a free service spins down.
      // Draining in-flight requests avoids dropped responses during deploys.
      const shutdown = (signal) => {
        console.log(`${signal} received, shutting down gracefully...`);
        server.close(async () => {
          try {
            await mongoose.connection.close();
          } catch (error) {
            console.error(`Error closing MongoDB connection: ${error.message}`);
          }
          process.exit(0);
        });

        // Never hang a deploy if a connection refuses to drain.
        setTimeout(() => process.exit(1), 10000).unref();
      };

      ['SIGTERM', 'SIGINT'].forEach((signal) => {
        process.on(signal, () => shutdown(signal));
      });
    })
    .catch((error) => {
      console.error(`Database connection failed: ${error.message}`);
      process.exit(1);
    });
}

process.on('unhandledRejection', (reason) => {
  console.error(`Unhandled rejection: ${reason instanceof Error ? reason.stack : reason}`);
});

process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception: ${error.stack || error.message}`);
  process.exit(1);
});

export default app;
