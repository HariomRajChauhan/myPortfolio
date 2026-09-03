# Hariom Chauhan Portfolio - Full Stack Application

**hariomchauhan.com.np** - Professional portfolio showcasing engineering skills and design sensibility.

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **react-simple-typewriter** for hero animations
- **Axios** for API calls
- Deployed on **Netlify**

### Backend
- **Node.js** + **Express.js**
- **MongoDB Atlas** (Mongoose ODM)
- **JWT** authentication
- **bcryptjs** for password hashing
- Deployed on **Render**

## 📁 Project Structure

```
/workspace
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── public/           # Static assets
│   ├── index.html        # HTML template
│   ├── package.json
│   ├── vite.config.js    # Vite configuration
│   └── tailwind.config.js
│
└── backend/              # Express API
    ├── config/           # Database connection
    ├── middleware/       # Auth middleware
    ├── models/           # Mongoose models
    ├── routes/           # API routes
    ├── scripts/          # Seed scripts
    ├── server.js         # Entry point
    ├── package.json
    └── .env              # Environment variables
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone & Setup

```bash
cd /workspace
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed initial data
npm run seed

# Start backend server
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
# In a new terminal
cd /workspace

# Install dependencies (if not already done)
npm install

# Start frontend dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

The Vite proxy automatically forwards `/api/*` requests to the backend.

## 🌐 API Endpoints

### Public Routes
- `GET /api/projects` - Get all projects
- `GET /api/certificates` - Get all certificates
- `GET /api/videos` - Get all videos
- `GET /api/resume` - Get resume info
- `POST /api/resume/download` - Track download
- `POST /api/contact` - Submit contact form
- `POST /api/visit` - Log visit
- `GET /api/health` - Health check

### Protected Routes (require JWT)
- `POST/PUT/DELETE /api/projects/:id` - Manage projects
- `POST/PUT/DELETE /api/certificates/:id` - Manage certificates
- `POST/PUT/DELETE /api/videos/:id` - Manage videos
- `PUT /api/resume` - Update resume
- `GET/PUT /api/contact/:id` - Manage contacts
- `GET /api/visit/stats` - Visit analytics
- `GET /api/admin/stats` - Dashboard stats

### Authentication
- `POST /api/auth/register` - Register first admin
- `POST /api/auth/login` - Login

## 🔐 First-Time Admin Setup

```bash
# Register admin (one-time)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YourSecurePassword123!"}'

# Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YourSecurePassword123!"}'
```

Save the returned JWT token for protected API calls.

## 🎨 Features

### Frontend
- ✅ Modern dark theme with gradient accents
- ✅ Responsive mobile-first design
- ✅ Scroll-reveal animations
- ✅ Typewriter effect for roles
- ✅ Project cards with tech stacks
- ✅ Experience timeline
- ✅ Skills visualization
- ✅ Contact form with validation
- ✅ Visit counter
- ✅ SEO optimized with meta tags

### Backend
- ✅ RESTful API architecture
- ✅ JWT authentication
- ✅ MongoDB models with validation
- ✅ Visit tracking/analytics
- ✅ Contact form storage
- ✅ Resume download tracking
- ✅ CORS enabled
- ✅ Morgan logging

## 📦 Deployment

### Frontend (Netlify)

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to Netlify

3. Set environment variable in Netlify:
   - `VITE_API_URL` = Your Render backend URL

4. Update `vite.config.js` proxy target for production

### Backend (Render)

1. Connect GitHub repo to Render

2. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`

3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Domain Setup

Point `hariomchauhan.com.np` to Netlify and configure SSL.

## 📝 Customization Needed

Before going live, update these placeholders:

1. **Email** - `frontend/src/components/Contact.jsx`
2. **Graduation date** - `frontend/src/components/Education.jsx`
3. **Live demo URLs** - Backend seed data or admin panel
4. **Profile image** - Replace placeholder in Hero section
5. **Certificate URLs** - Add actual credential links
6. **Resume PDF** - Upload actual resume file

## 🧪 Testing

```bash
# Test API health
curl http://localhost:5000/api/health

# Test projects endpoint
curl http://localhost:5000/api/projects

# Test contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Hi","message":"Hello"}'
```

## 📄 License

MIT License - feel free to use this portfolio structure for your own site!

## 👤 Author

**Hariom Raj Chauhan**
- Computer Engineering Student, IOE Purwanchal Campus
- Technical Manager @ ACES
- [GitHub](https://github.com/HariomRajChauhan)
- [LinkedIn](https://linkedin.com/in/hariomrajchauhan)
- [YouTube](https://youtube.com/@techhrch)

---

Built with ❤️ using React, Node.js, and MongoDB
