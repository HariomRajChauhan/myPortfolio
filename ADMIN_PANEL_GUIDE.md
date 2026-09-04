# Admin Panel - Complete Management System

## Overview
The admin panel provides full CRUD (Create, Read, Update, Delete) operations for all portfolio content. Access it at `http://localhost:5173/admin` (or your deployed URL).

## Login Credentials (Development)
- **Username**: `admin`
- **Password**: `admin123`
- ⚠️ **Change this in production!**

## Features by Section

### 📊 Dashboard Overview
- Total visits analytics
- Quick stats on projects, certificates, contacts
- Recent activity overview

### 💼 Projects Manager
**Capabilities:**
- ✅ Add new projects
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ Mark as featured
- ✅ Add/remove tech stack tags
- ✅ Set GitHub & Live demo URLs
- ✅ Upload custom project images

**Fields:**
- Title (required)
- Short description (required)
- Long description
- Tech stack (multi-value)
- GitHub URL
- Live demo URL
- Image URL
- Featured toggle

### 🏆 Certificates Manager
**Capabilities:**
- ✅ Add new certificates
- ✅ Edit existing certificates
- ✅ Delete certificates
- ✅ Link to credential URLs

**Fields:**
- Title (required)
- Issuer organization (required)
- Issue date
- Credential URL
- Description

### 🎓 Education Manager
**Capabilities:**
- ✅ Add education entries
- ✅ Edit existing entries
- ✅ Delete entries
- ✅ Mark as currently studying

**Fields:**
- Institution name (required)
- Degree (required)
- Field of study
- Start date
- End date
- Expected graduation toggle
- Description

### 💪 Experience Manager
**Capabilities:**
- ✅ Add work experience
- ✅ Edit existing experience
- ✅ Delete experience
- ✅ Mark as current position
- ✅ Add multiple achievements

**Fields:**
- Job title (required)
- Company/Organization (required)
- Location
- Start date
- End date (disabled if current)
- Currently working toggle
- Description
- Key achievements (multi-value)

### 🎬 Videos Manager
**Capabilities:**
- ✅ Add new videos
- ✅ Edit existing videos
- ✅ Delete videos
- ✅ Mark as featured
- ✅ Set custom thumbnails

**Fields:**
- Title (required)
- Description
- Video URL (YouTube, etc.) (required)
- Thumbnail image URL
- Duration
- Published date
- Featured toggle

### 📧 Contact Messages
**Capabilities:**
- ✅ View all contact form submissions
- ✅ Filter by read/unread status
- ✅ Mark messages as read
- ✅ Reply directly via email
- ✅ Delete messages
- ✅ View message details in side-by-side layout

**Features:**
- Unread count badge
- Filter tabs (All, Unread, Read)
- One-click reply button
- Timestamp display
- Full message preview

## Security

### Authentication
- JWT-based authentication
- Token expires after 7 days
- Protected API routes
- Automatic redirect to login if not authenticated

### Best Practices
1. Change default password before production
2. Use HTTPS in production
3. Store JWT_SECRET in environment variables
4. Implement rate limiting for login attempts

## Technical Details

### Frontend Components
- `AdminDashboard.jsx` - Main dashboard layout
- `AdminSidebar.jsx` - Navigation sidebar
- `DashboardOverview.jsx` - Analytics overview
- `ProjectsManager.jsx` - Projects CRUD
- `CertificatesManager.jsx` - Certificates CRUD
- `EducationManager.jsx` - Education CRUD
- `ExperienceManager.jsx` - Experience CRUD
- `VideosManager.jsx` - Videos CRUD
- `ContactMessages.jsx` - Contact messages viewer

### Backend Routes (Protected)
```
GET    /api/projects          - Get all projects
POST   /api/projects          - Create project
PUT    /api/projects/:id      - Update project
DELETE /api/projects/:id      - Delete project

GET    /api/certificates      - Get all certificates
POST   /api/certificates      - Create certificate
PUT    /api/certificates/:id  - Update certificate
DELETE /api/certificates/:id  - Delete certificate

GET    /api/education         - Get all education
POST   /api/education         - Create education
PUT    /api/education/:id     - Update education
DELETE /api/education/:id     - Delete education

GET    /api/experience        - Get all experience
POST   /api/experience        - Create experience
PUT    /api/experience/:id    - Update experience
DELETE /api/experience/:id    - Delete experience

GET    /api/videos            - Get all videos
POST   /api/videos            - Create video
PUT    /api/videos/:id        - Update video
DELETE /api/videos/:id        - Delete video

GET    /api/contacts          - Get all contacts
DELETE /api/contacts/:id      - Delete contact
PATCH  /api/contacts/:id/read - Mark as read

GET    /api/analytics         - Get visit analytics
```

## Usage Workflow

1. **Login** at `/admin/login`
2. **Navigate** using sidebar menu
3. **View** existing content in cards/grid
4. **Click "Add New"** to create content
5. **Click "Edit"** on any item to modify
6. **Click "Delete"** to remove (with confirmation)
7. **Fill form** in modal dialog
8. **Submit** to save changes
9. **Logout** when done

## Data Persistence

### Development Mode (server-dev.js)
- Data stored in memory
- Resets on server restart
- No database required
- Perfect for testing

### Production Mode (server.js)
- MongoDB Atlas database
- Persistent storage
- Automatic backups
- Scalable

## Deployment Checklist

- [ ] Change admin password
- [ ] Set up MongoDB Atlas
- [ ] Configure environment variables
- [ ] Enable HTTPS
- [ ] Set up CORS for production domain
- [ ] Test all CRUD operations
- [ ] Verify authentication works
- [ ] Test mobile responsiveness

## Support

For issues or feature requests, check the backend logs at `/tmp/backend.log` or browser console for errors.
