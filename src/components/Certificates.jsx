import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const seedCertificates = [
    {
      _id: '1',
      title: 'Software Engineering Project Certification',
      issuer: 'IOE Purwanchal Campus',
      date: '2024',
      credentialUrl: null,
      description: 'Completion of AI-based Multi-Crop Disease Detection project with full documentation.',
    },
    {
      _id: '2',
      title: 'C++ Programming Workshop',
      issuer: 'ACES, IOE Purwanchal Campus',
      date: '2023',
      credentialUrl: null,
      description: 'Participated in and assisted with C++ programming workshops for freshmen.',
    },
  ];

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get('/api/certificates');
        if (response.data && response.data.length > 0) {
          setCertificates(response.data);
        } else {
          setCertificates(seedCertificates);
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
        setCertificates(seedCertificates);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <section id="certificates" className="section-padding">
        <div className="container-width text-center">
          <div className="text-dark-500 font-body text-sm">Loading certificates...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="section-padding relative">
      <div className="container-width">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-accent-primary text-sm font-body font-medium tracking-wider uppercase mb-3">Certificates</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Recognition & achievements
          </h2>
          <div className="section-divider" />
        </motion.div>

        {certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group glass-card p-5"
              >
                {/* Certificate Icon */}
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center mb-4 group-hover:bg-accent-primary/15 transition-colors">
                  <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-sm font-heading font-semibold text-white mb-1.5 line-clamp-2 group-hover:text-accent-primary transition-colors">
                  {cert.title}
                </h3>
                <p className="text-accent-secondary text-xs font-body mb-0.5">{cert.issuer}</p>
                <p className="text-dark-600 text-[11px] font-body mb-3">{cert.date}</p>
                {cert.description && (
                  <p className="text-dark-400 text-xs font-body leading-relaxed mb-4 line-clamp-2">{cert.description}</p>
                )}

                {/* Credential Link */}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-accent-primary hover:text-accent-tertiary transition-colors font-body"
                  >
                    View Credential
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <svg className="w-7 h-7 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <p className="text-dark-500 text-sm font-body">Certificates will appear here as they are added.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
