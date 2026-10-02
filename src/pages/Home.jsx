import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import PageTransition from '../components/PageTransition';

const workAreas = [
  {
    title: 'Projects',
    description: 'AI, systems, mobile, and full-stack experiments built to solve real problems.',
    to: '/works/projects',
    icon: '01',
  },
  {
    title: 'Experience',
    description: 'Technical leadership, visual direction, and collaborative work in student communities.',
    to: '/works/experience',
    icon: '02',
  },
  {
    title: 'Skills',
    description: 'A practical toolkit across engineering, product design, communication, and AI.',
    to: '/works/skills',
    icon: '03',
  },
];

const Home = () => (
  <PageTransition>
    <Hero />
    <About />
    <section className="section-padding pt-8 md:pt-12">
      <div className="container-width">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-9">
          <div>
            <p className="page-eyebrow">Explore</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">A closer look at my work</h2>
          </div>
          <Link to="/works/projects" className="inline-flex items-center gap-2 text-sm font-medium text-accent-primary hover:text-accent-tertiary transition-colors">
            See all work
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8l4 4m0 0-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {workAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link to={area.to} className="home-work-card group">
                <span className="home-work-index">{area.icon}</span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <span className="home-work-link">
                  Explore
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8l4 4m0 0-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageTransition>
);

export default Home;
