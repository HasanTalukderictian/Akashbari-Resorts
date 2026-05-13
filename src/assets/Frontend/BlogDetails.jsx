import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Common/Header';
import Footer from './Common/Footer';
import axios from 'axios';
import '../css/blog.css';
import '../css/blogdetails.css';

// Import fallback images
import king1 from '../image/section/Blog/Blog_image-1.webp';
import king2 from '../image/section/Blog/Blog_image-2.webp';
import king3 from '../image/section/Blog/Blog_image-3.webp';
import king4 from '../image/section/Blog/Blog_image-5.webp';
import king5 from '../image/section/Blog/Blog_image-6.webp';
import king6 from '../image/section/Blog/Blog_image-7.webp';

const fallbackImages = [king1, king2, king3, king4, king5, king6];
const API_BASE_URL = 'http://localhost:8000/api';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
        
        if (response.data.status === true) {
          const blog = response.data.data;
          
          // Format the blog data
          const formattedBlog = {
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            author: blog.author,
            category: blog.category,
            date: blog.created_at ? new Date(blog.created_at).toLocaleDateString() : '2024-01-01',
            img: blog.image ? `http://localhost:8000/storage/${blog.image}` : fallbackImages[blog.id % fallbackImages.length],
            readTime: blog.read_time || '5 min read',
            views: blog.views || 0,
            likes: blog.likes || 0,
            status: blog.status,
            content: {
              introduction: blog.introduction || '',
              sections: blog.sections || [],
              conclusion: blog.conclusion || ''
            }
          };
          
          setBlogPost(formattedBlog);
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        console.error('Error fetching blog details:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading blog post...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blogPost) {
    return (
      <>
        <Header />
        <div className="text-center py-5">
          <h2 className="text-danger mb-4">{error || 'No Blog Data Found!'}</h2>
          <p className="mb-4">The blog post you're looking for doesn't exist or has been moved.</p>
          <button 
            className="btn btn-warning px-4 py-2"
            onClick={() => navigate('/blog')}
          >
            ← Back to Blog
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Banner Section */}
      <section className="blog-banner text-center d-flex flex-column justify-content-center" style={{ minHeight: '400px' }}>
        <div className="container">
          <h1 className="blog-title serif mb-2 text-white">Blog Details</h1>
          <h5 className="serif display-6 mb-3 text-white">{blogPost.title}</h5>
          <div className="blog-meta text-white">
            <span className="mx-2">📅 {blogPost.date}</span>
            <span className="mx-2">|</span>
            <span className="mx-2">✍️ By {blogPost.author}</span>
            <span className="mx-2">|</span>
            <span className="mx-2">⏱️ {blogPost.readTime}</span>
            <span className="mx-2">|</span>
            <span className="mx-2">📚 {blogPost.category}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="blog-details-content py-5">
        <div className="container">
          <div className="row g-5">
            {/* Left Column - Main Content */}
            <div className="col-lg-8">
              {/* Introduction */}
              <div className="mb-4">
                <p className="lead text-muted fst-italic">
                  "{blogPost.content?.introduction || "No introduction available"}"
                </p>
              </div>
              
              {/* Featured Image */}
              <div className="detail-img-wrapper mb-5">
                <img 
                  src={blogPost.img} 
                  alt={blogPost.title} 
                  className="img-fluid w-100 rounded"
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                  onError={(e) => e.target.src = fallbackImages[0]}
                />
              </div>

              {/* Content Sections */}
              {blogPost.content?.sections && blogPost.content.sections.length > 0 && (
                <>
                  {blogPost.content.sections.map((section, idx) => (
                    <div key={idx} className="mb-5">
                      <h3 className="serif h4 mb-3 pb-2 border-bottom">{section.title}</h3>
                      <p className="text-muted lh-lg">{section.content}</p>
                    </div>
                  ))}
                </>
              )}

              {/* Conclusion */}
              {blogPost.content?.conclusion && (
                <div className="mt-5 p-4 bg-light rounded">
                  <h4 className="serif mb-3">✨ Conclusion</h4>
                  <p className="text-muted mb-0 fs-5">{blogPost.content.conclusion}</p>
                </div>
              )}

              {/* Stats */}
              <div className="mt-4 pt-3 border-top">
                <div className="d-flex gap-4">
                  <span className="text-muted">👁️ {blogPost.views.toLocaleString()} views</span>
                  <span className="text-muted">❤️ {blogPost.likes} likes</span>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-lg-4">
              {/* About Author Card */}
              <div className="sidebar-card mb-4 p-4 bg-light rounded shadow-sm">
                <h5 className="serif mb-3">✍️ About the Author</h5>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', fontSize: '24px' }}>
                    {blogPost.author?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <strong className="d-block">{blogPost.author}</strong>
                    <small className="text-muted">Content Writer</small>
                  </div>
                </div>
                <p className="text-muted small mb-0">
                  Passionate about sharing insights on luxury travel, hospitality, and unique experiences.
                </p>
              </div>

              {/* Blog Info Card */}
              <div className="sidebar-card mb-4 p-4 bg-white rounded shadow-sm">
                <h5 className="serif mb-4">ℹ️ Blog Info</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <strong>Status:</strong>{' '}
                    <span className={`badge ${blogPost.status === 'Published' ? 'bg-success' : 'bg-warning'}`}>
                      {blogPost.status}
                    </span>
                  </li>
                  <li className="mb-2">
                    <strong>Category:</strong> {blogPost.category}
                  </li>
                  <li className="mb-2">
                    <strong>Published:</strong> {blogPost.date}
                  </li>
                  <li className="mb-2">
                    <strong>Reading Time:</strong> {blogPost.readTime}
                  </li>
                </ul>
              </div>

              {/* Book Now CTA */}
              <div className="book-now-card text-white position-relative rounded overflow-hidden shadow-lg">
                <div className="position-absolute top-0 start-0 w-100 h-100">
                  <img 
                    src={blogPost.img} 
                    alt="Book your stay" 
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
                </div>
                <div className="book-content p-4 position-relative" style={{ zIndex: 1 }}>
                  <h4 className="serif mb-3">🏨 Book Your Stay</h4>
                  <p className="small mb-4">Check availability and choose the perfect room for your needs.</p>
                  <button className="btn btn-warning w-100 fw-bold py-2">
                    Book Now <span className="ms-2">→</span>
                  </button>
                </div>
              </div>

              {/* Back Button */}
              <button 
                className="btn btn-outline-secondary w-100 mt-3 py-2"
                onClick={() => navigate('/blog')}
              >
                ← Back to All Blogs
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default BlogDetails;