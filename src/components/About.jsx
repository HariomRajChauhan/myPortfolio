import { motion } from 'framer-motion';

const About = () => {
  const stats = [
    { value: '3+', label: 'Years Coding', color: 'text-accent-primary' },
    { value: '2', label: 'Years Design', color: 'text-accent-secondary' },
    { value: '10+', label: 'Projects Built', color: 'text-accent-emerald' },
  ];

  return (
    <section id="about" className="section-padding relative">
      <div className="container-width">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-accent-primary text-sm font-body font-medium tracking-wider uppercase mb-3">About</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            A bit about me
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* 4:3 profile image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="about-image-wrap">
              <div className="about-image-frame">
                <img
                  src="/section1.jpeg"
                  alt="Hariom Raj Chauhan"
                  className="about-image"
                />
              </div>
              <div className="about-image-caption">
                <span>Hariom Raj Chauhan</span>
                <span>Dharan, Nepal</span>
              </div>
            </div>
          </motion.div>

          {/* Content - 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <h3 className="text-xl md:text-2xl font-heading font-semibold text-white mb-2">
              Hi, I'm Hariom Raj Chauhan
            </h3>
            <p className="text-accent-primary text-sm font-body mb-6">
              Everyone calls me <span className="font-medium">Harry</span>
            </p>
            
            <div className="space-y-4 text-dark-300 font-body leading-relaxed mb-8">
              <p>
                I'm a <span className="text-white font-medium">3rd year Computer Engineering student</span> at 
                <span className="text-white font-medium"> IOE Purwanchal Campus</span>, Dharan, Nepal. 
                What sets me apart is my unique blend of software engineering skills and creative design background.
              </p>
              <p>
                As the <span className="text-white font-medium">Technical Manager at ACES</span>, I've led technical 
                initiatives while also serving as <span className="text-white font-medium">Graphics Lead for Taranga</span>, 
                a national-level tech fest, managing all visual design aspects.
              </p>
              <p>
                I'm seeking an <span className="text-accent-primary font-medium">internship or junior role</span> in 
                full-stack development, AI/ML engineering, or UI/UX design. My dual expertise in both 
                technical implementation and visual design positions me to create products that are 
                functional and delightful to use.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass-card p-4 text-center"
                >
                  <div className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-dark-400 font-body mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
