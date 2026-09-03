import { Typewriter } from 'react-simple-typewriter';

const Hero = () => {
  const handleDownloadResume = async () => {
    try {
      const response = await fetch('/api/resume', { method: 'POST' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Hariom_Chauhan_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download resume:', error);
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center md:text-left order-2 md:order-1 animate-fadeInUp">
            <p className="text-cyan-400 font-medium mb-2">Hello, I'm</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Hariom Raj Chauhan
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-300 mb-4 h-8">
              I'm a{' '}
              <Typewriter
                words={['Computer Engineering Student', 'Full-Stack Developer', 'UI/UX & Graphics Designer', 'Technical Manager at ACES']}
                loop={0}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto md:mx-0">
              Blending software engineering with creative design to build impactful digital experiences. 
              Currently seeking internship/junior roles in full-stack development, AI/ML, or UI/UX design.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
              <a
                href="#projects"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25"
              >
                View Projects
              </a>
              <button
                onClick={handleDownloadResume}
                className="px-6 py-3 border border-cyan-400 text-cyan-400 font-medium rounded-lg hover:bg-cyan-400/10 transition-colors"
              >
                Download Resume
              </button>
              <a
                href="#contact"
                className="px-6 py-3 border border-purple-400 text-purple-400 font-medium rounded-lg hover:bg-purple-400/10 transition-colors"
              >
                Contact Me
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="https://github.com/HariomRajChauhan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/hariomrajchauhan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com/@techhrch"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Image/Graphic */}
          <div className="order-1 md:order-2 flex justify-center animate-fadeIn">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              {/* Animated rings */}
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-4 border-2 border-purple-400/30 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
              <div className="absolute inset-8 border-2 border-pink-400/30 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
              
              {/* Profile placeholder - replace with actual image */}
              <div className="absolute inset-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                <span className="text-6xl md:text-7xl font-bold text-white">H</span>
              </div>
              
              {/* Floating icons */}
              <div className="absolute -top-4 -right-4 p-3 bg-gray-800 rounded-lg shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                <span className="text-2xl">💻</span>
              </div>
              <div className="absolute -bottom-4 -left-4 p-3 bg-gray-800 rounded-lg shadow-lg animate-bounce" style={{ animationDuration: '2.5s' }}>
                <span className="text-2xl">🎨</span>
              </div>
              <div className="absolute top-1/2 -right-8 p-3 bg-gray-800 rounded-lg shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
