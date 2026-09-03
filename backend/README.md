# Backend API - Hariom Chauhan Portfolio

Express.js + MongoDB backend for hariomchauhan.com.np

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong random string for JWT signing
   - `PORT`: Server port (default: 5000)

3. **Seed initial data**
   ```bash
   npm run seed
   ```

4. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get single project |
| GET | `/api/certificates` | Get all certificates |
| GET | `/api/videos` | Get all videos |
| GET | `/api/resume` | Get resume info |
| POST | `/api/resume/download` | Increment download count |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/visit` | Log a visit |
| GET | `/api/health` | Health check |

### Protected Routes (require JWT token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/certificates` | Create certificate |
| PUT | `/api/certificates/:id` | Update certificate |
| DELETE | `/api/certificates/:id` | Delete certificate |
| POST | `/api/videos` | Create video |
| PUT | `/api/videos/:id` | Update video |
| DELETE | `/api/videos/:id` | Delete video |
| PUT | `/api/resume` | Update resume |
| GET | `/api/contact` | Get all contacts |
| PUT | `/api/contact/:id` | Update contact status |
| GET | `/api/visit/stats` | Get visit statistics |
| GET | `/api/admin/stats` | Get dashboard stats |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register first admin (one-time) |
| POST | `/api/auth/login` | Login and get JWT token |

## Authentication Usage

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

Example with fetch:
```javascript
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(projectData)
});
```

## First-Time Admin Setup

1. Start the server
2. Register the first admin:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"your-secure-password"}'
   ```
3. Login to get token:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"your-secure-password"}'
   ```

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── Admin.js           # Admin user model
│   ├── Certificate.js     # Certificate model
│   ├── Contact.js         # Contact form model
│   ├── Project.js         # Project model
│   ├── Resume.js          # Resume model
│   ├── Video.js           # Video model
│   └── Visit.js           # Visit analytics model
├── routes/
│   ├── auth.js            # Auth routes
│   ├── certificates.js    # Certificate CRUD
│   ├── contact.js         # Contact form routes
│   ├── projects.js        # Project CRUD
│   ├── resume.js          # Resume routes
│   ├── videos.js          # Video CRUD
│   └── visit.js           # Visit tracking
├── scripts/
│   └── seed.js            # Database seeding script
├── .env                   # Environment variables (gitignore)
├── .env.example           # Example environment file
├── package.json
└── server.js              # Entry point
```

## Deployment (Render)

1. Connect your GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

## Development Tips

- Use MongoDB Compass or similar to inspect your database
- Test APIs with Postman or Thunder Client
- Check server logs for debugging
- Use `morgan` middleware for request logging
