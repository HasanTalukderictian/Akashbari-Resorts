// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ProjectView = () => {
//   const [achievements, setAchievements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Environment variables
//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

//   // Brand Color
//   const brandColor = '#5e2e10';

//   // Function to get image URL - FIXED for achievements path
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return 'https://via.placeholder.com/600x400?text=No+Image';
//     if (imagePath.startsWith('http')) return imagePath;
    
//     // Remove backslashes and clean the path
//     let cleanPath = imagePath.replace(/\\/g, '/');
//     cleanPath = cleanPath.replace(/^\/+/, '');
    
//     // Get base URL without /api
//     const baseUrl = API_URL.replace('/api', '');
    
//     // Return the full URL - images are in storage/achievements folder
//     return `${baseUrl}/storage/${cleanPath}`;
//   };

//   // Fetch achievements from API
//   const fetchAchievements = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${BASE_URL}/get-achievement`, {
//         headers: {
//           'Accept': 'application/json',
//         }
//       });
      
//       console.log('Achievements data:', response.data);
//       console.log('API_URL:', API_URL);
//       console.log('BASE_URL:', BASE_URL);
      
//       if (response.data.status === true && response.data.data) {
//         setAchievements(response.data.data);
//         setError(null);
//       } else {
//         setAchievements([]);
//         setError('No achievements found');
//       }
//     } catch (error) {
//       console.error('Error fetching achievements:', error);
//       setError('Failed to load achievements. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAchievements();
//   }, [BASE_URL]);

//   // Test image URL for debugging
//   useEffect(() => {
//     if (achievements.length > 0) {
//       console.log('First image path:', achievements[0].image);
//       console.log('Generated URL:', getImageUrl(achievements[0].image));
//     }
//   }, [achievements]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="container my-5 text-center">
//         <div className="spinner-border text-primary" role="status" style={{ color: brandColor }}>
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-3" style={{ color: brandColor }}>Loading achievements...</p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="container my-5 text-center">
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//         <button 
//           onClick={() => window.location.reload()}
//           className="btn btn-primary mt-3"
//           style={{ backgroundColor: brandColor, borderColor: brandColor }}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // No data state
//   if (achievements.length === 0) {
//     return (
//       <div className="container my-5 text-center">
//         <div className="alert alert-info" role="alert" style={{ borderColor: brandColor, color: brandColor }}>
//           No achievements found.
//         </div>
//       </div>
//     );
//   }

//   // Ensure we have at least 6 images
//   const getImageAtIndex = (index) => {
//     if (achievements[index]) {
//       const imageUrl = getImageUrl(achievements[index].image);
//       console.log(`Image ${index} URL:`, imageUrl);
//       return imageUrl;
//     }
//     // If not enough images, use the first image or placeholder
//     const fallbackIndex = index % achievements.length;
//     return achievements[fallbackIndex] ? getImageUrl(achievements[fallbackIndex].image) : 'https://via.placeholder.com/600x400?text=No+Image';
//   };

//   const getTitleAtIndex = (index) => {
//     if (achievements[index]) {
//       return achievements[index].name;
//     }
//     const fallbackIndex = index % achievements.length;
//     return achievements[fallbackIndex] ? achievements[fallbackIndex].name : 'Achievement';
//   };

//   return (
//     <div className="container my-5 project-view-container">
//       <h4 className='display-4  text-uppercase mb-2 text-center' style={{ color: brandColor }}>
//         Our Achievement
//       </h4>
//       <p className='text-center' style={{ color: brandColor, opacity: 0.8 }}>
//         Some of our Customers
//       </p>

//       {/* Decorative Line */}
//       <div style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '15px',
//         marginBottom: '30px',
//       }}>
//         <span style={{
//           flex: '0 0 60px',
//           height: '2px',
//           background: `linear-gradient(90deg, transparent, ${brandColor})`,
//         }}></span>
//         <span style={{
//           color: brandColor,
//           fontSize: '18px',
//         }}>✦</span>
//         <span style={{
//           flex: '0 0 60px',
//           height: '2px',
//           background: `linear-gradient(90deg, ${brandColor}, transparent)`,
//         }}></span>
//       </div>

//       {/* 1st Div/Row: Left 50% Big, Right 50% Two Small */}
//       <div className="row g-3 custom-project-row">
        
//         {/* Left Side: 50% Width (col-md-6) - Big Image */}
//         <div className="col-md-6 big-img-col">
//           <img 
//             src={getImageAtIndex(0)} 
//             alt={getTitleAtIndex(0)} 
//             className="w-100 h-100 rounded custom-fit-img" 
//             onError={(e) => {
//               console.error('Image failed to load:', e.target.src);
//               e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
//             }}
//           />
//         </div>
        
