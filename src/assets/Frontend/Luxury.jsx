import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Luxury = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   const APP_URL = import.meta.env.API_URL;

  // API Base URL
  const API_BASE = import.meta.env.VITE_BASE_URL;

  // Fetch data from API
  useEffect(() => {
    fetchLuxuryItems();
  }, []);

  const fetchLuxuryItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/luxury-items`);
      
      if (response.data.success) {
        const items = response.data.data.data || [];
        setAccommodations(items);
        setError(null);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching luxury items:', err);
      setError('Unable to load luxury items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading luxury accommodations...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
          <button 
            className="btn btn-warning mt-3" 
            onClick={fetchLuxuryItems}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (accommodations.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="alert alert-info" role="alert">
            <i className="bi bi-info-circle-fill me-2"></i>
            No luxury items found. Please add some items.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Inline Style for Hover Effect */}
      <style>
        {`
          .zoom-container {
            overflow: hidden;
            background-color: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
          }
          .zoom-image {
            transition: transform 0.5s ease;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .zoom-container:hover .zoom-image {
            transform: scale(1.1);
          }
          .card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid #dee2e6 !important;
            border-radius: 0px !important;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
            border-color: #4a6d36 !important;
          }
          .feature-item {
            transition: all 0.3s ease;
          }
          .feature-item:hover {
            transform: translateX(5px);
          }
          .feature-item:hover .feature-dot {
            background-color: #4a6d36 !important;
          }
          .feature-item:hover .feature-text {
            color: #28a745 !important;
          }
          @media (max-width: 768px) {
            .zoom-container {
              height: 200px !important;
            }
            .display-4 {
              font-size: 2rem !important;
            }
          }
        `}
      </style>

      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-normal text-uppercase mb-2" style={{ letterSpacing: '4px' }}>
          Luxury Accommodations
        </h1>
        <div 
          className="mx-auto mb-3" 
          style={{ width: '80px', height: '4px', backgroundColor: '#4a6d36' }}
        ></div>
        <p className="text-muted fst-italic">
          Hotel Rooms and Suite Will be like this
        </p>
      </div>

      {/* Grid Section */}
      <div className="row g-4">
        {accommodations.map((item) => (
          <div key={item.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              
              {/* Image Container with Zoom Logic */}
              <div className="zoom-container" style={{ height: '250px', position: 'relative' }}>
                <img
                  src={item.image_url || `${APP_URL}/${item.image}`}
                  className="zoom-image"
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x600?text=No+Image+Available';
                  }}
                />
                {/* Status Badge */}
                {item.status && (
                  <span 
                    className={`position-absolute top-0 end-0 m-3 px-3 py-1 small fw-bold text-uppercase ${
                      item.status === 'active' ? 'bg-success' : 'bg-secondary'
                    }`}
                    style={{ 
                      color: 'white', 
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      letterSpacing: '1px',
                      zIndex: 1
                    }}
                  >
                    {item.status}
                  </span>
                )}
              </div>
              
              <div className="card-body p-4">
                <h2 className="h4 card-title mb-4 fw-normal text-uppercase" style={{ letterSpacing: '1px' }}>
                  {item.title}
                </h2>
                <ul className="list-unstyled">
                  {item.features && item.features.map((feature, idx) => (
                    <li key={idx} className="mb-2 d-flex align-items-center feature-item">
                      <span 
                        className="feature-dot rounded-circle me-2" 
                        style={{ width: '8px', height: '8px', backgroundColor: '#28a745', display: 'inline-block', transition: 'all 0.3s ease' }}
                      ></span>
                      <small className="feature-text text-secondary" style={{ transition: 'all 0.3s ease' }}>{feature}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      {accommodations.length > 0 && (
        <div className="text-center mt-5 pt-3">
          <p className="text-muted small">
            <i className="bi bi-building me-1"></i> 
            Showing {accommodations.length} luxury accommodation{accommodations.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default Luxury;