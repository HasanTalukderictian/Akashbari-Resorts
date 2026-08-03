// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Header from './Common/Header';
// import Footer from './Common/Footer';
// import axios from 'axios';
// import '../css/blog.css';
// import '../css/blogdetails.css';

// // Import fallback images (only for error cases)
// import king1 from '../image/section/Blog/Blog_image-1.webp';
// import king2 from '../image/section/Blog/Blog_image-2.webp';
// import king3 from '../image/section/Blog/Blog_image-3.webp';
// import king4 from '../image/section/Blog/Blog_image-5.webp';
// import king5 from '../image/section/Blog/Blog_image-6.webp';
// import king6 from '../image/section/Blog/Blog_image-7.webp';

// const fallbackImages = [king1, king2, king3, king4, king5, king6];

// // Use environment variables for API URLs
// const API_BASE_URL = import.meta.env.VITE_BASE_URL;
// const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

// // Helper function to get full image URL - COMPLETELY FIXED (no hardcoded URLs)
// const getImageUrl = (imagePath) => {
//   if (!imagePath) return null;
  
//   // If already a full URL, return as is
//   if (imagePath.startsWith('http')) return imagePath;
  
//   // Clean the path - remove any leading slashes
//   let cleanPath = imagePath;
//   if (cleanPath.startsWith('/')) {
//     cleanPath = cleanPath.substring(1);
//   }
  
//   // Get base URL without /api
//   const baseUrl = API_URL.replace('/api', '');
  
//   // For Laravel storage, the correct URL structure is: {BASE_URL}/storage/{path}
//   const imageUrl = `${baseUrl}/storage/${cleanPath}`;
  
//   console.log('Original path:', imagePath);
//   console.log('Generated image URL:', imageUrl);
  
//   return imageUrl;
// };

// const BlogDetails = () => {
//   const brandColor = '#5e2e10';
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [blogPost, setBlogPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageError, setImageError] = useState(false);

//   // পেজ লোড হলে টপে স্ক্রল করার জন্য
//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'instant'
//     });
//   }, [id]);

//   useEffect(() => {
//     const fetchBlogDetails = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
        
//         console.log('API Response:', response.data);
        
//         if (response.data.status === true) {
//           const blog = response.data.data;
          
//           // Parse sections if it's a string
//           let sections = blog.sections;
//           if (typeof sections === 'string') {
//             try {
//               sections = JSON.parse(sections);
//             } catch (e) {
//               sections = [];
//             }
//           }
          
//           // Generate image URL
//           const imageUrl = getImageUrl(blog.image);
//           console.log('Generated image URL for blog:', imageUrl);
          
//           // Format the blog data
//           const formattedBlog = {
//             id: blog.id,
//             title: blog.title,
//             slug: blog.slug,
//             excerpt: blog.excerpt,
//             author: blog.author,
//             category: blog.category,
//             date: blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', {
//               year: 'numeric',
//               month: 'long',
//               day: 'numeric'
//             }) : '2024-01-01',
//             img: imageUrl || fallbackImages[blog.id % fallbackImages.length],
//             readTime: blog.read_time || '5 min read',
//             views: blog.views || 0,
//             likes: blog.likes || 0,
//             status: blog.status,
//             content: {
//               introduction: blog.introduction || '',
//               sections: sections || [],
//               conclusion: blog.conclusion || ''
//             }
//           };
          
//           console.log('Formatted blog post:', formattedBlog);
//           setBlogPost(formattedBlog);
//         } else {
//           setError('Blog post not found');
//         }
//       } catch (err) {
//         console.error('Error fetching blog details:', err);
//         setError('Failed to load blog post. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchBlogDetails();
//     }
//   }, [id]);

//   // Handle image error - use fallback
//   const handleImageError = () => {
//     console.log('Image failed to load, using fallback');
//     if (!imageError) {
//       setImageError(true);
//     }
//   };

//   // Get final image URL with fallback
//   const getFinalImageUrl = () => {
//     if (imageError || !blogPost?.img) {
//       return fallbackImages[0];
//     }
//     return blogPost.img;
//   };

