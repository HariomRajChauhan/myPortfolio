import { motion } from 'framer-motion';

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
      description: 'Created visual content, marketing materials, and brand assets for student events. Developed strong design sensibility while collaborating with technical teams.',
      type: 'design',
    },
    {
      title: 'Graphics Lead',
      organization: 'Taranga: The Wave of Technology',
      period: 'National Tech Fest',
      description: 'Led all visual design aspects for a national-level technology festival, managing a team of designers and ensuring cohesive branding across platforms.',
      type: 'design',
    },
    {
      title: 'C++ Workshop Instructor',
      organization: 'IOE Purwanchal Campus',
      period: 'Workshop',
      description: 'Organized and conducted a C++ guidance session for 1st-year students, including creating proposal templates, slide decks, and guidelines handouts.',
      type: 'teaching',
    },
  ];

  const getTypeConfig = (type) => {
    switch (type) {
      case 'leadership':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
          color: 'text-accent-primary',
          bg: 'bg-accent-primary/10',
          border: 'border-accent-primary/20',
          tag: 'Leadership',
        };
      case 'design':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          ),
          color: 'text-accent-secondary',
          bg: 'bg-accent-secondary/10',
          border: 'border-accent-secondary/20',
          tag: 'Design',
        };
      case 'teaching':
        return {
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          ),
          color: 'text-accent-emerald',
          bg: 'bg-accent-emerald/10',
          border: 'border-accent-emerald/20',
          tag: 'Teaching',
        };
      default:
        return {
          icon: null,
          color: 'text-dark-400',
          bg: 'bg-white/5',
          border: 'border-white/10',
          tag: 'Other',
        };
    }
  };

  const achievements = [
    { value: '2+ Years', label: 'Design at ACES', color: 'text-accent-primary' },
    { value: 'National Level', label: 'Tech Fest Lead', color: 'text-accent-secondary' },
    { value: 'Workshop', label: 'C++ Instructor', color: 'text-accent-emerald' },
  ];

  return (
    <section id="experience" className="section-padding relative">
      <div className="container-width">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-accent-primary text-sm font-body font-medium tracking-wider uppercase mb-3">Experience</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Where I've contributed
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-accent-primary/30 via-accent-secondary/20 to-transparent" />

          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const config = getTypeConfig(exp.type);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex gap-6 md:gap-8"
                >
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-3.5 h-3.5 md:w-[22px] md:h-[22px] rounded-full ${config.bg} border ${config.border} flex items-center justify-center mt-1`}>
                      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary`} />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="glass-card p-5 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-heading font-semibold text-white">{exp.title}</h3>
                        <p className={`text-sm ${config.color} font-body`}>{exp.organization}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-body font-medium ${config.color} ${config.bg} border ${config.border} rounded-full`}>
                          {config.tag}
                        </span>
                        <span className="text-xs text-dark-500 font-body">{exp.period}</span>
                      </div>
                    </div>
                    <p className="text-dark-400 text-sm font-body leading-relaxed">{exp.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-4">
          {achievements.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card p-5 text-center"
            >
              <div className={`text-xl font-heading font-bold ${item.color} mb-1`}>{item.value}</div>
              <div className="text-xs text-dark-400 font-body">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
