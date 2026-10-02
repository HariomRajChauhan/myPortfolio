import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import PageTransition from '../components/PageTransition';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPost(null);
    setError(false);
    axios.get(`/api/blogs/${slug}`)
      .then((response) => setPost(response.data))
      .catch(() => setError(true));
  }, [slug]);

  return (
    <PageTransition>
      <article className="page-intro">
        <div className="container-width max-w-3xl">
          {error ? (
            <>
              <p className="page-eyebrow">Not found</p>
              <h1 className="page-title">This article is unavailable.</h1>
              <Link to="/blogs" className="inline-flex mt-7 text-sm font-medium text-accent-primary">Back to blogs</Link>
            </>
          ) : post ? (
            <>
              <p className="page-eyebrow">{post.tags?.join(' / ') || 'Writing'}</p>
              <h1 className="page-title">{post.title}</h1>
              <p className="page-description">{post.excerpt}</p>
              {post.coverImage && <img className="blog-post-cover mt-10" src={post.coverImage} alt="" />}
              <div className="blog-content mt-12">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </>
          ) : (
            <p className="page-description">Loading article...</p>
          )}
        </div>
      </article>
    </PageTransition>
  );
};

export default BlogPostPage;
