import { motion } from 'framer-motion';

const PageIntro = ({ eyebrow, title, description }) => (
  <section className="page-intro">
    <div className="container-width">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="page-eyebrow"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="page-title"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="page-description"
      >
        {description}
      </motion.p>
    </div>
  </section>
);

export default PageIntro;
