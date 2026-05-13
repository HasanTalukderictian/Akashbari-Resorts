import React, { useState, useEffect } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import '../css/blog.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import all images (fallback images)
import king1 from '../image/section/Blog/Blog_image-1.webp';
import king2 from '../image/section/Blog/Blog_image-2.webp';
import king3 from '../image/section/Blog/Blog_image-3.webp';
import king4 from '../image/section/Blog/Blog_image-5.webp';
import king5 from '../image/section/Blog/Blog_image-6.webp';
import king6 from '../image/section/Blog/Blog_image-7.webp';

// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Fallback images array
const fallbackImages = [king1, king2, king3, king4, king5, king6];

const Blog = () => {  
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`);
      
      if (response.data.status === true) {
        const blogs = response.data.data;
        
        // Transform API data to match component structure
        const formattedBlogs = blogs.map((blog, index) => ({
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          category: blog.category,
          author: blog.author,
          date: blog.created_at ? new Date(blog.created_at).toLocaleDateString() : '2024-01-01',
          // Use API image or fallback image
          img: blog.image ? `http://localhost:8000/storage/${blog.image}` : fallbackImages[index % fallbackImages.length],
          // Store full data for details page
          introduction: blog.introduction,
          sections: blog.sections,
          conclusion: blog.conclusion,
          read_time: blog.read_time,
          views: blog.views,
          likes: blog.likes,
          status: blog.status
        }));
        
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
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
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
        <div className="text-center py-5">
          <div className="alert alert-danger mx-auto" style={{ maxWidth: '500px' }}>
            <h4 className="alert-heading">Oops! Something went wrong</h4>
            <p>{error}</p>
            <button 
              className="btn btn-warning mt-3"
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
        <div className="text-center py-5">
          <h3 className="text-muted">No blog posts found</h3>
          <p>Check back later for new content!</p>
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
                <div className="blog-card h-100">
                  <div className="blog-img-wrapper">
                    <img 
                      src={post.img} 
                      alt={post.title} 
                      className="img-fluid w-100" 
                      style={{ height: '250px', objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback to default image if API image fails
                        e.target.src = fallbackImages[post.id % fallbackImages.length];
                      }}
                    />
                  </div>
                  <div className="blog-info p-4 d-flex flex-column justify-content-between">
                    <div>
                      <span className="blog-category text-warning small text-uppercase">{post.category}</span>
                      <h4 className="blog-card-title my-3">{post.title}</h4>
                      <div className="blog-meta mb-2">
                        <span className="text-muted small">
                          <i className="far fa-calendar-alt"></i> {post.date}
                        </span>
                        <span className="text-muted small ms-3">
                          <i className="far fa-user"></i> {post.author}
                        </span>
                      </div>
                      <p className="blog-excerpt text-muted small">
                        {post.excerpt && post.excerpt.length > 100 
                          ? post.excerpt.substring(0, 100) + '...' 
                          : post.excerpt}
                      </p>
                    </div>
                    <button className="read-more-btn-gold mt-3">Read More →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Blog;