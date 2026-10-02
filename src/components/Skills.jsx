import { motion } from 'framer-motion';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Development',
      description: 'Building robust applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: 'from-accent-primary to-accent-blue',
      borderColor: 'border-accent-primary/20',
      skills: [
        { name: 'C++', level: 90 },
        { name: 'JavaScript', level: 85 },
        { name: 'React', level: 80 },
        { name: 'React Native', level: 70 },
        { name: 'Node.js / Express', level: 75 },
        { name: 'MongoDB', level: 75 },
        { name: 'MERN Stack', level: 75 },
        { name: 'TCP / Socket', level: 70 },
        { name: 'Python', level: 65 },
        { name: 'CNN / LSTM (AI)', level: 60 },
      ],
    },
    {
      title: 'Design',
      description: 'Crafting visual experiences',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      color: 'from-accent-secondary to-pink-500',
      borderColor: 'border-accent-secondary/20',
      skills: [
        { name: 'Figma (UI/UX)', level: 85 },
        { name: 'Adobe Photoshop', level: 80 },
        { name: 'Adobe InDesign', level: 75 },
        { name: 'Canva', level: 90 },
        { name: 'Design Theory', level: 80 },
      ],
    },
    {
      title: 'Other',
      description: 'Complementary expertise',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-accent-emerald to-teal-500',
      borderColor: 'border-accent-emerald/20',
      skills: [
        { name: 'Video Editing', level: 70 },
        { name: 'Social Media Mgmt', level: 75 },
        { name: 'LaTeX', level: 80 },
        { name: 'Technical Writing', level: 75 },
      ],
    },
  ];

  const techStack = ['React', 'Node.js', 'Express', 'MongoDB', 'C++', 'Python', 'Figma', 'Photoshop', 'Git', 'TCP/IP', 'LaTeX', 'REST API'];

  return (
    <section id="skills" className="section-padding relative">
      <div className="container-width">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-accent-primary text-sm font-body font-medium tracking-wider uppercase mb-3">Skills</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            My expertise
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Skill Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className={`glass-card p-6 border ${category.borderColor}`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-10`}>
                  <span className="text-white">{category.icon}</span>
                </div>
                <div>
                  <h3 className="text-base font-heading font-semibold text-white">{category.title}</h3>
                  <p className="text-xs text-dark-500 font-body">{category.description}</p>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-3 mt-5">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-dark-300 font-body">{skill.name}</span>
                      <span className="text-xs text-dark-500 font-body tabular-nums">{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-dark-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + skillIndex * 0.05, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <p className="text-center text-xs text-dark-500 uppercase tracking-widest font-body mb-6">Technologies I work with</p>
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.03 }}
                className="px-3 py-1.5 text-xs font-body text-dark-300 border border-white/[0.06] rounded-lg bg-white/[0.02] hover:bg-white/[0.05] hover:border-accent-primary/20 transition-all duration-300 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
