# Hariom Chauhan Portfolio - README

## Overview
This is a complete rebuild of the personal portfolio website for Hariom Raj Chauhan (hariomchauhan.com.np). The site showcases his dual expertise in software engineering and creative design, targeting internship/junior roles in full-stack development, AI/ML, or UI/UX design.

## Tech Stack
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend API**: Express + MongoDB Atlas (existing - reused)
- **Deployment**: Netlify (frontend) + Render (backend)

## Project Structure
```
/workspace
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Navigation with scroll effects
│   │   ├── Hero.jsx         # Hero section with typewriter effect
│   │   ├── About.jsx        # Bio and introduction
│   │   ├── Skills.jsx       # Categorized skill bars
│   │   ├── Projects.jsx     # Project cards from API
│   │   ├── Experience.jsx   # Timeline of roles
│   │   ├── Education.jsx    # Education details
│   │   ├── Certificates.jsx # Certificate grid from API
│   │   ├── Contact.jsx      # Contact form + social links
│   │   ├── Footer.jsx       # Footer with visit counter
│   │   └── LoadingSpinner.jsx
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind + custom styles
├── public/
│   └── favicon.svg
├── index.html               # HTML with SEO meta tags
├── vite.config.js           # Vite config with API proxy
├── tailwind.config.js       # Tailwind with custom animations
└── package.json
```

## Sections Included
1. **Hero** - Name, typed role line, CTAs, social links
2. **About** - Bio highlighting technical + creative blend
3. **Skills** - Grouped into Programming, Design, Other with visual bars
4. **Projects** - Featured projects from API with seed data
5. **Experience** - Timeline of ACES roles and workshops
6. **Education** - IOE Purwanchal Campus details
7. **Certificates** - Grid from API with seed data
8. **Contact** - Form posting to `/api/contact` + direct links
9. **Footer** - Visit counter from `/api/visit`

## API Integration
The frontend expects the following existing backend endpoints:
- `GET /api/projects` - Fetch projects
- `GET /api/certificates` - Fetch certificates
- `POST /api/resume` - Download resume (returns blob)
- `POST /api/contact` - Submit contact form
- `GET /api/visit` - Get visit count
- `POST /api/visit` - Log new visit

## Placeholders & TODOs
The following items need to be updated with real data:

1. **Email Address** (`Contact.jsx`):
   ```js
   const contactEmail = 'hariom.chauhan@example.com'; // TODO: Update with real email
   ```

2. **Expected Graduation Date** (`Education.jsx`):
   ```html
   <!-- TODO: Confirm exact expected graduation date -->
   Expected Graduation: 2027/2028
   ```

3. **Live Demo URLs** (`Projects.jsx`):
   - Add actual live demo URLs when projects are deployed
   - Currently set to `null` for most projects

4. **Certificate Credential URLs** (`Certificates.jsx`):
   - Add actual credential URLs if available

5. **Profile Image** (`Hero.jsx`):
   - Replace the "H" initial placeholder with an actual profile photo

## Design Features
- **Dark theme** with cyan/purple gradient accents
- **Scroll-reveal animations** using custom CSS keyframes
- **Typewriter effect** for rotating role titles
- **Responsive design** (mobile-first)
- **Custom scrollbar** with gradient colors
- **Smooth scroll** navigation
- **Loading state** with animated spinner

## Running Locally

### Prerequisites
- Node.js 18+
- Backend API running on port 5000 (or update `vite.config.js`)

### Install & Run
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

## Deployment Notes

### Frontend (Netlify)
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variable for API URL if different

### Backend (Render)
- Existing Express app should already be deployed
- Ensure CORS allows requests from Netlify domain

## Assumptions Made
1. Backend API structure matches the routes listed above
2. Resume endpoint returns a PDF blob
3. Contact form expects `{name, email, subject, message}` payload
4. Visit endpoint returns `{count: number}`

## Additional Recommendations
1. Add Open Graph image (`/public/og-image.png`) for social sharing
2. Consider adding Google Analytics or similar for more detailed analytics
3. Add schema.org structured data for better SEO
4. Create a sitemap.xml for search engines
5. Consider adding a blog section for technical articles
