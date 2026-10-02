import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import PageIntro from '../components/PageIntro';
import PageTransition from '../components/PageTransition';

const fallbackCommunities = [
  { name: 'ACES', role: 'Technical Manager', copy: 'Association of Computer Engineering Students, focused on creating useful technical and learning experiences on campus.' },
  { name: 'Taranga', role: 'Graphics Lead', copy: 'The Wave of Technology, a national-level tech festival where design helped give a large event a clear identity.' },
  { name: 'IOE Purwanchal Campus', role: 'Student & mentor', copy: 'The place where coursework, peer learning, workshops, and project collaboration come together.' },
];

const CommunityPage = () => {
  const [communities, setCommunities] = useState(fallbackCommunities);

  useEffect(() => {
    axios.get('/api/community')
      .then((response) => {
        if (response.data.length > 0) setCommunities(response.data);
      })
      .catch(() => undefined);
  }, []);

  return (
    <PageTransition>
    <PageIntro
      eyebrow="Community"
      title="Better work is collaborative."
      description="The student communities and events that have helped shape how I lead, design, teach, and build with others."
    />
    <section className="content-page-section">
      <div className="container-width space-y-4">
        {communities.map((community, index) => (
          <motion.article
            key={community.name}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="community-card"
          >
            <div className="community-number">0{index + 1}</div>
            <div>
              <p>{community.role}</p>
              <h2>{community.name}</h2>
              <span>{community.description || community.copy}</span>
            </div>
          </motion.article>
        ))}
      </div>
      </section>
    </PageTransition>
  );
};

export default CommunityPage;
