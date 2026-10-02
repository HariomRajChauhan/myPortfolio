import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import PageIntro from '../components/PageIntro';
import PageTransition from '../components/PageTransition';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [channelUrl, setChannelUrl] = useState('https://www.youtube.com/@techhrch/videos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/videos')
      .then((response) => {
        setVideos(response.data.videos || []);
        setChannelUrl(response.data.channelUrl || channelUrl);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <PageIntro
        eyebrow="Videos"
        title="Notes, builds, and ideas in motion."
        description="A growing collection of videos from Tech HRCH, covering projects, tools, experiments, and the learning process behind them."
      />
      <section className="content-page-section">
        <div className="container-width">
          <div className="videos-toolbar">
            <p>{loading ? 'Loading videos...' : `${videos.length} video${videos.length === 1 ? '' : 's'} available`}</p>
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="youtube-channel-link">
              Visit Tech HRCH on YouTube
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8l4 4m0 0-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {!loading && videos.length === 0 ? (
            <div className="videos-empty-state">
              <h2>Videos will appear here soon.</h2>
              <p>Visit the channel for the latest uploads while this collection is being curated.</p>
              <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="button-primary">Open YouTube channel</a>
            </div>
          ) : (
            <div className="videos-grid">
              {videos.map((video, index) => (
                <motion.article
                  key={video._id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index, 5) * 0.07 }}
                  className="video-card"
                >
                  <Link to={`/videos/${video._id}`} className="video-thumbnail">
                    {video.thumbnailUrl && <img src={video.thumbnailUrl} alt="" />}
                    <span className="video-play-button" aria-hidden="true">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z" /></svg>
                    </span>
                  </Link>
                  <div className="video-card-content">
                    <p>{new Date(video.publishedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
                    <h2><Link to={`/videos/${video._id}`}>{video.title}</Link></h2>
                    <div className="video-description line-clamp-2">{video.description}</div>
                    <Link to={`/videos/${video._id}`} className="video-watch-link">Watch video <span aria-hidden="true">→</span></Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default VideosPage;
