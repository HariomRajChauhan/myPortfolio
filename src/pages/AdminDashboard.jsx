import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminContentManager from '../components/AdminContentManager';

const sections = [
  { id: 'projects', label: 'Projects', icon: 'M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4' },
  { id: 'blogs', label: 'Blog posts', icon: 'M4 5h16v14H4zM8 9h8M8 13h8M8 17h5' },
  { id: 'videos', label: 'YouTube videos', icon: 'M3 8h18v11H3zM10 9l5 4.5L10 18z' },
  { id: 'contributions', label: 'Contributions', icon: 'M12 4v16M4 12h16' },
  { id: 'community', label: 'Community', icon: 'M8 11a3 3 0 100-6 3 3 0 000 6zM2 20a6 6 0 0116 0M17 11a3 3 0 100-6M16 20h6a5 5 0 00-3-4' }
];

const AdminDashboard = ({ token, onLogout }) => {
  const [activeSection, setActiveSection] = useState('projects');
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  // Close the drawer on Escape and keep Tab inside it while it is open
  useEffect(() => {
    if (!navOpen) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setNavOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !navRef.current) return;

      const focusable = navRef.current.querySelectorAll(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    // Move focus into the drawer so keyboard users are not stranded behind it
    requestAnimationFrame(() => {
      navRef.current?.querySelector('button, a[href]')?.focus();
    });

    return () => {
      window.removeEventListener('keydown', onKey);
      // Hand focus back to the trigger so keyboard users are not dropped at the
      // top of the document.
      if (navRef.current?.contains(document.activeElement)) {
        toggleRef.current?.focus();
      }
    };
  }, [navOpen]);

  // Prevent the page behind the drawer from scrolling on touch devices
  useEffect(() => {
    if (!navOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [navOpen]);

  // Crossing into the desktop breakpoint turns the drawer into a static rail,
  // so the open state must be dropped or the body scroll lock would persist.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onChange = (event) => {
      if (event.matches) setNavOpen(false);
    };
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  const selectSection = (id) => {
    setActiveSection(id);
    setNavOpen(false);
  };

  const active = sections.find((section) => section.id === activeSection);

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <button
          type="button"
          ref={toggleRef}
          className="admin-menu-toggle"
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
          aria-expanded={navOpen}
          aria-controls="admin-sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <Link to="/" className="admin-wordmark">Hariom</Link>
        <div>
          <span>{active ? active.label : 'Content studio'}</span>
          <button type="button" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <div className="admin-layout">
        {navOpen && (
          <div
            className="admin-backdrop"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          id="admin-sidebar"
          ref={navRef}
          className={`admin-sidebar${navOpen ? ' is-open' : ''}`}
          aria-label="Content sections"
          aria-modal={navOpen ? 'true' : undefined}
          {...(navOpen ? { role: 'dialog' } : {})}
        >
          <div className="admin-sidebar-top">
            <div className="min-w-0">
              <p className="admin-header-label">Content studio</p>
              <h2 className="admin-sidebar-title">Manage site content</h2>
            </div>
            <button
              type="button"
              className="admin-sidebar-close"
              onClick={() => setNavOpen(false)}
              aria-label="Close navigation"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav>
            {sections.map((section) => (
              <button
                type="button"
                key={section.id}
                className={activeSection === section.id ? 'active' : ''}
                onClick={() => selectSection(section.id)}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={section.icon} />
                </svg>
                <span className="truncate">{section.label}</span>
              </button>
            ))}
          </nav>

          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-sidebar-visit">
            View website
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
        </aside>

        <main className="admin-main">
          <AdminContentManager token={token} type={activeSection} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;