//         {/* Right Side: 50% Width, 2 Images Stacked */}
//         <div className="col-md-6 stacked-img-col d-flex flex-column justify-content-between">
//           <div className="small-img-wrapper pb-md-2">
//             <img 
//               src={getImageAtIndex(1)} 
//               alt={getTitleAtIndex(1)} 
//               className="w-100 h-100 rounded custom-fit-img" 
//               onError={(e) => {
//                 console.error('Image failed to load:', e.target.src);
//                 e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
//               }}
//             />
//           </div>
//           <div className="small-img-wrapper pt-md-2">
//             <img 
//               src={getImageAtIndex(2)} 
//               alt={getTitleAtIndex(2)} 
//               className="w-100 h-100 rounded custom-fit-img" 
//               onError={(e) => {
//                 console.error('Image failed to load:', e.target.src);
//                 e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
//               }}
//             />
//           </div>
//         </div>

//       </div>

//       {/* 2nd Div/Row */}
//       <div className="row g-3 mt-4 mt-md-5 custom-project-row">
        
//         {/* Left Side: 50% Width, 2 Images Stacked */}
//         <div className="col-md-6 stacked-img-col d-flex flex-column justify-content-between">
//           <div className="small-img-wrapper pb-md-2">
//             <img 
//               src={getImageAtIndex(3)} 
//               alt={getTitleAtIndex(3)} 
//               className="w-100 h-100 rounded custom-fit-img" 
//               onError={(e) => {
//                 console.error('Image failed to load:', e.target.src);
//                 e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
//               }}
//             />
//           </div>
//           <div className="small-img-wrapper pt-md-2">
//             <img 
//               src={getImageAtIndex(4)} 
//               alt={getTitleAtIndex(4)} 
//               className="w-100 h-100 rounded custom-fit-img" 
//               onError={(e) => {
//                 console.error('Image failed to load:', e.target.src);
//                 e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
//               }}
//             />
//           </div>
//         </div>

//         {/* Right Side: 50% Width (col-md-6) - Big Image */}
//         <div className="col-md-6 big-img-col">
//           <img 
//             src={getImageAtIndex(5)} 
//             alt={getTitleAtIndex(5)} 
//             className="w-100 h-100 rounded custom-fit-img" 
//             onError={(e) => {
//               console.error('Image failed to load:', e.target.src);
//               e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
//             }}
//           />
//         </div>

//       </div>

//       {/* CSS Styles with Brand Color */}
//       <style>
//         {`
//           .custom-fit-img {
//             object-fit: cover !important;
//             width: 100%;
//             height: 100%;
//             transition: transform 0.3s ease;
//             border: 2px solid ${brandColor};
//           }

//           .big-img-col, .small-img-wrapper {
//             overflow: hidden;
//             position: relative;
//             border-radius: 12px;
//           }

//           .custom-fit-img:hover {
//             transform: scale(1.03); 
//           }

//           .custom-project-row {
//             height: 500px;
//           }
//           .big-img-col {
//             height: 100%;
//           }
//           .stacked-img-col {
//             height: 100%;
//           }
//           .small-img-wrapper {
//             height: 50%;
//           }

//           /* Hover overlay effect with brand color */
//           .big-img-col::after,
//           .small-img-wrapper::after {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background: linear-gradient(to bottom, transparent 50%, ${brandColor}40);
//             opacity: 0;
//             transition: opacity 0.3s ease;
//             pointer-events: none;
//             border-radius: 12px;
//           }

//           .big-img-col:hover::after,
//           .small-img-wrapper:hover::after {
//             opacity: 1;
//           }

//           /* Image border on hover */
//           .big-img-col:hover .custom-fit-img,
//           .small-img-wrapper:hover .custom-fit-img {
//             border-color: ${brandColor};
//           }

//           @media (max-width: 768px) {
//             .custom-project-row {
//               height: auto !important;
//             }
            
//             .big-img-col, 
//             .small-img-wrapper {
//               height: 280px !important;
//               margin-bottom: 8px;
//             }
            
//             .stacked-img-col {
//               height: auto !important;
//             }

//             .pb-md-2, .pt-md-2 {
//               padding: 0 !important;
//             }

//             img {
//               border-radius: 8px !important;
//             }
//           }
          
//           @media (max-width: 480px) {
//             .big-img-col, 
//             .small-img-wrapper {
//               height: 220px !important;
//             }
            
//             h3 {
//               font-size: 22px;
//             }
//           }
          
