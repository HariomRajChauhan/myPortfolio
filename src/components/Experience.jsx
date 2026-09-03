const Experience = () => {
  const experiences = [
    {
      title: 'Technical Manager',
      organization: 'ACES (Association of Computer Engineering Students)',
      period: 'Current',
      description: 'Leading technical initiatives and managing engineering projects for the computer engineering student association.',
      type: 'leadership',
    },
    {
      title: 'Graphics Designer',
      organization: 'ACES (Association of Computer Engineering Students)',
      period: '~2 years',
      description: 'Created visual content, marketing materials, and brand assets for various student events and initiatives. Developed strong design sensibility while collaborating with technical teams.',
      type: 'design',
    },
    {
      title: 'Graphics Lead',
      organization: 'Taranga: The Wave of Technology',
      period: 'National Tech Fest',
      description: 'Led all visual design aspects for a national-level technology festival, managing a team of designers and ensuring cohesive branding across all platforms and materials.',
      type: 'design',
    },
    {
      title: 'C++ Workshop Instructor',
      organization: 'IOE Purwanchal Campus',
      period: 'Workshop',
      description: 'Organized and conducted a C++ guidance session for 1st-year students, including creating proposal templates, slide decks, and guidelines handouts to help newcomers get started with programming.',
      type: 'teaching',
    },
  ];

  const getTypeStyles = (type) => {
    switch (type) {
      case 'leadership':
        return { icon: '👔', color: 'from-cyan-500 to-blue-600' };
      case 'design':
        return { icon: '🎨', color: 'from-purple-500 to-pink-600' };
      case 'teaching':
        return { icon: '📚', color: 'from-orange-500 to-red-600' };
      default:
        return { icon: '💼', color: 'from-gray-500 to-gray-600' };
    }
  };

  return (
    <section id="experience" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Experience & Leadership
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Combining technical leadership with creative direction in student organizations and events
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 hidden md:block"></div>

          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const styles = getTypeStyles(exp.type);
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex items-start gap-4 md:gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } animate-fadeInUp`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 -ml-2 mt-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full border-4 border-gray-900 z-10 hidden md:block"></div>

                  {/* Content Card */}
                  <div className={`flex-1 ml-12 md:ml-0 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-white/5 hover:border-cyan-400/30 transition-colors">
                      <div className={`flex items-center gap-3 mb-3 ${!isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} justify-start md:justify-${isLeft ? 'end' : 'start'}`}>
                        <span className="text-2xl">{styles.icon}</span>
                        <div className={isLeft ? 'md:text-right' : 'md:text-left'}>
                          <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                          <p className="text-cyan-400 text-sm">{exp.organization}</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{exp.period}</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  </div>

                  {/* Empty space for timeline balance */}
                  <div className="hidden md:block flex-1"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Achievements */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl p-6 border border-cyan-500/20 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">2+ Years</div>
            <div className="text-gray-400 text-sm">Design Experience at ACES</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl p-6 border border-purple-500/20 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">National Level</div>
            <div className="text-gray-400 text-sm">Tech Fest Graphics Lead</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-xl p-6 border border-orange-500/20 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">Workshop Leader</div>
            <div className="text-gray-400 text-sm">C++ Guidance for Freshmen</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
