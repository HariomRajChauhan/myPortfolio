import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  const handleDownloadResume = async () => {
    try {
      const response = await fetch('/api/resume/download', { method: 'POST' });
      if (!response.ok) throw new Error('Resume is unavailable');
      const { downloadUrl } = await response.json();
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to download resume:', error);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-secondary/[0.08] rounded-full blur-[150px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-primary/[0.07] rounded-full blur-[130px] animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/[0.05] rounded-full blur-[200px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Content - Text */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.03] mb-8"
            >
              <span className="status-dot" />
              <span className="text-sm text-dark-300 font-body">Available for opportunities</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hero-title"
            >
              <span className="hero-greeting">Hi, I'm</span>
              <span className="hero-name">Hariom Raj Chauhan</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hero-role"
            >
              Full-stack developer, UI/UX designer, and computer engineering student.
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hero-description"
            >
              Computer Engineering student at IOE Purwanchal Campus, blending
              software engineering with creative design to craft impactful digital experiences.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <Link
                to="/works/projects"
                className="keep-white group px-6 py-3 bg-accent-primary text-white text-sm font-medium rounded-xl hover:bg-accent-primary/90 transition-all duration-300 shadow-glow-sm hover:shadow-glow flex items-center gap-2"
              >
                View Projects
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button
                onClick={handleDownloadResume}
                className="px-6 py-3 text-sm font-medium text-dark-200 border border-white/[0.1] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume
              </button>
            </motion.div>

            {/* Removed from the hero to keep the introduction focused. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden"
            >
              <span className="text-xs text-dark-500 uppercase tracking-widest font-body mr-2">Connect</span>
              {[
                { label: 'GitHub', href: 'https://github.com/HariomRajChauhan', icon: <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /> },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/hariomrajchauhan', icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> },
                { label: 'YouTube', href: 'https://youtube.com/@techhrch', icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                  aria-label={label}
                >
                  <svg className="w-4 h-4 text-dark-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px]">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/30 via-accent-primary/15 to-accent-blue/20 rounded-full blur-[80px] animate-pulse-glow" />
              
              {/* Outer decorative ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-white/[0.04]"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accent-primary rounded-full" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-accent-secondary rounded-full" />
              </motion.div>

              {/* Second ring */}
              <motion.div
                className="absolute inset-6 rounded-full border border-white/[0.03]"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent-primary/60 rounded-full" />
              </motion.div>

              {/* Portrait */}
              <div className="absolute inset-12 rounded-full border-2 border-accent-secondary/70 shadow-glow-lg overflow-hidden bg-accent-blue/20">
                <img
                  src="/hero.png"
                  alt="Hariom Raj Chauhan"
                  className="w-full h-full object-cover"
                />
                <div className="hero-portrait-overlay absolute inset-0 bg-gradient-to-tr from-accent-primary/15 via-transparent to-accent-secondary/10" />
              </div>

              {/* Removed from the hero to keep the portrait uncluttered. */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden"
              >
                <span className="text-xs font-body text-dark-300">React & Node.js</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="hidden"
              >
                <span className="text-xs font-body text-dark-300">UI/UX Design</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="hidden"
              >
                <span className="text-xs font-body text-dark-300">AI/ML</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Kept out of view: navigation now makes the next action clear. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="hidden"
        >
          <span className="text-[10px] text-dark-500 uppercase tracking-[0.2em] font-body">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/[0.1] flex items-start justify-center p-1.5"
          >
            <div className="w-0.5 h-1.5 bg-white/30 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