//   if (loading) {
//     return (
//       <>
//         <Header />
//         <div className="text-center py-5" style={{ minHeight: '60vh' }}>
//           <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: brandColor }}>
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3 text-muted">Loading blog post...</p>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   if (error || !blogPost) {
//     return (
//       <>
//         <Header />
//         <div className="text-center py-5" style={{ minHeight: '60vh' }}>
//           <div className="error-icon mb-4">
//             <span style={{ fontSize: '64px' }}>📄</span>
//           </div>
//           <h2 className="text-danger mb-4">{error || 'No Blog Data Found!'}</h2>
//           <p className="text-muted mb-4">The blog post you're looking for doesn't exist or has been moved.</p>
//           <button 
//             className="btn px-4 py-2 rounded-pill"
//             onClick={() => navigate('/blog')}
//             style={{ fontWeight: '600', backgroundColor: brandColor, color: 'white', border: 'none' }}
//           >
//             ← Back to Blog
//           </button>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
      
//       {/* Banner Section */}
//       <section className="blog-banner text-center d-flex flex-column justify-content-center" style={{ 
//         minHeight: '400px',
//         background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getFinalImageUrl()})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed'
//       }}>
//         <div className="container">
//           <div className="breadcrumb-wrapper mb-3">
//             <span className="text-white-50">Home</span>
//             <span className="mx-2" style={{ color: brandColor }}>›</span>
//             <span className="text-white-50">Blog</span>
//             <span className="mx-2" style={{ color: brandColor }}>›</span>
//             <span className="text-white">Details</span>
//           </div>
//           <h1 className="blog-title serif mb-3 text-white" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
//             {blogPost.title}
//           </h1>
//           <div className="blog-meta text-white-50 d-flex justify-content-center gap-4 flex-wrap">
//             <span>📅 {blogPost.date}</span>
//             <span>✍️ By {blogPost.author}</span>
//             <span>⏱️ {blogPost.readTime}</span>
//             <span>📚 {blogPost.category}</span>
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="blog-details-content py-5">
//         <div className="container">
//           <div className="row g-5">
//             {/* Left Column - Main Content */}
//             <div className="col-lg-8">
//               {/* Introduction */}
//               {blogPost.content?.introduction && (
//                 <div className="introduction-block mb-4 p-4 rounded-4" style={{
//                   backgroundColor: '#f8f9fa',
//                   borderLeft: `4px solid ${brandColor}`
//                 }}>
//                   <p className="lead text-muted fst-italic mb-0" style={{ fontSize: '1.1rem' }}>
//                     "{blogPost.content.introduction}"
//                   </p>
//                 </div>
//               )}
              
//               {/* Featured Image */}
//               <div className="detail-img-wrapper mb-5 position-relative overflow-hidden rounded-4 shadow-lg">
//                 <img 
//                   src={getFinalImageUrl()} 
//                   alt={blogPost.title} 
//                   className="img-fluid w-100"
//                   style={{ 
//                     maxHeight: '500px', 
//                     objectFit: 'cover',
//                     transition: 'transform 0.3s ease'
//                   }}
//                   onError={handleImageError}
//                 />
//                 <div className="position-absolute bottom-0 start-0 text-white px-3 py-1 m-3 rounded-pill" style={{ fontSize: '12px', backgroundColor: brandColor }}>
//                   {blogPost.category}
//                 </div>
//               </div>

//               {/* Content Sections */}
//               {blogPost.content?.sections && blogPost.content.sections.length > 0 && (
//                 <>
//                   {blogPost.content.sections.map((section, idx) => (
//                     <div key={idx} className="section-block mb-5">
//                       <h3 className="serif h4 mb-3 pb-2" style={{ 
//                         color: '#2c3e50',
//                         borderLeft: `3px solid ${brandColor}`,
//                         paddingLeft: '15px'
//                       }}>
//                         {section.title}
//                       </h3>
//                       <p className="text-muted lh-lg" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
//                         {section.content}
//                       </p>
//                     </div>
//                   ))}
//                 </>
//               )}

//               {/* Conclusion */}
//               {blogPost.content?.conclusion && (
//                 <div className="conclusion-block mt-5 p-4 rounded-4" style={{
//                   background: `linear-gradient(135deg, ${brandColor} 0%, #3d1f0a 100%)`,
//                   color: 'white'
//                 }}>
//                   <h4 className="serif mb-3">✨ Conclusion</h4>
//                   <p className="mb-0 fs-5" style={{ lineHeight: '1.6' }}>{blogPost.content.conclusion}</p>
//                 </div>
//               )}

