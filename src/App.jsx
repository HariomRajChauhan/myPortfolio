import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Import all components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Import pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <main>
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Experience />
                <Education />
                <Certificates />
                <Contact />
              </main>
              <Footer />
            </>
          } />
          <Route path="/admin" element={
            isAdminLoggedIn 
              ? <AdminDashboard token={adminToken} onLogout={handleAdminLogout} />
              : <AdminLogin onLogin={handleAdminLogin} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
