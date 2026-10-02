import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import LoadingSpinner from './components/LoadingSpinner';
import SiteLayout from './components/SiteLayout';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './components/ThemeProvider';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
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

function App() {
  const [loading, setLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState(null);

  // Log visit when app loads
  useEffect(() => {
    const logVisit = async () => {
      try {
        await axios.post('/api/visit');
      } catch (error) {
        console.error('Failed to log visit:', error);
      } finally {
        setLoading(false);
      }
    };

    logVisit();

    // Check for existing admin token
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setAdminToken(storedToken);
      setIsAdminLoggedIn(true);
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

  if (loading) return <LoadingSpinner />;

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
            isAdminLoggedIn
              ? <AdminDashboard token={adminToken} onLogout={handleAdminLogout} />
              : <AdminLogin onLogin={handleAdminLogin} />
          } />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
