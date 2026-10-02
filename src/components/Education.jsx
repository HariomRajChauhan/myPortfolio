import { motion } from 'framer-motion';

const Education = () => {
  const highlights = [
    'Currently in 3rd Year, 2nd Part (Semester 6)',
    'Software Engineering Minor Project: AI-based Crop Disease Detection',
    'Technical documentation using LaTeX for project proposals and reports',
    'Active member of ACES (Association of Computer Engineering Students)',
  ];

  return (
    <section id="education" className="section-padding relative">
      <div className="container-width">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-accent-primary text-sm font-body font-medium tracking-wider uppercase mb-3">Education</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Academic background
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-start gap-5">
              {/* Icon */}
              <div className="hidden md:flex w-14 h-14 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl items-center justify-center flex-shrink-0 shadow-glow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-1">
                      B.E. in Computer Engineering
                    </h3>
                    <p className="text-accent-primary text-sm font-body font-medium">IOE Purwanchal Campus</p>
                    <p className="text-dark-500 text-xs font-body mt-0.5">Dharan, Nepal</p>
                  </div>
                  <div className="md:text-right flex-shrink-0">
                    <span className="inline-block px-3 py-1.5 text-xs font-body font-medium text-accent-primary bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
                      3rd Year, 2nd Part
                    </span>
                    <p className="text-dark-500 text-xs font-body mt-2">Roll No: PUR080BCT033</p>
                    <p className="text-dark-600 text-[11px] font-body mt-0.5">Expected: 2027/2028</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="pt-5 border-t border-white/[0.05]">
                  <h4 className="text-sm text-white font-heading font-medium mb-3">Academic Highlights</h4>
                  <ul className="space-y-2.5">
                    {highlights.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-start gap-2.5 text-dark-300 text-sm font-body"
                      >
                        <svg className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-card p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-dark-500 font-body">Campus Location</p>
                <p className="text-sm text-dark-200 font-body">Dharan, Sunsari, Nepal</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-card p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-secondary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-dark-500 font-body">Affiliation</p>
                <p className="text-sm text-dark-200 font-body">IOE, Tribhuvan University</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
