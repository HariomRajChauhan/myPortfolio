import { useState, useEffect } from 'react';
import axios from 'axios';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Seed certificates if API returns empty
  const seedCertificates = [
    {
      _id: '1',
      title: 'Software Engineering Project Certification',
      issuer: 'IOE Purwanchal Campus',
      date: '2024',
      credentialUrl: null, // TODO: Add if available
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
    // Add more certificates as needed
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
      <section id="certificates" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse text-gray-400">Loading certificates...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Certificates & Achievements
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Recognition for technical projects, workshops, and creative contributions
          </p>
        </div>

        {certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <div
                key={cert._id}
                className="group bg-gray-800/50 rounded-xl p-6 border border-white/5 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:-translate-y-1 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Certificate Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-purple-600/30 transition-colors">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{cert.title}</h3>
                <p className="text-purple-400 text-sm mb-1">{cert.issuer}</p>
                <p className="text-gray-500 text-xs mb-3">{cert.date}</p>
                {cert.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{cert.description}</p>
                )}

                {/* Credential Link */}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    View Credential
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📜</div>
            <p className="text-gray-400">Certificates will be displayed here as they are added.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