//               {/* Stats & Share */}
//               <div className="mt-4 pt-3 d-flex justify-content-between align-items-center border-top">
//                 <div className="d-flex gap-4">
//                   <span className="text-muted">👁️ {blogPost.views.toLocaleString()} views</span>
//                   <span className="text-muted">❤️ {blogPost.likes} likes</span>
//                 </div>
//                 <div className="share-buttons">
//                   <span className="text-muted me-2">Share:</span>
//                   <a href="#" className="text-decoration-none me-2" style={{ color: brandColor }}>📘</a>
//                   <a href="#" className="text-decoration-none me-2" style={{ color: brandColor }}>🐦</a>
//                   <a href="#" className="text-decoration-none" style={{ color: brandColor }}>📌</a>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Sidebar */}
//             <div className="col-lg-4">
//               {/* About Author Card */}
//               <div className="sidebar-card mb-4 p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#ffffff', border: `1px solid ${brandColor}30` }}>
//                 <h5 className="serif mb-3" style={{ color: brandColor }}>✍️ About the Author</h5>
//                 <div className="d-flex align-items-center mb-3">
//                   <div className="rounded-circle me-3 d-flex align-items-center justify-content-center" style={{
//                     width: '50px',
//                     height: '50px',
//                     background: brandColor,
//                     fontSize: '24px',
//                     color: 'white'
//                   }}>
//                     {blogPost.author?.charAt(0) || 'A'}
//                   </div>
//                   <div>
//                     <strong className="d-block" style={{ color: brandColor }}>{blogPost.author}</strong>
//                     <small className="text-muted">Content Writer & Hospitality Expert</small>
//                   </div>
//                 </div>
//                 <p className="text-muted small mb-0">
//                   Passionate about sharing insights on luxury travel, hospitality, and creating unforgettable experiences for guests worldwide.
//                 </p>
//               </div>

//               {/* Blog Info Card */}
//               <div className="sidebar-card mb-4 p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#ffffff', border: `1px solid ${brandColor}30` }}>
//                 <h5 className="serif mb-4" style={{ color: brandColor }}>ℹ️ Blog Info</h5>
//                 <ul className="list-unstyled">
//                   <li className="mb-3 d-flex justify-content-between">
//                     <strong className="text-muted">Status:</strong>
//                     <span className={`badge ${blogPost.status === 'Published' ? '' : 'bg-warning'} px-3 py-2 rounded-pill`} style={{ backgroundColor: blogPost.status === 'Published' ? brandColor : '#ffc107' }}>
//                       {blogPost.status}
//                     </span>
//                   </li>
//                   <li className="mb-3 d-flex justify-content-between">
//                     <strong className="text-muted">Category:</strong>
//                     <span className="text-dark">{blogPost.category}</span>
//                   </li>
//                   <li className="mb-3 d-flex justify-content-between">
//                     <strong className="text-muted">Published:</strong>
//                     <span className="text-dark">{blogPost.date}</span>
//                   </li>
//                   <li className="mb-3 d-flex justify-content-between">
//                     <strong className="text-muted">Reading Time:</strong>
//                     <span className="text-dark">{blogPost.readTime}</span>
//                   </li>
//                   <li className="d-flex justify-content-between">
//                     <strong className="text-muted">Total Views:</strong>
//                     <span className="text-dark">{blogPost.views.toLocaleString()}</span>
//                   </li>
//                 </ul>
//               </div>

//               {/* Book Now CTA */}
//               <div className="book-now-card position-relative rounded-4 overflow-hidden shadow-lg mb-4" style={{ minHeight: '250px' }}>
//                 <div className="position-absolute top-0 start-0 w-100 h-100">
//                   <img 
//                     src={getFinalImageUrl()} 
//                     alt="Book your stay" 
//                     className="img-fluid w-100 h-100"
//                     style={{ objectFit: 'cover' }}
//                     onError={handleImageError}
//                   />
//                   <div className="position-absolute top-0 start-0 w-100 h-100" style={{
//                     background: `linear-gradient(135deg, ${brandColor}CC 0%, ${brandColor}99 100%)`
//                   }}></div>
//                 </div>
//                 <div className="book-content p-4 position-relative text-white" style={{ zIndex: 1 }}>
//                   <div className="mb-3">
//                     <span style={{ fontSize: '40px' }}>🏨</span>
//                   </div>
//                   <h4 className="serif mb-3" style={{ fontWeight: '700' }}>Book Your Stay</h4>
//                   <p className="small mb-4 text-white-50">Check availability and choose the perfect room for your needs.</p>
//                   <button className="btn w-100 fw-bold py-2 rounded-pill" style={{ fontWeight: '600', backgroundColor: '#ffffff', color: brandColor }}>
//                     Book Now <span className="ms-2">→</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Back Button */}
//               <button 
//                 className="btn w-100 mt-2 py-2 rounded-pill"
//                 onClick={() => navigate('/blog')}
//                 style={{ fontWeight: '500', backgroundColor: brandColor, color: 'white', border: 'none' }}
//               >
//                 ← Back to All Blogs
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
      
