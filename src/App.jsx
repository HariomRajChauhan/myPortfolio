import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import LoadingSpinner from './components/LoadingSpinner';
import SiteLayout from './components/SiteLayout';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './components/ThemeProvider';

import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencePage from './pages/ExperiencePage';
import SkillsPage from './pages/SkillsPage';
import ContributionsPage from './pages/ContributionsPage';
import BlogsPage from './pages/BlogsPage';
import BlogPostPage from './pages/BlogPostPage';
import CommunityPage from './pages/CommunityPage';
import ContactPage from './pages/ContactPage';
import VideosPage from './pages/VideosPage';
import VideoDetailPage from './pages/VideoDetailPage';

// The admin bundle is loaded only when /admin is visited, so admin component
// code and endpoint names are not shipped to regular visitors.
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Decode a JWT payload without trusting it, purely to read the exp claim.
const decodeJwtPayload = (token) => {
  try {
    const segment = token.split('.')[1];
    if (!segment) return null;
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

// A stored token is only trusted if it is a well-formed, unexpired JWT. This
// stops a stale or arbitrary localStorage value from rendering the dashboard.
const isTokenValid = (token) => {
  const payload = decodeJwtPayload(token);
  return Boolean(payload && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now());
};

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState(null);

  // Log visit in the background; it must never block the first paint.
  useEffect(() => {
    axios.post('/api/visit').catch((error) => {
      console.error('Failed to log visit:', error);
    });

    // Check for an existing, still-valid admin token
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken && isTokenValid(storedToken)) {
      setAdminToken(storedToken);
      setIsAdminLoggedIn(true);
    } else if (storedToken) {
      localStorage.removeItem('adminToken');
    }
  }, []);

  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsAdminLoggedIn(false);
  };

  return (
    <Router>
      <ThemeProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="works/projects" element={<ProjectsPage />} />
            <Route path="works/experience" element={<ExperiencePage />} />
            <Route path="works/skills" element={<SkillsPage />} />
            <Route path="works/contributions" element={<ContributionsPage />} />
            <Route path="blogs" element={<BlogsPage />} />
            <Route path="blogs/:slug" element={<BlogPostPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="videos/:id" element={<VideoDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
          <Route path="/admin" element={
            <Suspense fallback={<LoadingSpinner />}>
              {isAdminLoggedIn
                ? <AdminDashboard token={adminToken} onLogout={handleAdminLogout} />
                : <AdminLogin onLogin={handleAdminLogin} />}
            </Suspense>
          } />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
