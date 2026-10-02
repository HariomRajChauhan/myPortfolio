import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminContentManager from '../components/AdminContentManager';

const sections = [
  { id: 'projects', label: 'Projects' },
  { id: 'blogs', label: 'Blog posts' },
  { id: 'videos', label: 'YouTube videos' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'community', label: 'Community' },
];

const AdminDashboard = ({ token, onLogout }) => {
  const [activeSection, setActiveSection] = useState('projects');

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link to="/" className="admin-wordmark">Hariom</Link>
        <div><span>Content studio</span><button type="button" onClick={onLogout}>Sign out</button></div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <p>Manage site content</p>
          <nav>
            {sections.map((section) => (
              <button
                type="button"
                key={section.id}
                className={activeSection === section.id ? 'active' : ''}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
          <a href="/" target="_blank" rel="noopener noreferrer">View website ↗</a>
        </aside>
        <main className="admin-main">
          <AdminContentManager token={token} type={activeSection} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
