import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import customer1 from '../image/section/Blog/Customer1.jpeg'
import customer2 from '../image/section/Blog/Customer2.jpeg'
import customer3 from '../image/section/Blog/Customer3.jpeg'
import customer4 from '../image/section/Blog/Customer4.jpeg'
import customer5 from '../image/section/Blog/Customer5.jpeg'
import customer6 from '../image/section/Blog/Customer6.jpg'

const Member = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static data - until backend is ready
  const staticMembersData = [
    {
      id: 1,
  
      imageUrl: customer1,
  
    },
    {
      id: 2,
     
      imageUrl: customer2,
      
    },
    {
      id: 3,
     
      imageUrl: customer3,
    
    },
    {
      id: 4,
  
      imageUrl: customer4,
   
    },
    {
      id: 5,
   
      imageUrl: customer5,
    
    },
    {
      id: 6,
   
      imageUrl: customer6,
    
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setMembers(staticMembersData);
      setLoading(false);
    }, 1000);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (members.length === 0 || loading) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, members.length, loading]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? members.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === members.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h4 className="display-4 text-dark mb-3">Our Happiest Customer</h4>
        <p className="lead text-secondary">Meet the talented people behind our success</p>
      </div>

      {/* Carousel Section */}
      <div className="position-relative bg-white rounded-4 shadow-lg overflow-hidden">
        <div className="position-relative overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
          {/* Slides Container */}
          <div
            className="d-flex"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            {members.map((member) => (
              <div key={member.id} className="flex-shrink-0" style={{ width: '100%' }}>
                <div className="position-relative">
                  {/* Image Container - Height increased from 500px to 650px */}
                  <div style={{ height: '650px', overflow: 'hidden' }}>
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-100 h-100 object-fit-cover"
                      style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  
                  {/* Member Info Overlay */}
                  <div 
                    className="position-absolute bottom-0 start-0 end-0 text-white p-4"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <h3 className="h2 fw-bold mb-2">{member.name}</h3>
                    <p className="h6 mb-2 text-warning">{member.title}</p>
                    <p className="mb-0 opacity-75" style={{ maxWidth: '80%', margin: '0 auto' }}>
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {members.length > 1 && (
            <>
              <button
                className="position-absolute top-50 start-0 translate-middle-y btn btn-dark rounded-circle p-2 mx-3"
                onClick={handlePrev}
                aria-label="Previous"
                style={{ 
                  width: '45px', 
                  height: '45px',
                  opacity: 0.7,
                  transition: 'all 0.3s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                <span className="fs-4">&#10094;</span>
              </button>
              <button
                className="position-absolute top-50 end-0 translate-middle-y btn btn-dark rounded-circle p-2 mx-3"
                onClick={handleNext}
                aria-label="Next"
                style={{ 
                  width: '45px', 
                  height: '45px',
                  opacity: 0.7,
                  transition: 'all 0.3s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                <span className="fs-4">&#10095;</span>
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {members.length > 1 && (
          <div className="d-flex justify-content-center gap-2 py-4 bg-white">
            {members.map((_, index) => (
              <button
                key={index}
                className={`rounded-pill border-0 ${index === currentIndex ? 'bg-dark' : 'bg-secondary'}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                style={{
                  width: index === currentIndex ? '30px' : '10px',
                  height: '10px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.backgroundColor = '#6c757d';
                    e.currentTarget.style.transform = 'scale(1.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.backgroundColor = '#adb5bd';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Additional custom styles for Bootstrap */}
      <style jsx>{`
        .object-fit-cover {
          object-fit: cover;
        }
        
        @media (max-width: 768px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .display-4 {
            font-size: 2rem;
          }
          
          .lead {
            font-size: 1rem;
          }
          
          .position-relative {
            max-width: 100%;
          }
          
          /* Responsive height for tablets */
          div[style*="height: 650px"] {
            height: 450px !important;
          }
        }
        
        @media (max-width: 576px) {
          .h2 {
            font-size: 1.25rem;
          }
          
          .h6 {
            font-size: 0.875rem;
          }
          
          p {
            font-size: 0.75rem;
          }
          
          /* Responsive height for mobile */
          div[style*="height: 650px"] {
            height: 350px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Member;