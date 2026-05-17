import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../css/Notice.css';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  

const Notice = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Fetch active notices from API
  const fetchActiveNotices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/notices/active`);
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        // Use data directly from API
        const apiNotices = response.data.data.map(notice => ({
          id: notice.id,
          text: notice.text,
          icon: notice.icon,
          color: notice.color || "#ff6b6b",
          status: notice.status
        }));
        
        setNotices(apiNotices);
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notices on component mount
  useEffect(() => {
    fetchActiveNotices();
  }, []);

  // Set up auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchActiveNotices();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Triple the notices for seamless scrolling
  const scrollingNotices = notices.length > 0 ? [...notices, ...notices, ...notices] : [];

  // Scroll animation effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && scrollingNotices.length > 0) {
      let scrollPosition = 0;
      let animationId;
      let speed = 1.5;
      
      const scroll = () => {
        if (!isHovered) {
          scrollPosition += speed;
          const maxScroll = scrollContainer.scrollWidth / 3;
          if (scrollPosition >= maxScroll) {
            scrollPosition = 0;
          }
          scrollContainer.scrollLeft = scrollPosition;
        }
        animationId = requestAnimationFrame(scroll);
      };
      
      animationId = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(animationId);
    }
  }, [isHovered, notices]);

  // Don't render if no notices and not loading
  if (!loading && notices.length === 0) {
    return null;
  }

  return (
    <div className="notice-container">
      <div className="notice-wrapper">
        {/* Left Icon */}
        <div className="notice-icon-left">
          <i className="bi bi-megaphone-fill"></i>
        </div>

        {/* Scrolling Content */}
        <div 
          className="notice-scroll" 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {loading ? (
            <div className="notice-loading">
              <div className="spinner-border spinner-border-sm text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-2 text-light">Loading notices...</span>
            </div>
          ) : (
            <div className="notice-scroll-content">
              {scrollingNotices.map((notice, index) => (
                <div 
                  key={`${notice.id}-${index}`}
                  className="notice-item"
                  style={{ '--notice-color': notice.color }}
                >
                  <span className="notice-icon">{notice.icon}</span>
                  <span className="notice-text">{notice.text}</span>
                  <span className="notice-arrow">→</span>
                </div>
              ))}
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default Notice;