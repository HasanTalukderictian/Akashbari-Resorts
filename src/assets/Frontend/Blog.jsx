import React, { useState, useEffect } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/blog.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

// Laravel storage image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.replace(/^\/+/, '');
  const baseUrl = API_URL.replace(/\/api\/?$/, '');
  return `${baseUrl}/storage/${cleanPath}`;
};

// via.placeholder.com বন্ধ হয়ে গেছে, তাই নিজস্ব SVG placeholder
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250">
      <rect width="100%" height="100%" fill="#f2e8d5"/>
      <text x="50%" y="50%" fill="#5e2e10" font-family="sans-serif" font-size="18"
        text-anchor="middle" dominant-baseline="middle">No Image</text>
    </svg>`
  );

// sections কখনো JSON string আসতে পারে, তাই safe parse
const parseSections = (sections) => {
  if (!sections) return [];
  if (Array.isArray(sections)) return sections;
  try {
    const parsed = JSON.parse(sections);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

const Blog = () => {
  const brandColor = '#5e2e10';
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [activePost, setActivePost] = useState(null); // modal এ যে blog খোলা

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Modal খোলা থাকলে: পেছনের scroll বন্ধ + ESC চাপলে বন্ধ
  useEffect(() => {
    if (!activePost) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setActivePost(null);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [activePost]);

  const handleImageError = (id) => {
    setImageErrors((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const getFinalImageUrl = (post) =>
    imageErrors[post.id] || !post.imageUrl ? PLACEHOLDER_IMAGE : post.imageUrl;

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`);
      if (response.data.status === true) {
        const formatted = response.data.data.map((blog) => ({
          id: blog.id,
          title: blog.title,
          excerpt: blog.excerpt,
          category: blog.category,
          author: blog.author,
          date: formatDate(blog.created_at),
          imageUrl: getImageUrl(blog.image),
          introduction: blog.introduction,
          sections: parseSections(blog.sections),
          conclusion: blog.conclusion,
          read_time: blog.read_time || '5 min read',
        }));
        setBlogData(formatted);
      } else {
        setError('Failed to load blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleWriteClick = () => {
    const visitorToken = localStorage.getItem('visitor_token');
    if (visitorToken) navigate('/write-blog');
    else navigate('/visitor-login', { state: { from: '/write-blog' } });
  };

  // ---------- Loading / Error / Empty ----------
  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-5" style={{ minHeight: '60vh' }}>
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: brandColor }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading blog posts...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="text-center py-5" style={{ minHeight: '60vh' }}>
          <div className="alert alert-danger mx-auto" style={{ maxWidth: '500px', borderRadius: '15px' }}>
            <h4 className="alert-heading">Oops! Something went wrong</h4>
            <p>{error}</p>
            <button
              className="btn mt-3 px-4 py-2 rounded-pill"
              onClick={fetchBlogs}
              style={{ backgroundColor: brandColor, color: 'white', border: 'none' }}
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (blogData.length === 0) {
    return (
      <>
        <Header />
        <div className="text-center py-5" style={{ minHeight: '60vh' }}>
          <span style={{ fontSize: '64px' }}>📝</span>
          <h3 className="text-muted mt-3">No blog posts found</h3>
          <p className="text-muted">Check back later, or share your own story!</p>
          <button
            className="btn mt-2 px-4 py-2 rounded-pill fw-semibold"
            onClick={handleWriteClick}
            style={{ backgroundColor: brandColor, color: 'white', border: 'none' }}
          >
            Write a blog
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // ---------- Main ----------
  return (
    <>
      <Header />

      {/* Banner */}
      <section className="blog-banner text-center d-flex flex-column justify-content-center">
        <div className="container">
          <div className="col-12 text-white text-center">
            <h1 className="blog-title serif mb-3">Blog</h1>
            <p
              className="lead mb-0"
              style={{
                fontSize: '1.1rem',
                fontWeight: 300,
                letterSpacing: '0.5px',
                borderLeft: `3px solid ${brandColor}`,
                borderRight: `3px solid ${brandColor}`,
                display: 'inline-block',
                padding: '0 20px',
              }}
            >
              Stories, insights, and updates from our world
            </p>
            <div>
              <button className="write-blog-btn btn mt-4 px-4 py-2 rounded-pill fw-semibold" onClick={handleWriteClick}>
                <i className="bi bi-pencil-square me-2"></i>
                Write a blog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid — short card */}
      <section className="blog-content-section py-5">
        <div className="container">
          <div className="row g-3">
            {blogData.map((post, index) => (
              <div className="col-xl-3 col-lg-4 col-md-6 col-12" key={post.id}>
                <div className="blog-card h-100" style={{ animationDelay: `${Math.min(index, 8) * 0.08}s` }}>
                  <div className="blog-img-wrapper">
                    <img
                      src={getFinalImageUrl(post)}
                      alt={post.title}
                      loading="lazy"
                      onError={() => handleImageError(post.id)}
                    />
                  </div>

                  <div className="blog-info">
                    {post.category && <span className="blog-category">{post.category}</span>}

                    <h4 className="blog-card-title">{post.title}</h4>

                    <div className="blog-meta">
                      {post.date && <span><i className="far fa-calendar-alt"></i> {post.date}</span>}
                      <span><i className="far fa-clock"></i> {post.read_time}</span>
                    </div>

                    <p className="blog-excerpt">{post.excerpt || post.introduction || ''}</p>

                    <button className="read-more-btn-gold" onClick={() => setActivePost(post)}>
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Modal — same page এ পুরো blog */}
      {activePost && (
        <div className="blog-modal-backdrop" onClick={() => setActivePost(null)}>
          <div
            className="blog-modal"
            role="dialog"
            aria-modal="true"
            aria-label={activePost.title}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="blog-modal-close" onClick={() => setActivePost(null)} aria-label="Close">
              ×
            </button>

            <img
              src={getFinalImageUrl(activePost)}
              alt={activePost.title}
              className="blog-modal-img"
              onError={() => handleImageError(activePost.id)}
            />

            <div className="blog-modal-body">
              {activePost.category && <span className="blog-category">{activePost.category}</span>}
              <h2 className="blog-modal-title">{activePost.title}</h2>
              <div className="blog-meta mb-3">
                {activePost.author && <span><i className="far fa-user"></i> {activePost.author}</span>}
                {activePost.date && <span><i className="far fa-calendar-alt"></i> {activePost.date}</span>}
                <span><i className="far fa-clock"></i> {activePost.read_time}</span>
              </div>

              {activePost.introduction && <p>{activePost.introduction}</p>}

              {activePost.sections.map((sec, i) => (
                <div key={i} className="mb-3">
                  {(sec.heading || sec.title) && <h5 className="blog-modal-heading">{sec.heading || sec.title}</h5>}
                  {(sec.content || sec.body || sec.text) && <p>{sec.content || sec.body || sec.text}</p>}
                </div>
              ))}

              {activePost.conclusion && (
                <>
                  <h5 className="blog-modal-heading">Conclusion</h5>
                  <p>{activePost.conclusion}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .blog-card {
          background: #fffaf0;
          border: 1px solid #f2e8d5;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: fadeInUp 0.5s ease-out backwards;
        }
        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 26px rgba(0,0,0,0.1);
        }
        .blog-img-wrapper { padding: 10px 10px 0; overflow: hidden; }
        .blog-img-wrapper img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 12px;
          transition: transform 0.3s ease;
        }
        .blog-card:hover .blog-img-wrapper img { transform: scale(1.04); }

        .blog-info {
          padding: 12px 14px 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .blog-category {
          color: #5e2e10;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .blog-card-title {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.35;
          color: #2c3e50;
          margin: 6px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 11px;
          color: #6c757d;
          margin-bottom: 6px;
        }
        .blog-excerpt {
          font-size: 12px;
          line-height: 1.5;
          color: #6c757d;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .read-more-btn-gold {
          margin-top: auto;
          width: 100%;
          padding: 6px 0;
          border: none;
          border-radius: 999px;
          background-color: #5e2e10;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .read-more-btn-gold:hover {
          background-color: #3d1f0a;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(94, 46, 16, 0.3);
        }

        .write-blog-btn {
          background-color: #fff;
          color: #5e2e10;
          border: none;
          transition: all 0.2s ease;
        }
        .write-blog-btn:hover {
          background-color: #5e2e10;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.25);
        }

        /* Modal */
        .blog-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        .blog-modal {
          position: relative;
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 760px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .blog-modal-close {
          position: absolute;
          top: 10px;
          right: 12px;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          color: #5e2e10;
          font-size: 24px;
          line-height: 1;
          z-index: 1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .blog-modal-img { width: 100%; height: 280px; object-fit: cover; }
        .blog-modal-body { padding: 20px 24px 28px; color: #444; line-height: 1.7; }
        .blog-modal-title { font-size: 1.6rem; font-weight: 700; color: #2c3e50; margin: 6px 0 8px; }
        .blog-modal-heading { color: #5e2e10; font-weight: 700; margin-top: 12px; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 576px) {
          .blog-modal-img { height: 200px; }
          .blog-modal-body { padding: 16px; }
          .blog-modal-title { font-size: 1.3rem; }
        }
      `}</style>
    </>
  );
};

export default Blog;