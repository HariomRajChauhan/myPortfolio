import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [visitCount, setVisitCount] = useState(0);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    axios.get('/api/visit')
      .then((response) => setVisitCount(response.data.count || 0))
      .catch(() => undefined);
  }, []);

  const sections = [
    {
      title: 'Work',
      links: [
        { label: 'Projects', to: '/works/projects' },
        { label: 'Experience', to: '/works/experience' },
        { label: 'Skills', to: '/works/skills' },
        { label: 'Contributions', to: '/works/contributions' },
      ],
    },
    {
      title: 'Words',
      links: [
        { label: 'Blogs', to: '/blogs' },
        { label: 'Videos', to: '/videos' },
        { label: 'Community', to: '/community' },
      ],
    },
    {
      title: 'Say hello',
      links: [
        { label: 'Contact', to: '/contact' },
        { label: 'Resume', href: '/resumes/Hariom_Chauhan_Resume.pdf' },
      ],
    },
    {
      title: 'Elsewhere',
      links: [
        { label: 'GitHub', href: 'https://github.com/HariomRajChauhan' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/hariomrajchauhan' },
        { label: 'Gmail', href: 'mailto:hariom.chauhan@example.com' },
      ],
    },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="site-footer">
      <div className="container-width footer-layout">
        <div className="footer-intro">
          <Link to="/" className="footer-wordmark">Hariom</Link>
          <p>Computer engineering student building useful, considered digital experiences.</p>
        </div>

        <div className="footer-columns">
          {sections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to}>{link.label}</Link>
                    ) : (
                      <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="container-width footer-meta">
        <p>© {currentYear} Hariom Raj Chauhan</p>
        <p className="footer-visit-count">{visitCount.toLocaleString()} visits</p>
        <p>Set in Space Grotesk, Inter & DM Mono</p>
        <button type="button" onClick={scrollToTop}>Back to top <span aria-hidden="true">↑</span></button>
      </div>
    </footer>
  );
};

export default Footer;
