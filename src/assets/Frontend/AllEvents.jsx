import Header from "./Common/Header";
import Footer from "./Common/Footer";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllEvents = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  // Use environment variables for API URLs
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const API_URL = import.meta.env.API_URL;

  const theme = {
    isDarkMode,
    bg: isDarkMode ? '#1a1a2e' : '#f8f9fa',
    card: isDarkMode ? '#16213e' : '#ffffff',
    text: isDarkMode ? '#e9ecef' : '#2c3e50',
    border: isDarkMode ? '#2d3436' : '#e0e0e0',
    heroBg: isDarkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #ff8c32 0%, #ff8c32 100%)',
    primaryColor: '#ff8c32',
    primaryHover: '#e67e22',
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/^\/storage\/storage\//, '/storage/');
    if (cleanPath.startsWith('/storage/')) {
      return `${API_URL}${cleanPath}`;
    }
    return `${API_URL}/storage/${cleanPath}`;
  };

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/events/all`);
      if (response.data.success && response.data.data) {
        setEvents(response.data.data);
      } else {
        setEvents([]);
        setError('No events found');
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.mainTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
      (selectedCategory === 'upcoming' && new Date(event.event_datetime) > new Date()) ||
      (selectedCategory === 'past' && new Date(event.event_datetime) < new Date());
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Navigate to event details
  const handleEventClick = (eventId, slug) => {
    navigate(`/event/${slug || eventId}`);
  };

  // Styles
  const styles = {
    pageContainer: {
      backgroundColor: theme.bg,
      minHeight: '100vh',
      transition: 'all 0.3s ease',
    },
    heroSection: {
      background: theme.heroBg,
      padding: '80px 0',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
    },
    heroTitle: {
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    },
    heroSubtitle: {
      opacity: 0.95,
    },
    spinner: {
      width: '3rem',
      height: '3rem',
    },
    loadingText: {
      color: theme.text,
      fontSize: '1.1rem',
    },
    errorAlert: {
      borderRadius: '12px',
      padding: '20px',
    },
    searchBox: {
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      color: '#ff8c32',
    },
    searchInput: {
      paddingLeft: '40px',
      borderRadius: '12px',
      border: `2px solid ${theme.border}`,
      height: '50px',
      fontSize: '15px',
      backgroundColor: theme.card,
      color: theme.text,
    },
    filterButtons: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end',
    },
    filterBtn: {
      borderRadius: '25px',
      padding: '8px 20px',
      transition: 'all 0.3s ease',
    },
    eventCard: {
      backgroundColor: theme.card,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    eventImageWrapper: {
      position: 'relative',
      overflow: 'hidden',
      height: '250px',
    },
    eventCardImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    eventDateBadge: {
      position: 'absolute',
      top: '15px',
      left: '15px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      borderRadius: '10px',
      padding: '8px 12px',
      textAlign: 'center',
      minWidth: '55px',
      backdropFilter: 'blur(5px)',
      zIndex: 2,
    },
    eventDay: {
      display: 'block',
      fontSize: '22px',
      fontWeight: 'bold',
      lineHeight: 1,
    },
    eventMonth: {
      display: 'block',
      fontSize: '12px',
      textTransform: 'uppercase',
    },
    eventOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      zIndex: 3,
    },
    viewDetailsBtn: {
      borderRadius: '25px',
      padding: '10px 25px',
      fontWeight: '600',
      backgroundColor: '#ff8c32',
      border: 'none',
      color: 'white',
    },
    eventCardBody: {
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    eventCardTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: theme.text,
    },
    eventCardSubtitle: {
      fontSize: '14px',
      color: '#ff8c32',
      marginBottom: '12px',
    },
    eventMeta: {
      display: 'flex',
      gap: '15px',
      marginBottom: '12px',
      flexWrap: 'wrap',
    },
    eventMetaItem: {
      fontSize: '12px',
      color: '#6c757d',
    },
    eventCardDescription: {
      fontSize: '13px',
      color: '#6c757d',
      lineHeight: 1.5,
      marginBottom: '15px',
    },
    eventFeatures: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '15px',
    },
    featureTag: {
      backgroundColor: isDarkMode ? '#2d3436' : '#f0f0f0',
      padding: '4px 10px',
      borderRadius: '15px',
      fontSize: '11px',
      color: isDarkMode ? '#e9ecef' : '#666',
      display: 'inline-flex',
      alignItems: 'center',
    },
    eventCardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '12px',
      borderTop: `1px solid ${theme.border}`,
      marginTop: 'auto',
    },
    paginationWrapper: {
      display: 'flex',
      justifyContent: 'center',
    },
    noEvents: {
      padding: '60px 20px',
    },
    noEventsIcon: {
      fontSize: '64px',
      color: '#dee2e6',
    },
    resultsCount: {
      fontSize: '14px',
      color: theme.text,
    },
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
        <Header
          theme={theme}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        <div className="container py-5">
          <div className="text-center py-5">
            <div className="spinner-border" style={{ ...styles.spinner, color: '#ff8c32' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={styles.loadingText}>Loading amazing events...</p>
          </div>
        </div>
        <Footer theme={theme} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
        <Header
          theme={theme}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        <div className="container py-5">
          <div className="alert alert-danger text-center" style={styles.errorAlert}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
        <Footer theme={theme} />
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Header
        theme={theme}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Hero Section */}
      <div className="hero-section" style={styles.heroSection}>
        <div className="container">
          <div className="text-center" style={styles.heroContent}>
            <h1 className="display-3 fw-bold mb-3" style={styles.heroTitle}>
              Explore Our Events
            </h1>
            <p className="lead mb-4" style={styles.heroSubtitle}>
              Discover unforgettable experiences and create lasting memories
            </p>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Search and Filter Section */}
        <div className="row mb-5">
          <div className="col-md-6 mb-3">
            <div className="search-box" style={styles.searchBox}>
              <i className="bi bi-search" style={styles.searchIcon}></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search events by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="filter-buttons" style={styles.filterButtons}>
              <button
                className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory('all')}
                style={{
                  ...styles.filterBtn,
                  backgroundColor: selectedCategory === 'all' ? '#ff8c32' : 'transparent',
                  borderColor: '#ff8c32',
                  color: selectedCategory === 'all' ? 'white' : '#ff8c32',
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== 'all') {
                    e.currentTarget.style.backgroundColor = '#ff8c32';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== 'all') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#ff8c32';
                  }
                }}
              >
                <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                All Events
              </button>
              <button
                className={`btn ${selectedCategory === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory('upcoming')}
                style={{
                  ...styles.filterBtn,
                  backgroundColor: selectedCategory === 'upcoming' ? '#ff8c32' : 'transparent',
                  borderColor: '#ff8c32',
                  color: selectedCategory === 'upcoming' ? 'white' : '#ff8c32',
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== 'upcoming') {
                    e.currentTarget.style.backgroundColor = '#ff8c32';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== 'upcoming') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#ff8c32';
                  }
                }}
              >
                <i className="bi bi-calendar-event-fill me-2"></i>
                Upcoming
              </button>
              <button
                className={`btn ${selectedCategory === 'past' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory('past')}
                style={{
                  ...styles.filterBtn,
                  backgroundColor: selectedCategory === 'past' ? '#ff8c32' : 'transparent',
                  borderColor: '#ff8c32',
                  color: selectedCategory === 'past' ? 'white' : '#ff8c32',
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== 'past') {
                    e.currentTarget.style.backgroundColor = '#ff8c32';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== 'past') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#ff8c32';
                  }
                }}
              >
                <i className="bi bi-calendar-check-fill me-2"></i>
                Past Events
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-5" style={styles.noEvents}>
            <i className="bi bi-calendar-x" style={styles.noEventsIcon}></i>
            <h3 className="mt-3" style={{ color: theme.text }}>No events found</h3>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {currentEvents.map((event) => (
                <div key={event.id} className="col-lg-4 col-md-6">
                  <div className="event-card" style={styles.eventCard} onClick={() => handleEventClick(event.id, event.slug)}>
                    <div className="event-image-wrapper" style={styles.eventImageWrapper}>
                      <img
                        src={getImageUrl(event.mainImg) || getImageUrl(event.thumbImg)}
                        alt={event.title}
                        className="event-card-img"
                        style={styles.eventCardImg}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=Event';
                        }}
                      />
                      <div className="event-date-badge" style={styles.eventDateBadge}>
                        <span className="event-day" style={styles.eventDay}>
                          {event.dateBox?.day || new Date(event.event_datetime).getDate()}
                        </span>
                        <span className="event-month" style={styles.eventMonth}>
                          {event.dateBox?.month || new Date(event.event_datetime).toLocaleString('default', { month: 'short' })}
                        </span>
                      </div>
                      <div className="event-overlay" style={styles.eventOverlay}>
                        <button className="btn btn-sm" style={styles.viewDetailsBtn}>
                          View Details <i className="bi bi-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                    <div className="event-card-body" style={styles.eventCardBody}>
                      <h5 className="event-card-title" style={styles.eventCardTitle}>{event.title}</h5>
                      <p className="event-card-subtitle" style={styles.eventCardSubtitle}>{event.mainTitle}</p>
                      <div className="event-meta" style={styles.eventMeta}>
                        <span className="event-meta-item" style={styles.eventMetaItem}>
                          <i className="bi bi-clock me-1"></i> {event.time}
                        </span>
                        <span className="event-meta-item" style={styles.eventMetaItem}>
                          <i className="bi bi-person me-1"></i> {event.postedBy}
                        </span>
                      </div>
                      <p className="event-card-description" style={styles.eventCardDescription}>
                        {event.description ?
                          (event.description.length > 100 ?
                            `${event.description.substring(0, 100)}...` :
                            event.description
                          ) :
                          'Experience an unforgettable event with premium services and world-class hospitality.'
                        }
                      </p>
                      <div className="event-features" style={styles.eventFeatures}>
                        {event.features && event.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="feature-tag" style={styles.featureTag}>
                            <i className="bi bi-check-circle-fill me-1" style={{ color: '#ff8c32' }}></i> {feature.substring(0, 30)}
                          </span>
                        ))}
                      </div>
                      <div className="event-card-footer" style={styles.eventCardFooter}>
                        <span className="text-muted small">
                          <i className="bi bi-chat me-1"></i> {event.comments || 0} comments
                        </span>
                        <span className="small" style={{ color: '#ff8c32' }}>
                          Read More <i className="bi bi-arrow-right-short"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-wrapper mt-5" style={styles.paginationWrapper}>
                <nav>
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        style={{ color: '#ff8c32' }}
                      >
                        <i className="bi bi-chevron-left"></i> Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                                          onClick={() => setCurrentPage(index + 1)}
                          style={currentPage === index + 1 ? { backgroundColor: '#ff8c32', borderColor: '#ff8c32', color: 'white' } : { color: '#ff8c32' }}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        style={{ color: '#ff8c32' }}
                      >
                        Next <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {/* Results count */}
            <div className="text-center mt-4" style={styles.resultsCount}>
              <p>
                Showing {indexOfFirstEvent + 1} to {Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events
              </p>
            </div>
          </>
        )}
      </div>

      <Footer theme={theme} />

      {/* Add hover effect styles */}
      <style>{`
        .event-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15) !important;
        }
        
        .event-card:hover .event-card-img {
          transform: scale(1.1);
        }
        
        .event-card:hover .event-overlay {
          opacity: 1;
        }
        
        .filter-buttons .btn:hover {
          transform: translateY(-2px);
        }
        
        .page-link {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .page-link:hover {
          transform: translateY(-2px);
          background-color: #ff8c32;
          color: white !important;
        }
        
        .page-item.active .page-link {
          background-color: #ff8c32 !important;
          border-color: #ff8c32 !important;
        }
        
        @media (max-width: 768px) {
          .filter-buttons {
            justify-content: center;
          }
          
          .hero-section {
            padding: 50px 0;
          }
          
          .hero-section h1 {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default AllEvents;