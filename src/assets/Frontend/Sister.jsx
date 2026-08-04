import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/sister.css';

const Sister = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Brand Color
  const brandColor = '#5e2e10';

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://backend.akashbariresort.com/api/affiliates');
      if (response.data.success) {
        setAffiliates(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching affiliates:', err);
      setError('Failed to load affiliates');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-secondary">Loading affiliates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-danger text-center py-5">
        {error}
      </div>
    );
  }

  // ডুপ্লিকেট ডেটা তৈরি করুন স্লাইডিং ইফেক্টের জন্য
  const duplicateAffiliates = [...affiliates, ...affiliates, ...affiliates];

  return (
    <div className="bg-white py-5">
      <div className="container">
        {/* Header - Center and Brand Color */}
        <h2 
          className="display-6 fw-bold mb-4 affiliate-header"
          style={{ 
            color: brandColor,
            textAlign: 'center',
            fontWeight: 700
          }}
        >
          Our Sister Concerns
        </h2>

        {/* Decorative Line with Brand Color */}
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

        {/* Clients Slider */}
        <div className="affiliate-container">
          <div className="affiliate-slider">
            {duplicateAffiliates.map((affiliate, index) => (
              <div
                key={`${affiliate.id}-${index}`}
                className="affiliate-box d-flex flex-column align-items-center justify-content-center"
                style={{
                  borderColor: brandColor // ইনলাইন স্টাইলেও বর্ডার কালার সেট
                }}
              >
                {/* Image Container */}
                <div className="affiliate-img-wrapper">
                  <img
                    src={`https://backend.akashbariresort.com${affiliate.image}`}
                    alt={affiliate.title}
                    className="affiliate-img"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=Logo';
                    }}
                  />
                </div>
                
                {/* Company Name */}
                <h6 className="affiliate-title">
                  {affiliate.title}
                </h6>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sister;