//       <Footer />
//     </>
//   );
// };

// export default BlogDetails;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Common/Header';
import Footer from './Common/Footer';
import axios from 'axios';
import '../css/blog.css';
import '../css/blogdetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faChevronRight, 
  faCalendar, 
  faUser, 
  faClock, 
  faBook, 
  faEye, 
  faHeart, 
  faShare, 
  faInfoCircle,
  faHotel,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
// ব্র্যান্ড আইকনগুলো আলাদাভাবে ইম্পোর্ট করতে হবে
import { 
  faFacebook, 
  faTwitter, 
  faPinterest 
} from '@fortawesome/free-brands-svg-icons';

// Import fallback images (only for error cases)
import king1 from '../image/section/Blog/Blog_image-1.webp';
import king2 from '../image/section/Blog/Blog_image-2.webp';
import king3 from '../image/section/Blog/Blog_image-3.webp';
import king4 from '../image/section/Blog/Blog_image-5.webp';
import king5 from '../image/section/Blog/Blog_image-6.webp';
import king6 from '../image/section/Blog/Blog_image-7.webp';

const fallbackImages = [king1, king2, king3, king4, king5, king6];

// Use environment variables for API URLs
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

// Helper function to get full image URL - COMPLETELY FIXED (no hardcoded URLs)
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Clean the path - remove any leading slashes
  let cleanPath = imagePath;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  // Get base URL without /api
  const baseUrl = API_URL.replace('/api', '');
  
  // For Laravel storage, the correct URL structure is: {BASE_URL}/storage/{path}
  const imageUrl = `${baseUrl}/storage/${cleanPath}`;
  
  console.log('Original path:', imagePath);
  console.log('Generated image URL:', imageUrl);
  
  return imageUrl;
};

