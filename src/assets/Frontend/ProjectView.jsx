import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectView = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Environment variables
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL;

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

  // Loading state
  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading achievements...</p>
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
        <div className="alert alert-info" role="alert">
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
      <h3 className='display-4 fw-normal text-uppercase mb-2 text-center'>Our Achievement</h3>
      <p className='text-center'>Some of our Customers</p>

      {/* 1st Div/Row: Left 50% Big, Right 50% Two Small */}
      <div className="row g-3 custom-project-row">
        
        {/* Left Side: 50% Width (col-md-6) - Big Image */}
        <div className="col-md-6 big-img-col">
          <img 
            src={getImageAtIndex(0)} 
            alt={getTitleAtIndex(0)} 
            className="w-100 h-100 rounded custom-fit-img" 
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
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
              e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
            }}
          />
        </div>

      </div>

      {/* CSS Styles */}
      <style>
        {`
          .custom-fit-img {
            object-fit: cover !important;
            width: 100%;
            height: 100%;
            transition: transform 0.3s ease;
          }

          .big-img-col, .small-img-wrapper {
            overflow: hidden;
            position: relative;
          }

          .custom-fit-img:hover {
            transform: scale(1.03); 
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

          @media (max-width: 768px) {
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
          }
          
          @media (max-width: 480px) {
            .big-img-col, 
            .small-img-wrapper {
              height: 220px !important;
            }
            
            h3 {
              font-size: 22px;
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