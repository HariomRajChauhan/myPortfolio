import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Fail fast: a misconfigured deploy should never start and serve broken
// requests, so required variables are checked before the app is created.
const validate = () => {
  const required = isProduction
    ? ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGIN']
    : ['MONGODB_URI'];

  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    console.error(`[config] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (isProduction && process.env.JWT_SECRET.trim().length < 32) {
    console.error('[config] JWT_SECRET must be at least 32 characters in production.');
    process.exit(1);
  }
};

validate();

const parseOrigins = (value) =>
  (value || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Entries may contain a '*' to match any host, e.g. https://*.netlify.app,
// which keeps Netlify deploy-preview URLs working without listing each one.
const originToPattern = (entry) => {
  const normalized = entry.replace(/\/$/, '');
  if (!normalized.includes('*')) return null;
  return new RegExp(`^${normalized.split('*').map(escapeRegex).join('.*')}$`);
};

const originPatterns = (parseValue) =>
  parseValue
    .map(originToPattern)
    .filter(Boolean);

const parseTrustProxy = (value) => {
  if (value === undefined || value === '') return 1;
  if (value === 'true') return true;
  if (value === 'false') return false;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? 1 : numeric;
};

export const config = {
  isProduction,
  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,

  clientOrigins: parseOrigins(process.env.CLIENT_ORIGIN),

  // Render terminates TLS at a managed proxy in front of the app, so exactly
  // one hop of X-Forwarded-For should be trusted. `true` is deliberately not
  // used: it lets clients spoof their IP and express-rate-limit rejects it.
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),

  github: {
    username: process.env.GITHUB_USERNAME || '',
    token: process.env.GITHUB_TOKEN || ''
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'hariom-portfolio'
  }
};

// Cloudinary is optional: without credentials the API transparently falls back
// to storing images as base64 in MongoDB.
export const cloudinaryEnabled = Boolean(
  config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret
);

// CORS gate: query-string-less same-origin requests (no Origin header) and
// unknown origins (server-to-server, CLI) are always allowed. Browser calls are
// admitted only when the Origin matches an explicit entry or wildcard pattern.
export const isOriginAllowed = (origin) => {
  // No Origin header at all: this is a same-origin request (the normal case for
  // the Netlify proxy) or a non-browser client, so CORS does not apply.
  if (origin === undefined || origin === null || origin === '') return true;

  // The literal "null" origin is sent by sandboxed iframes and file:// pages.
  // It is never legitimate here and is rejected.
  if (origin === 'null') return false;

  if (config.clientOrigins.length === 0) return true;

  const normalized = origin.replace(/\/$/, '');
  if (config.clientOrigins.includes(normalized)) return true;

  return originPatterns(config.clientOrigins).some((pattern) => pattern.test(normalized));
};

export default config;
