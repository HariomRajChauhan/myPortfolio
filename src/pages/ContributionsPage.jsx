import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import PageIntro from '../components/PageIntro';
import PageTransition from '../components/PageTransition';
import Certificates from '../components/Certificates';

const fallbackContributions = [
  {
    title: 'Technical Management at ACES',
    type: 'Leadership',
    description: 'Driving technical initiatives for the Association of Computer Engineering Students and helping create practical opportunities for peers.',
  },
  {
    title: 'Taranga: The Wave of Technology',
    type: 'Creative Direction',
    description: 'Led visual direction for a national-level technology festival, bringing consistency to its event identity and campaign materials.',
  },
  {
    title: 'C++ Guidance Workshop',
    type: 'Teaching',
    description: 'Prepared a starter-friendly session, slides, and resources to help first-year engineering students begin programming confidently.',
  },
  {
    title: 'Open-source practice',
    type: 'Development',
    description: 'I publish project work and learn in public through GitHub, with an emphasis on readable code and useful documentation.',
  },
];

const ContributionsPage = () => {
  const [contributions, setContributions] = useState(fallbackContributions);

  useEffect(() => {
    axios.get('/api/contributions')
      .then((response) => {
        if (response.data.length > 0) setContributions(response.data);
      })
      .catch(() => undefined);
  }, []);

  return (
    <PageTransition>
    <PageIntro
      eyebrow="Contributions"
      title="Work that reaches beyond a repository."
      description="A record of the communities, events, and peer learning efforts I have contributed to alongside my individual projects."
    />
    <section className="content-page-section">
      <div className="container-width grid md:grid-cols-2 gap-5">
        {contributions.map((contribution, index) => (
          <motion.article
            key={contribution.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="contribution-card"
          >
            <span>{contribution.type}</span>
            <h2>{contribution.title}</h2>
            <p>{contribution.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
      <Certificates />
    </PageTransition>
  );
};

export default ContributionsPage;
