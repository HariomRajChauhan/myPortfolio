import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWorksOpen, setIsWorksOpen] = useState(false);
  const [isMobileWorksOpen, setIsMobileWorksOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsWorksOpen(false);
    setIsMobileWorksOpen(false);
  }, [location.pathname]);

  const worksLinks = [
    { number: '01', name: 'Projects', to: '/works/projects', description: 'Apps, systems, and AI projects.' },
    { number: '02', name: 'Experience', to: '/works/experience', description: 'Leadership and design roles.' },
    { number: '03', name: 'Skills', to: '/works/skills', description: 'Languages, frameworks, and tools.' },
    { number: '04', name: 'Contributions', to: '/works/contributions', description: 'Workshops, events, and community work.' },
  ];

  const navLinkClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`;
  const worksActive = location.pathname.startsWith('/works');

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`site-header ${
        isScrolled ? 'site-header-scrolled' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] md:h-[76px]">
          {/* Logo */}
          <Link to="/" className="brand-lockup" aria-label="Hariom Raj Chauhan home">
            <span className="brand-wordmark">Hariom</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            <div
              className="relative"
              onMouseEnter={() => setIsWorksOpen(true)}
              onMouseLeave={() => setIsWorksOpen(false)}
            >
              <button
                type="button"
                className={`nav-link ${worksActive ? 'nav-link-active' : ''}`}
                onClick={() => setIsWorksOpen((open) => !open)}
                aria-expanded={isWorksOpen}
                aria-haspopup="menu"
              >
                Work
                <svg className={`w-3.5 h-3.5 transition-transform ${isWorksOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <AnimatePresence>
                {isWorksOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="works-menu"
                    role="menu"
                  >
                    <div className="works-menu-grid">
                      {worksLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} className="works-menu-link" role="menuitem">
                          <span className="works-menu-number">{link.number}</span>
                          <span className="works-menu-copy">
                            <strong>{link.name}</strong>
                            <small>{link.description}</small>
                          </span>
                          <svg className="works-menu-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12h14m-5-5 5 5-5 5" />
                          </svg>
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink to="/blogs" className={navLinkClass}>Blogs</NavLink>
            <NavLink to="/videos" className={navLinkClass}>Videos</NavLink>
            <NavLink to="/community" className={navLinkClass}>Community</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden mobile-menu-toggle"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18 18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden pb-4"
            >
              <div className="mobile-nav">
                <button
                  type="button"
                  className={`nav-link w-full justify-between ${worksActive ? 'nav-link-active' : ''}`}
                  onClick={() => setIsMobileWorksOpen((open) => !open)}
                >
                  Work
                  <svg className={`w-3.5 h-3.5 transition-transform ${isMobileWorksOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isMobileWorksOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pl-3"
                    >
                      {worksLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} className="mobile-work-link">
                          {link.name}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <NavLink to="/blogs" className={navLinkClass}>Blogs</NavLink>
                <NavLink to="/videos" className={navLinkClass}>Videos</NavLink>
                <NavLink to="/community" className={navLinkClass}>Community</NavLink>
                <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="pt-2"
                >
                  <NavLink to="/contact" className="mobile-contact-cta">Let's Talk</NavLink>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