//           @media (min-width: 769px) and (max-width: 1024px) {
//             .custom-project-row {
//               height: 400px;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default ProjectView;



import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectView = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Environment variables
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

  // Brand Color
  const brandColor = '#5e2e10';

  // Function to get image URL - FIXED for achievements path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    
    // Remove backslashes and clean the path
    let cleanPath = imagePath.replace(/\\/g, '/');
    cleanPath = cleanPath.replace(/^\/+/, '');
    
    // Get base URL without /api
    const baseUrl = API_URL.replace('/api', '');
    
    // Return the full URL - images are in storage/achievements folder
    return `${baseUrl}/storage/${cleanPath}`;
  };

  // Fetch achievements from API
  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/get-achievement`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Achievements data:', response.data);
      console.log('API_URL:', API_URL);
      console.log('BASE_URL:', BASE_URL);
      
      if (response.data.status === true && response.data.data) {
        setAchievements(response.data.data);
        setError(null);
      } else {
        setAchievements([]);
        setError('No achievements found');
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to load achievements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [BASE_URL]);

  // Test image URL for debugging
  useEffect(() => {
    if (achievements.length > 0) {
      console.log('First image path:', achievements[0].image);
      console.log('Generated URL:', getImageUrl(achievements[0].image));
    }
  }, [achievements]);

  // Handle image click
  const handleImageClick = (index) => {
    if (achievements[index]) {
      const imageUrl = getImageUrl(achievements[index].image);
      setSelectedImage({
        url: imageUrl,
        title: achievements[index].name || 'Achievement Image',
        index: index
      });
      setCurrentIndex(index);
      setIsModalOpen(true);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
  };

  // Navigate to previous image
  const goToPrevious = () => {
    if (achievements.length === 0) return;
    const newIndex = currentIndex === 0 ? achievements.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    const imageUrl = getImageUrl(achievements[newIndex].image);
    setSelectedImage({
      url: imageUrl,
      title: achievements[newIndex].name || 'Achievement Image',
      index: newIndex
    });
  };

  // Navigate to next image
  const goToNext = () => {
    if (achievements.length === 0) return;
    const newIndex = currentIndex === achievements.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    const imageUrl = getImageUrl(achievements[newIndex].image);
    setSelectedImage({
      url: imageUrl,
      title: achievements[newIndex].name || 'Achievement Image',
      index: newIndex
    });
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isModalOpen) return;
      
      switch(event.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, currentIndex, achievements]);

  // Loading state
  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ color: brandColor }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3" style={{ color: brandColor }}>Loading achievements...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-3"
          style={{ backgroundColor: brandColor, borderColor: brandColor }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // No data state
  if (achievements.length === 0) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-info" role="alert" style={{ borderColor: brandColor, color: brandColor }}>
          No achievements found.
        </div>
      </div>
    );
  }

  // Ensure we have at least 6 images
  const getImageAtIndex = (index) => {
    if (achievements[index]) {
      const imageUrl = getImageUrl(achievements[index].image);
      console.log(`Image ${index} URL:`, imageUrl);
      return imageUrl;
    }
    // If not enough images, use the first image or placeholder
    const fallbackIndex = index % achievements.length;
    return achievements[fallbackIndex] ? getImageUrl(achievements[fallbackIndex].image) : 'https://via.placeholder.com/600x400?text=No+Image';
  };

  const getTitleAtIndex = (index) => {
    if (achievements[index]) {
      return achievements[index].name;
    }
    const fallbackIndex = index % achievements.length;
    return achievements[fallbackIndex] ? achievements[fallbackIndex].name : 'Achievement';
  };

  return (
    <div className="container my-5 project-view-container">
      <h4 className='display-4 text-uppercase mb-2 text-center' style={{ color: brandColor }}>
        Our Achievement
      </h4>
      <p className='text-center' style={{ color: brandColor, opacity: 0.8 }}>
        Some of our Customers
      </p>

      {/* Decorative Line */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '30px',
      }}>
        <span style={{
          flex: '0 0 60px',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${brandColor})`,
        }}></span>
        <span style={{
          color: brandColor,
          fontSize: '18px',
        }}>✦</span>
        <span style={{
          flex: '0 0 60px',
          height: '2px',
          background: `linear-gradient(90deg, ${brandColor}, transparent)`,
        }}></span>
      </div>

      {/* 1st Div/Row: Left 50% Big, Right 50% Two Small */}
      <div className="row g-3 custom-project-row">
        
        {/* Left Side: 50% Width (col-md-6) - Big Image */}
        <div className="col-md-6 big-img-col">
          <img 
            src={getImageAtIndex(0)} 
            alt={getTitleAtIndex(0)} 
            className="w-100 h-100 rounded custom-fit-img" 
            onClick={() => handleImageClick(0)}
            style={{ cursor: 'pointer' }}
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
              e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
            }}
          />
        </div>
        
        {/* Right Side: 50% Width, 2 Images Stacked */}
        <div className="col-md-6 stacked-img-col d-flex flex-column justify-content-between">
          <div className="small-img-wrapper pb-md-2">
            <img 
              src={getImageAtIndex(1)} 
              alt={getTitleAtIndex(1)} 
              className="w-100 h-100 rounded custom-fit-img" 
              onClick={() => handleImageClick(1)}
              style={{ cursor: 'pointer' }}
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
              }}
            />
          </div>
          <div className="small-img-wrapper pt-md-2">
            <img 
              src={getImageAtIndex(2)} 
              alt={getTitleAtIndex(2)} 
              className="w-100 h-100 rounded custom-fit-img" 
              onClick={() => handleImageClick(2)}
              style={{ cursor: 'pointer' }}
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
              }}
            />
          </div>
        </div>

      </div>

      {/* 2nd Div/Row */}
      <div className="row g-3 mt-4 mt-md-5 custom-project-row">
        
        {/* Left Side: 50% Width, 2 Images Stacked */}
        <div className="col-md-6 stacked-img-col d-flex flex-column justify-content-between">
          <div className="small-img-wrapper pb-md-2">
            <img 
              src={getImageAtIndex(3)} 
              alt={getTitleAtIndex(3)} 
              className="w-100 h-100 rounded custom-fit-img" 
              onClick={() => handleImageClick(3)}
              style={{ cursor: 'pointer' }}
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
              }}
            />
          </div>
          <div className="small-img-wrapper pt-md-2">
            <img 
              src={getImageAtIndex(4)} 
              alt={getTitleAtIndex(4)} 
              className="w-100 h-100 rounded custom-fit-img" 
              onClick={() => handleImageClick(4)}
              style={{ cursor: 'pointer' }}
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
              }}
            />
          </div>
        </div>

        {/* Right Side: 50% Width (col-md-6) - Big Image */}
        <div className="col-md-6 big-img-col">
          <img 
            src={getImageAtIndex(5)} 
            alt={getTitleAtIndex(5)} 
            className="w-100 h-100 rounded custom-fit-img" 
            onClick={() => handleImageClick(5)}
            style={{ cursor: 'pointer' }}
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
              e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
            }}
          />
        </div>

      </div>

      {/* Modal for Full View */}
      {isModalOpen && selectedImage && (
        <div 
          className="image-modal-overlay"
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {/* Close Button with Brand Color */}
          <button
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: '20px',
              right: '30px',
              backgroundColor: brandColor,
              border: `2px solid ${brandColor}`,
              borderRadius: '50%',
              color: '#fff',
              width: '50px',
              height: '50px',
              fontSize: '28px',
              cursor: 'pointer',
              zIndex: 10000,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',
              lineHeight: '1',
              boxShadow: '0 4px 15px rgba(94, 46, 16, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#7a3d16';
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 6px 25px rgba(94, 46, 16, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = brandColor;
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(94, 46, 16, 0.4)';
            }}
          >
            ✕
          </button>

          {/* Navigation Arrow - Left with Brand Color */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            style={{
              position: 'fixed',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: brandColor,
              border: `2px solid ${brandColor}`,
              borderRadius: '50%',
              color: '#fff',
              width: '60px',
              height: '60px',
              fontSize: '30px',
              cursor: 'pointer',
              zIndex: 10000,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',
              lineHeight: '1',
              boxShadow: '0 4px 15px rgba(94, 46, 16, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#7a3d16';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
              e.target.style.boxShadow = '0 6px 25px rgba(94, 46, 16, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = brandColor;
              e.target.style.transform = 'translateY(-50%) scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(94, 46, 16, 0.4)';
            }}
          >
            ‹
          </button>

          {/* Navigation Arrow - Right with Brand Color */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            style={{
              position: 'fixed',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: brandColor,
              border: `2px solid ${brandColor}`,
              borderRadius: '50%',
              color: '#fff',
              width: '60px',
              height: '60px',
              fontSize: '30px',
              cursor: 'pointer',
              zIndex: 10000,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',
              lineHeight: '1',
              boxShadow: '0 4px 15px rgba(94, 46, 16, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#7a3d16';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
              e.target.style.boxShadow = '0 6px 25px rgba(94, 46, 16, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = brandColor;
              e.target.style.transform = 'translateY(-50%) scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(94, 46, 16, 0.4)';
            }}
          >
            ›
          </button>

          {/* Image Counter */}
          <div
            style={{
              position: 'fixed',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#fff',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '14px',
              zIndex: 10000,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {currentIndex + 1} / {achievements.length}
          </div>

          {/* Modal Content */}
          <div 
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img 
              src={selectedImage.url}
              alt={selectedImage.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
              }}
            />
            
            {/* Image Title */}
            {selectedImage.title && (
              <div style={{
                color: '#fff',
                padding: '15px 0 0 0',
                fontSize: '18px',
                textAlign: 'center',
                maxWidth: '80%',
                marginTop: '10px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                {selectedImage.title}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS Styles with Brand Color and Modal Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scaleIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          .image-modal-content img {
            animation: scaleIn 0.3s ease;
          }

          .custom-fit-img {
            object-fit: contain !important;
            width: 100%;
            height: 100%;
            transition: transform 0.3s ease;
            border: 2px solid ${brandColor};
            box-shadow: none !important;
            background-color: #f5f5f5;
          }

          .big-img-col, .small-img-wrapper {
            overflow: hidden;
            position: relative;
            border-radius: 12px;
            box-shadow: none !important;
            background-color: #f5f5f5;
          }

          .custom-fit-img:hover {
            transform: scale(1.05);
            box-shadow: none !important;
          }

          /* Remove any box shadow on hover */
          .big-img-col:hover,
          .small-img-wrapper:hover,
          .big-img-col:hover .custom-fit-img,
          .small-img-wrapper:hover .custom-fit-img {
            box-shadow: none !important;
          }

          .custom-project-row {
            height: 500px;
          }
          .big-img-col {
            height: 100%;
          }
          .stacked-img-col {
            height: 100%;
          }
          .small-img-wrapper {
            height: 50%;
          }

          /* Hover overlay effect with brand color */
          .big-img-col::after,
          .small-img-wrapper::after {
            content: '🔍 Click to view full size';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(94, 46, 16, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            white-space: nowrap;
            z-index: 2;
          }

          .big-img-col:hover::after,
          .small-img-wrapper:hover::after {
            opacity: 1;
          }

          /* Image border on hover */
          .big-img-col:hover .custom-fit-img,
          .small-img-wrapper:hover .custom-fit-img {
            border-color: ${brandColor};
            box-shadow: none !important;
          }

          /* Modal responsive styles */
          @media (max-width: 768px) {
            .image-modal-overlay {
              padding: 10px !important;
            }
            
            .image-modal-overlay button {
              width: 40px !important;
              height: 40px !important;
              font-size: 20px !important;
            }

            .image-modal-overlay button[style*="left: 20px"] {
              left: 10px !important;
              width: 45px !important;
              height: 45px !important;
              font-size: 24px !important;
            }

            .image-modal-overlay button[style*="right: 20px"] {
              right: 10px !important;
              width: 45px !important;
              height: 45px !important;
              font-size: 24px !important;
            }

            .image-modal-overlay button[style*="top: 20px"] {
              top: 10px !important;
              right: 15px !important;
              width: 40px !important;
              height: 40px !important;
              font-size: 20px !important;
            }

            .custom-project-row {
              height: auto !important;
            }
            
            .big-img-col, 
            .small-img-wrapper {
              height: 280px !important;
              margin-bottom: 8px;
            }
            
            .stacked-img-col {
              height: auto !important;
            }

            .pb-md-2, .pt-md-2 {
              padding: 0 !important;
            }

            img {
              border-radius: 8px !important;
            }

            .big-img-col::after,
            .small-img-wrapper::after {
              font-size: 10px;
              padding: 6px 12px;
            }

            div[style*="bottom: 30px"] {
              bottom: 15px !important;
              font-size: 12px !important;
              padding: 6px 15px !important;
            }
          }
          
          @media (max-width: 480px) {
            .big-img-col, 
            .small-img-wrapper {
              height: 220px !important;
            }
            
            h3 {
              font-size: 22px;
            }

            .image-modal-overlay button[style*="left: 20px"],
            .image-modal-overlay button[style*="right: 20px"] {
              width: 35px !important;
              height: 35px !important;
              font-size: 18px !important;
            }

            .image-modal-overlay button[style*="top: 20px"] {
              width: 35px !important;
              height: 35px !important;
              font-size: 18px !important;
            }

            div[style*="bottom: 30px"] {
              font-size: 11px !important;
              padding: 4px 12px !important;
            }
          }
          
          @media (min-width: 769px) and (max-width: 1024px) {
            .custom-project-row {
              height: 400px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ProjectView;