import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repositories, setRepositories] = useState([]);
  const [repositoriesLoading, setRepositoriesLoading] = useState(true);

  const seedProjects = [
    {
      _id: '1',
      title: 'Smart Multi-Crop Disease Detection & Yield Prediction',
      description: 'AI-powered system using CNN for disease detection and LSTM for yield prediction. Full SRS/DFD/UML documentation in LaTeX.',
      techStack: ['Python', 'CNN', 'LSTM', 'TensorFlow', 'LaTeX'],
      github: 'https://github.com/HariomRajChauhan',
      liveDemo: null,
      featured: true,
    },
    {
      _id: '2',
      title: 'TCP-Based Web Server (WEB_server)',
      description: 'Framework-free HTTP server built in C++17 with socket and server abstraction layers. Deep networking fundamentals.',
      techStack: ['C++17', 'TCP/IP', 'Sockets', 'HTTP'],
      github: 'https://github.com/HariomRajChauhan/WEB_server',
      liveDemo: null,
      featured: true,
    },
    {
      _id: '3',
      title: 'Feelings - React Native App',
      description: 'Mobile application built with React Native for expressing and tracking emotions.',
      techStack: ['React Native', 'JavaScript', 'Mobile'],
      github: 'https://github.com/HariomRajChauhan',
      liveDemo: null,
      featured: false,
    },
    {
      _id: '4',
      title: 'Exe_Cleaner',
      description: 'Utility project for cleaning and managing executable files efficiently.',
      techStack: ['C++', 'System Programming'],
      github: 'https://github.com/HariomRajChauhan',
      liveDemo: null,
      featured: false,
    },
    {
      _id: '5',
      title: 'Personal Portfolio (This Site)',
      description: 'Full-stack MERN portfolio with JWT-authenticated admin API, deployed on Netlify + Render.',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'TailwindCSS'],
      github: 'https://github.com/HariomRajChauhan',
      liveDemo: 'https://hariomchauhan.com.np',
      featured: true,
    },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        if (response.data && response.data.length > 0) {
          setProjects(response.data);
        } else {
          setProjects(seedProjects);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects(seedProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    axios.get('/api/github/repositories')
      .then((response) => setRepositories(response.data.repositories))
      .catch(() => setRepositories([]))
      .finally(() => setRepositoriesLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="projects" className="section-padding">
        <div className="container-width text-center">
          <div className="text-dark-500 font-body text-sm">Loading projects...</div>
        </div>
      </section>
    );
  }

  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <section id="projects" className="section-padding relative">
      <div className="container-width">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-accent-primary text-sm font-body font-medium tracking-wider uppercase mb-3">Projects</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Featured work
          </h2>
          <div className="section-divider" />
          <p className="text-dark-400 font-body mt-4 max-w-xl">
            A showcase spanning AI/ML, systems programming, mobile development, and full-stack web applications.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group glass-card overflow-hidden"
            >
              {/* Project Header */}
              <div className="h-44 bg-gradient-to-br from-accent-primary/[0.06] to-accent-secondary/[0.06] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-6 h-6 text-dark-400 group-hover:text-accent-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                </div>
                {/* Featured badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-body font-medium text-accent-primary bg-accent-primary/10 border border-accent-primary/20 rounded-full">
                  Featured
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-heading font-semibold text-white mb-2 group-hover:text-accent-primary transition-colors duration-300 line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-dark-400 text-sm font-body mb-4 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack?.slice(0, 4).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-0.5 text-[11px] font-body text-dark-400 border border-white/[0.06] rounded bg-white/[0.02]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack?.length > 4 && (
                    <span className="px-2 py-0.5 text-[11px] font-body text-dark-500">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-3 border-t border-white/[0.04]">
                  {(project.github || project.githubUrl) && (
                    <a
                      href={project.github || project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-white transition-colors font-body"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Source
                    </a>
                  )}
                  {(project.liveDemo || project.liveUrl) && (
                    <a
                      href={project.liveDemo || project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-accent-primary hover:text-accent-tertiary transition-colors font-body"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg font-heading font-semibold text-white mb-6"
            >
              Other Projects
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-4">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-5 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-heading font-semibold text-white group-hover:text-accent-primary transition-colors">
                      {project.title}
                    </h3>
                    {(project.github || project.githubUrl) && (
                      <a
                        href={project.github || project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark-500 hover:text-white transition-colors flex-shrink-0 ml-3"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="text-dark-400 text-xs font-body mb-3 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack?.map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-0.5 text-[10px] font-body text-dark-500 border border-white/[0.04] rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <section className="github-projects">
          <div className="github-projects-header">
            <div>
              <p>From GitHub</p>
              <h3>More experiments, tools, and work in progress.</h3>
            </div>
            <a
              href="https://github.com/HariomRajChauhan?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="github-profile-link"
            >
              View GitHub
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8l4 4m0 0-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {repositoriesLoading ? (
            <p className="github-projects-status">Loading repositories...</p>
          ) : repositories.length > 0 ? (
            <div className="github-repositories-grid">
              {repositories.map((repository, index) => (
                <motion.a
                  key={repository.id}
                  href={repository.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index, 5) * 0.06 }}
                  className="github-repository-card"
                >
                  <div className="github-repository-top">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4.379a2.5 2.5 0 0 1 1.768.732l.621.621a2.5 2.5 0 0 0 1.768.732H18.5A2.5 2.5 0 0 1 21 9.585v7.915A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />
                    </svg>
                    <span>{repository.isPrivate ? 'Private' : 'Public'}</span>
                  </div>
                  <h4>{repository.name}</h4>
                  <p>{repository.description || 'A work-in-progress repository from my GitHub.'}</p>
                  <div className="github-repository-meta">
                    {repository.language && <span><i />{repository.language}</span>}
                    <span>Updated {new Date(repository.updatedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                  </div>
                </motion.a>
              ))}
            </div>
          ) : (
            <p className="github-projects-status">Repositories could not be loaded right now. Visit GitHub to explore the latest work.</p>
          )}
        </section>
      </div>
    </section>
  );
};

export default Projects;
