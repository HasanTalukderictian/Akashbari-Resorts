import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectView = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:8000/api';
  const STORAGE_URL = 'http://localhost:8000/storage';

  // Function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/600x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('storage/')) return `http://localhost:8000/${imagePath}`;
    return `${STORAGE_URL}/${imagePath}`;
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
      
      if (response.data.status === true && response.data.data) {
        setAchievements(response.data.data);
      } else {
        setAchievements([]);
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
  }, []);

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
  // If less than 6, we'll use available images with repetition
  const getImageAtIndex = (index) => {
    if (achievements[index]) {
      return getImageUrl(achievements[index].image);
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
      <h3 className='text-center fw-bold'>Our Achievement</h3>
      <p className='text-center'>Some of our Customers</p>

      {/* 1st Div/Row: Left 50% Big, Right 50% Two Small */}
      <div className="row g-3 custom-project-row">
        
        {/* Left Side: 50% Width (col-md-6) - Big Image */}
        <div className="col-md-6 big-img-col">
          <img 
            src={getImageAtIndex(0)} 
            alt={getTitleAtIndex(0)} 
            className="w-100 h-100 rounded custom-fit-img" 
          />
        </div>
        
        {/* Right Side: 50% Width, 2 Images Stacked */}
        <div className="col-md-6 stacked-img-col d-flex flex-column justify-content-between">
          <div className="small-img-wrapper pb-md-2">
            <img 
              src={getImageAtIndex(1)} 
              alt={getTitleAtIndex(1)} 
              className="w-100 h-100 rounded custom-fit-img" 
            />
          </div>
          <div className="small-img-wrapper pt-md-2">
            <img 
              src={getImageAtIndex(2)} 
              alt={getTitleAtIndex(2)} 
              className="w-100 h-100 rounded custom-fit-img" 
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
            />
          </div>
          <div className="small-img-wrapper pt-md-2">
            <img 
              src={getImageAtIndex(4)} 
              alt={getTitleAtIndex(4)} 
              className="w-100 h-100 rounded custom-fit-img" 
            />
          </div>
        </div>

        {/* Right Side: 50% Width (col-md-6) - Big Image */}
        <div className="col-md-6 big-img-col">
          <img 
            src={getImageAtIndex(5)} 
            alt={getTitleAtIndex(5)} 
            className="w-100 h-100 rounded custom-fit-img" 
          />
        </div>

      </div>

      {/* CSS Styles - Same as your original design */}
      <style>
        {`
          /* সব ইমেজের ফাঁকা অংশ দূর করার জন্য আপডেট করা স্টাইল */
          .custom-fit-img {
            object-fit: cover !important;
            width: 100%;
            height: 100%;
            transition: transform 0.3s ease;
          }

          /* ইমেজ বক্সের বাইরে যেন কিছু না যায় */
          .big-img-col, .small-img-wrapper {
            overflow: hidden;
            position: relative;
          }

          /* মাউস নিলে হালকা জুম হবে */
          .custom-fit-img:hover {
            transform: scale(1.03); 
          }

          /* ডেক্সটপ ও বড় স্ক্রিনের ডিফল্ট হাইট */
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

          /* মোবাইল ও ট্যাবলেট ডিভাইস (max-width: 768px) */
          @media (max-width: 768px) {
            .custom-project-row {
              height: auto !important;
            }
            
            /* প্রতিটি ইমেজ কন্টেইনার সমান আনুপাতিক হাইট পাবে */
            .big-img-col, 
            .small-img-wrapper {
              height: 280px !important;
              margin-bottom: 8px;
            }
            
            .stacked-img-col {
              height: auto !important;
            }

            /* মোবাইলে অপ্রয়োজনীয় এক্সট্রা প্যাডিং রিমুভ */
            .pb-md-2, .pt-md-2 {
              padding: 0 !important;
            }

            img {
              border-radius: 8px !important;
            }
          }
          
          /* খুব ছোট মোবাইল স্ক্রিন (max-width: 480px) */
          @media (max-width: 480px) {
            .big-img-col, 
            .small-img-wrapper {
              height: 220px !important;
            }
            
            h3 {
              font-size: 22px;
            }
          }
          
          /* মাঝারি স্ক্রিন বা ট্যাবলেট (769px - 1024px) */
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