import React, { useState, useEffect } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/blog.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || 'https://backend.akashbariresort.com';

// Helper function to get full image URL - FIXED for Laravel storage
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Clean the path - remove any leading slashes
  let cleanPath = imagePath;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  // Construct the full URL for Laravel storage
  const baseUrl = API_URL.replace(/\/$/, '');
  const imageUrl = `${baseUrl}/storage/${cleanPath}`;
  
  return imageUrl;
};

// Placeholder image when no image is available
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x250?text=No+Image+Available';

const Blog = () => {  
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // পেজ লোড হলে টপে স্ক্রল করার জন্য
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  // Handle image error - use placeholder
  const handleImageError = (blogId) => {
    if (!imageErrors[blogId]) {
      setImageErrors(prev => ({ ...prev, [blogId]: true }));
    }
  };

  // Get final image URL with fallback
  const getFinalImageUrl = (blog) => {
    if (imageErrors[blog.id]) {
      return PLACEHOLDER_IMAGE;
    }
    if (blog.imageUrl) {
      return blog.imageUrl;
    }
    return PLACEHOLDER_IMAGE;
  };

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`);
      
      if (response.data.status === true) {
        const blogs = response.data.data;
        
        // Transform API data to match component structure
        const formattedBlogs = blogs.map((blog) => {
          // Generate image URL from API
          const imageUrl = blog.image ? getImageUrl(blog.image) : null;
          
          return {
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            category: blog.category,
            author: blog.author,
            date: blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : '2024-01-01',
            imageUrl: imageUrl,
            originalImage: blog.image,
            introduction: blog.introduction,
            sections: blog.sections,
            conclusion: blog.conclusion,
            read_time: blog.read_time || '5 min read',
            views: blog.views || 0,
            likes: blog.likes || 0,
            status: blog.status
          };
        });
        
        setBlogData(formattedBlogs);
      } else {
        setError('Failed to load blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCardClick = (post) => {
    navigate(`/blog-details/${post.id}`, { state: { post } });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-5" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading amazing blog posts...</p>
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
              className="btn btn-warning mt-3 px-4 py-2 rounded-pill"
              onClick={() => fetchBlogs()}
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
          <div className="empty-state">
            <span style={{ fontSize: '64px' }}>📝</span>
            <h3 className="text-muted mt-3">No blog posts found</h3>
            <p className="text-muted">Check back later for new content!</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Banner Section */}
      <section className="blog-banner text-center d-flex flex-column justify-content-center">
        <div className="container">
          <div className="row">
            <div className="col-12 text-white">
              <h1 className="blog-title serif mb-2">Blog</h1>
              <div className="breadcrumb-wrapper">
                <a href="/" className="text-white text-decoration-none small">Home</a>
                <span className="separator mx-2 text-warning small">&gt;</span>
                <span className="current-page text-white small">Blog</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="blog-content-section py-5">
        <div className="container">
          <div className="row g-4">
            {blogData.map((post) => (
              <div 
                className="col-lg-4 col-md-6" 
                key={post.id} 
                onClick={() => handleCardClick(post)}
                style={{ cursor: 'pointer' }}
              >
                <div className="blog-card h-100 shadow-sm rounded-4 overflow-hidden">
                  <div className="blog-img-wrapper position-relative overflow-hidden">
                    <img 
                      src={getFinalImageUrl(post)} 
                      alt={post.title} 
                      className="img-fluid w-100" 
                      style={{ 
                        height: '250px', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onError={() => handleImageError(post.id)}
                    />
                    {post.status === 'Published' && (
                      <span className="position-absolute top-0 end-0 m-3 px-3 py-1 bg-success text-white rounded-pill small">
                        {post.status}
                      </span>
                    )}
                  </div>
                  <div className="blog-info p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="blog-category text-warning small text-uppercase fw-semibold">
                          {post.category}
                        </span>
                        <span className="text-muted small">
                          <i className="far fa-eye"></i> {post.views || 0}
                        </span>
                      </div>
                      <h4 className="blog-card-title my-3" style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700',
                        lineHeight: '1.4',
                        color: '#2c3e50'
                      }}>
                        {post.title}
                      </h4>
                      <div className="blog-meta mb-3">
                        <span className="text-muted small">
                          <i className="far fa-calendar-alt"></i> {post.date}
                        </span>
                        <span className="text-muted small ms-3">
                          <i className="far fa-user"></i> {post.author}
                        </span>
                        <span className="text-muted small ms-3">
                          <i className="far fa-clock"></i> {post.read_time}
                        </span>
                      </div>
                      <p className="blog-excerpt text-muted small" style={{ lineHeight: '1.6' }}>
                        {post.excerpt && post.excerpt.length > 100 
                          ? post.excerpt.substring(0, 100) + '...' 
                          : post.excerpt || 'Click to read more about this amazing blog post...'}
                      </p>
                    </div>
                    <button className="read-more-btn-gold mt-3 w-100 py-2 rounded-pill border-0 fw-semibold" style={{
                      background: 'linear-gradient(135deg, #ff8c32 0%, #ff8c32 100%)',
                      color: 'white',
                      transition: 'all 0.3s ease'
                    }}>
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .blog-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: white;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .blog-card:hover .blog-img-wrapper img {
          transform: scale(1.05);
        }
        
        .read-more-btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 140, 50, 0.3);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .blog-card {
          animation: fadeInUp 0.5s ease-out;
          animation-fill-mode: backwards;
        }
        
        .blog-card:nth-child(1) { animation-delay: 0.1s; }
        .blog-card:nth-child(2) { animation-delay: 0.2s; }
        .blog-card:nth-child(3) { animation-delay: 0.3s; }
        .blog-card:nth-child(4) { animation-delay: 0.4s; }
        .blog-card:nth-child(5) { animation-delay: 0.5s; }
        .blog-card:nth-child(6) { animation-delay: 0.6s; }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .blog-card-title {
            font-size: 1.1rem !important;
          }
          .blog-info {
            padding: 1rem !important;
          }
          .blog-img-wrapper img {
            height: 200px !important;
          }
        }
        
        @media (max-width: 576px) {
          .blog-img-wrapper img {
            height: 180px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Blog;