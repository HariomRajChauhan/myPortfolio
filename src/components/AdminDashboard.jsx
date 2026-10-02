import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './DashboardOverview';
import ProjectsManager from './ProjectsManager';
import CertificatesManager from './CertificatesManager';
import EducationManager from './EducationManager';
import ExperienceManager from './ExperienceManager';
import VideosManager from './VideosManager';
import ContactMessages from './ContactMessages';

const API_BASE = '/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Verify token and get admin info
    const verifyAdmin = async () => {
      try {
        const response = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdminName(response.data.admin.username);
      } catch (error) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'projects':
        return <ProjectsManager />;
      case 'certificates':
        return <CertificatesManager />;
      case 'education':
        return <EducationManager />;
      case 'experience':
        return <ExperienceManager />;
      case 'videos':
        return <VideosManager />;
      case 'contacts':
        return <ContactMessages />;
      default:
        return <DashboardOverview />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar (drawer on mobile, static rail from lg up) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminName={adminName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-700 bg-gray-800 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              aria-controls="admin-sidebar"
              aria-expanded={sidebarOpen}
              className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-gray-700 hover:text-white lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <h1 className="min-w-0 flex-1 truncate text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent sm:text-2xl">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h1>

            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden max-w-[10rem] truncate text-sm text-gray-400 md:inline">
                Welcome, {adminName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium transition-colors hover:bg-red-700 sm:px-4"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
