import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageIntro from '../components/PageIntro';
import PageTransition from '../components/PageTransition';

const blogTopics = [
  { title: 'Engineering notes', description: 'Build logs, implementation decisions, and lessons from projects.' },
  { title: 'Design thinking', description: 'Thoughts on improving the clarity, usability, and visual systems of digital products.' },
  { title: 'Learning in public', description: 'Notes from coursework, workshops, and the ongoing path through computer engineering.' },
];

const BlogsPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/blogs')
      .then((response) => setPosts(response.data))
      .catch(() => undefined);
  }, []);

  return (
    <PageTransition>
    <PageIntro
      eyebrow="Blogs"
      title="Notes from the workbench."
      description="A space for build logs, design observations, and lessons from learning computer engineering in public."
    />
    <section className="content-page-section">
      <div className="container-width">
        {posts.length > 0 ? (
          <div className="blog-card-list">
            {posts.map((post, index) => (
              <article
                key={post._id}
                className={`topic-card blog-card-row ${index % 2 === 1 ? 'blog-card-row-reverse' : ''}`}
              >
                <div className="topic-card-body">
                  <p className="page-eyebrow">{post.tags?.[0] || 'Writing'}</p>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link to={`/blogs/${post.slug}`} className="inline-flex mt-5 text-sm font-medium text-accent-primary hover:text-accent-tertiary transition-colors">
                    Read article
                  </Link>
                </div>
                {post.coverImage && (
                  <div className="topic-card-cover-wrap">
                    <img className="topic-card-cover" src={post.coverImage} alt="" loading="lazy" />
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <>
            <div className="writing-callout">
              <div>
                <p className="page-eyebrow">Coming soon</p>
                <h2>Writing is in progress.</h2>
                <p>The first notes are being prepared. Until then, the best place to follow the work is GitHub.</p>
              </div>
              <a href="https://github.com/HariomRajChauhan" target="_blank" rel="noopener noreferrer" className="button-primary">Visit GitHub</a>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {blogTopics.map((topic) => (
                <article key={topic.title} className="topic-card">
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                </article>
              ))}
            </div>
            <Link to="/community" className="inline-flex mt-8 text-sm text-accent-primary hover:text-accent-tertiary transition-colors">Explore community work instead</Link>
          </>
        )}
      </div>
    </section>
    </PageTransition>
  );
};

export default BlogsPage;