const BlogDetails = () => {
  const brandColor = '#5e2e10';
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // পেজ লোড হলে টপে স্ক্রল করার জন্য
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [id]);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
        
        console.log('API Response:', response.data);
        
        if (response.data.status === true) {
          const blog = response.data.data;
          
          // Parse sections if it's a string
          let sections = blog.sections;
          if (typeof sections === 'string') {
            try {
              sections = JSON.parse(sections);
            } catch (e) {
              sections = [];
            }
          }
          
          // Generate image URL
          const imageUrl = getImageUrl(blog.image);
          console.log('Generated image URL for blog:', imageUrl);
          
          // Format the blog data
          const formattedBlog = {
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            author: blog.author,
            category: blog.category,
            date: blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : '2024-01-01',
            img: imageUrl || fallbackImages[blog.id % fallbackImages.length],
            readTime: blog.read_time || '5 min read',
            views: blog.views || 0,
            likes: blog.likes || 0,
            status: blog.status,
            content: {
              introduction: blog.introduction || '',
              sections: sections || [],
              conclusion: blog.conclusion || ''
            }
          };
          
          console.log('Formatted blog post:', formattedBlog);
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

  // Handle image error - use fallback
  const handleImageError = () => {
    console.log('Image failed to load, using fallback');
    if (!imageError) {
      setImageError(true);
    }
  };

  // Get final image URL with fallback
  const getFinalImageUrl = () => {
    if (imageError || !blogPost?.img) {
      return fallbackImages[0];
    }
    return blogPost.img;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="text-center py-5" style={{ minHeight: '60vh' }}>
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: brandColor }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading blog post...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blogPost) {
    return (
      <>
        <Header />
        <div className="text-center py-5" style={{ minHeight: '60vh' }}>
          <div className="error-icon mb-4">
            <span style={{ fontSize: '64px' }}>📄</span>
          </div>
          <h2 className="text-danger mb-4">{error || 'No Blog Data Found!'}</h2>
          <p className="text-muted mb-4">The blog post you're looking for doesn't exist or has been moved.</p>
          <button 
            className="btn px-4 py-2 rounded-pill"
            onClick={() => navigate('/blog')}
            style={{ fontWeight: '600', backgroundColor: brandColor, color: 'white', border: 'none' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to Blog
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
      <section className="blog-banner text-center d-flex flex-column justify-content-center" style={{ 
        minHeight: '400px',
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${getFinalImageUrl()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="container">
          <div className="breadcrumb-wrapper mb-3">
            <span className="text-white-50">
              <FontAwesomeIcon icon={faHome} className="me-1" /> Home
            </span>
            <span className="mx-2" style={{ color: brandColor }}>
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
            <span className="text-white-50">Blog</span>
            <span className="mx-2" style={{ color: brandColor }}>
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
            <span className="text-white">Details</span>
          </div>
          <h1 className="blog-title serif mb-3 text-white" style={{ fontSize: '2.5rem', fontWeight: '700' }}>
            {blogPost.title}
          </h1>
          <div className="blog-meta text-white-50 d-flex justify-content-center gap-4 flex-wrap">
            <span>
              <FontAwesomeIcon icon={faCalendar} className="me-1" /> {blogPost.date}
            </span>
            <span>
              <FontAwesomeIcon icon={faUser} className="me-1" /> By {blogPost.author}
            </span>
            <span>
              <FontAwesomeIcon icon={faClock} className="me-1" /> {blogPost.readTime}
            </span>
            <span>
              <FontAwesomeIcon icon={faBook} className="me-1" /> {blogPost.category}
            </span>
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
              {blogPost.content?.introduction && (
                <div className="introduction-block mb-4 p-4 rounded-4" style={{
                  backgroundColor: '#f8f9fa',
                  borderLeft: `4px solid ${brandColor}`
                }}>
                  <p className="lead text-muted fst-italic mb-0" style={{ fontSize: '1.1rem' }}>
                    "{blogPost.content.introduction}"
                  </p>
                </div>
              )}
              
              {/* Featured Image */}
              <div className="detail-img-wrapper mb-5 position-relative overflow-hidden rounded-4 shadow-lg">
                <img 
                  src={getFinalImageUrl()} 
                  alt={blogPost.title} 
                  className="img-fluid w-100"
                  style={{ 
                    maxHeight: '500px', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={handleImageError}
                />
                <div className="position-absolute bottom-0 start-0 text-white px-3 py-1 m-3 rounded-pill" style={{ fontSize: '12px', backgroundColor: brandColor }}>
                  {blogPost.category}
                </div>
              </div>

              {/* Content Sections */}
              {blogPost.content?.sections && blogPost.content.sections.length > 0 && (
                <>
                  {blogPost.content.sections.map((section, idx) => (
                    <div key={idx} className="section-block mb-5">
                      <h3 className="serif h4 mb-3 pb-2" style={{ 
                        color: '#2c3e50',
                        borderLeft: `3px solid ${brandColor}`,
                        paddingLeft: '15px'
                      }}>
                        {section.title}
                      </h3>
                      <p className="text-muted lh-lg" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                        {section.content}
                      </p>
                    </div>
                  ))}
                </>
              )}

              {/* Conclusion */}
              {blogPost.content?.conclusion && (
                <div className="conclusion-block mt-5 p-4 rounded-4" style={{
                  background: `linear-gradient(135deg, ${brandColor} 0%, #3d1f0a 100%)`,
                  color: 'white'
                }}>
                  <h4 className="serif mb-3">Conclusion</h4>
                  <p className="mb-0 fs-5" style={{ lineHeight: '1.6' }}>{blogPost.content.conclusion}</p>
                </div>
              )}

              {/* Stats & Share */}
              <div className="mt-4 pt-3 d-flex justify-content-between align-items-center border-top">
                <div className="d-flex gap-4">
                  <span className="text-muted">
                    <FontAwesomeIcon icon={faEye} className="me-1" /> {blogPost.views.toLocaleString()} views
                  </span>
                  <span className="text-muted">
                    <FontAwesomeIcon icon={faHeart} className="me-1" /> {blogPost.likes} likes
                  </span>
                </div>
                <div className="share-buttons">
                  <span className="text-muted me-2">
                    <FontAwesomeIcon icon={faShare} /> Share:
                  </span>
                  <a href="#" className="text-decoration-none me-2" style={{ color: brandColor }}>
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                  <a href="#" className="text-decoration-none me-2" style={{ color: brandColor }}>
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a href="#" className="text-decoration-none" style={{ color: brandColor }}>
                    <FontAwesomeIcon icon={faPinterest} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-lg-4">
              {/* About Author Card */}
              <div className="sidebar-card mb-4 p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#ffffff', border: `1px solid ${brandColor}30` }}>
                <h5 className="serif mb-3" style={{ color: brandColor }}>
                  <FontAwesomeIcon icon={faUser} className="me-2" /> About the Author
                </h5>
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle me-3 d-flex align-items-center justify-content-center" style={{
                    width: '50px',
                    height: '50px',
                    background: brandColor,
                    fontSize: '24px',
                    color: 'white'
                  }}>
                    {blogPost.author?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <strong className="d-block" style={{ color: brandColor }}>{blogPost.author}</strong>
                    <small className="text-muted">Content Writer & Hospitality Expert</small>
                  </div>
                </div>
                <p className="text-muted small mb-0">
                  Passionate about sharing insights on luxury travel, hospitality, and creating unforgettable experiences for guests worldwide.
                </p>
              </div>

              {/* Blog Info Card */}
              <div className="sidebar-card mb-4 p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#ffffff', border: `1px solid ${brandColor}30` }}>
                <h5 className="serif mb-4" style={{ color: brandColor }}>
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> Blog Info
                </h5>
                <ul className="list-unstyled">
                  <li className="mb-3 d-flex justify-content-between">
                    <strong className="text-muted">Status:</strong>
                    <span className={`badge ${blogPost.status === 'Published' ? '' : 'bg-warning'} px-3 py-2 rounded-pill`} style={{ backgroundColor: blogPost.status === 'Published' ? brandColor : '#ffc107' }}>
                      {blogPost.status}
                    </span>
                  </li>
                  <li className="mb-3 d-flex justify-content-between">
                    <strong className="text-muted">Category:</strong>
                    <span className="text-dark">{blogPost.category}</span>
                  </li>
                  <li className="mb-3 d-flex justify-content-between">
                    <strong className="text-muted">Published:</strong>
                    <span className="text-dark">{blogPost.date}</span>
                  </li>
                  <li className="mb-3 d-flex justify-content-between">
                    <strong className="text-muted">Reading Time:</strong>
                    <span className="text-dark">{blogPost.readTime}</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <strong className="text-muted">Total Views:</strong>
                    <span className="text-dark">{blogPost.views.toLocaleString()}</span>
                  </li>
                </ul>
              </div>

              {/* Book Now CTA */}
              <div className="book-now-card position-relative rounded-4 overflow-hidden shadow-lg mb-4" style={{ minHeight: '250px' }}>
                <div className="position-absolute top-0 start-0 w-100 h-100">
                  <img 
                    src={getFinalImageUrl()} 
                    alt="Book your stay" 
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: 'cover' }}
                    onError={handleImageError}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: `linear-gradient(135deg, ${brandColor}CC 0%, ${brandColor}99 100%)`
                  }}></div>
                </div>
                <div className="book-content p-4 position-relative text-white" style={{ zIndex: 1 }}>
                  <div className="mb-3">
                    <FontAwesomeIcon icon={faHotel} style={{ fontSize: '40px' }} />
                  </div>
                  <h4 className="serif mb-3" style={{ fontWeight: '700' }}>Book Your Stay</h4>
                  <p className="small mb-4 text-white-50">Check availability and choose the perfect room for your needs.</p>
                  <button className="btn w-100 fw-bold py-2 rounded-pill" style={{ fontWeight: '600', backgroundColor: '#ffffff', color: brandColor }}>
                    Book Now <span className="ms-2">→</span>
                  </button>
                </div>
              </div>

              {/* Back Button */}
              <button 
                className="btn w-100 mt-2 py-2 rounded-pill"
                onClick={() => navigate('/blog')}
                style={{ fontWeight: '500', backgroundColor: brandColor, color: 'white', border: 'none' }}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to All Blogs
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