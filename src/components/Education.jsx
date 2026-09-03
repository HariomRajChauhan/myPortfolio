const Education = () => {
  return (
    <section id="education" className="py-20 px-4 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Education
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-white/10 hover:border-cyan-400/30 transition-colors animate-fadeInUp">
            <div className="flex items-start gap-6">
              {/* Icon */}
              <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Bachelor of Engineering in Computer Engineering
                    </h3>
                    <p className="text-lg text-cyan-400">IOE Purwanchal Campus</p>
                    <p className="text-gray-400 text-sm">Dharan, Nepal</p>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right">
                    <div className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg">
                      <span className="text-cyan-400 font-medium">Current: 3rd Year, 2nd Part</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">Roll No: PUR080BCT033</p>
                    {/* TODO: Confirm exact expected graduation date */}
                    <p className="text-gray-500 text-xs mt-1">Expected Graduation: 2027/2028</p>
                  </div>
                </div>

                {/* Current Status */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-white font-medium mb-3">Academic Highlights</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-300 text-sm">
                      <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Currently in 3rd Year, 2nd Part (Semester 6)
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 text-sm">
                      <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Software Engineering Minor Project: AI-based Crop Disease Detection
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 text-sm">
                      <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Technical documentation using LaTeX for project proposals and reports
                    </li>
                    <li className="flex items-start gap-2 text-gray-300 text-sm">
                      <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Active member of ACES (Association of Computer Engineering Students)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid md:grid-cols-2 gap-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-white/5">
              <div className="text-2xl mb-2">📍</div>
              <h4 className="text-white font-medium mb-1">Campus Location</h4>
              <p className="text-gray-400 text-sm">Dharan, Sunsari, Nepal</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-white/5">
              <div className="text-2xl mb-2">🏛️</div>
              <h4 className="text-white font-medium mb-1">Affiliation</h4>
              <p className="text-gray-400 text-sm">Institute of Engineering, Tribhuvan University</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
