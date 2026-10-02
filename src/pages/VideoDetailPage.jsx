import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import PageTransition from '../components/PageTransition';

const VideoDetailPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setVideo(null);
    setError(false);
    axios.get(`/api/videos/${id}`)
      .then((response) => setVideo(response.data))
      .catch(() => setError(true));
  }, [id]);

  return (
    <PageTransition>
      <article className="video-detail">
        <div className="container-width max-w-4xl">
          <Link to="/videos" className="video-back-link">← All videos</Link>
          {error ? (
            <div className="video-detail-state">
              <h1>Video unavailable.</h1>
              <p>This video may have been removed or its link may have changed.</p>
            </div>
          ) : video ? (
            <>
              <p className="page-eyebrow">Tech HRCH · {new Date(video.publishedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
              <h1>{video.title}</h1>
              {video.embedUrl && (
                <div className="video-player">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="video-detail-description whitespace-pre-line">{video.description}</div>
              <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="youtube-channel-link mt-8">Watch on YouTube <span aria-hidden="true">↗</span></a>
            </>
          ) : (
            <p className="page-description">Loading video...</p>
          )}
        </div>
      </article>
    </PageTransition>
  );
};

export default VideoDetailPage;
