import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "./Common/Header";
import Footer from "./Common/Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUser, 
  faComments, 
  faEye, 
  faMapMarkerAlt, 
  faBuilding, 
  faTicketAlt, 
  faCalendarCheck, 
  faArrowLeft,
  faCheckCircle,
  faExclamationTriangle,
  faShareAlt // নতুন যুক্ত করা
} from '@fortawesome/free-solid-svg-icons';
// ব্র্যান্ড আইকনগুলো একবারই ইম্পোর্ট করুন
import { 
  faFacebook, 
  faTwitter, 
  faWhatsapp,
  faPinterest // নতুন যুক্ত করা
} from '@fortawesome/free-brands-svg-icons';

const EventsDetails = () => {
  const brandColor = '#5e2e10';
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Use environment variables for API URLs
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const API_URL = import.meta.env.API_URL;

  const theme = {
    isDarkMode,
    bg: isDarkMode ? '#1a1a2e' : '#f8f9fa',
    card: isDarkMode ? '#16213e' : '#ffffff',
    text: isDarkMode ? '#e9ecef' : '#2c3e50',
    textMuted: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '#2d3436' : '#e0e0e0',
    heroBg: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.65)), url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80")`,
    primaryColor: brandColor,
    primaryHover: '#3d1f0a',
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

  // Fetch event details
  const fetchEventDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/events/${id}`);
      if (response.data.success && response.data.data) {
        setEvent(response.data.data);
      } else {
        setError('Event not found');
      }
    } catch (err) {
      console.error("Error fetching event:", err);
      setError('Failed to load event details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '80px 0',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    },
    heroTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      textShadow: '2px 4px 8px rgba(0,0,0,0.5)',
    },
    breadcrumb: {
      background: 'transparent',
      padding: 0,
      marginBottom: '1rem',
    },
    breadcrumbLink: {
      color: 'rgba(255,255,255,0.9)',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
    },
    contentWrapper: {
      marginTop: '-50px',
      position: 'relative',
      zIndex: 10,
    },
    mainCard: {
      backgroundColor: theme.card,
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      marginBottom: '30px',
    },
    mainImage: {
      width: '100%',
      height: '500px',
      objectFit: 'cover',
    },
    eventInfo: {
      padding: '30px',
    },
    eventTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: '10px',
    },
    eventSubtitle: {
      fontSize: '1.2rem',
      color: brandColor,
      marginBottom: '20px',
    },
    infoCard: {
      backgroundColor: isDarkMode ? '#16213e' : '#f8f9fa',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '20px',
      border: `1px solid ${theme.border}`,
    },
    infoIcon: {
      fontSize: '24px',
      color: brandColor,
      marginRight: '15px',
    },
    infoLabel: {
      fontSize: '12px',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '5px',
    },
    infoValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: theme.text,
    },
    sectionTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: '20px',
      position: 'relative',
      paddingBottom: '10px',
    },
    sectionTitleUnderline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '60px',
      height: '3px',
      background: brandColor,
      borderRadius: '2px',
    },
    description: {
      fontSize: '1rem',
      lineHeight: '1.8',
      color: theme.text,
      marginBottom: '30px',
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
    },
    featureItem: {
      padding: '12px 0',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    featureIcon: {
      color: brandColor,
      fontSize: '18px',
    },
    shareSection: {
      marginTop: '30px',
      paddingTop: '20px',
      borderTop: `1px solid ${theme.border}`,
    },
    shareBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 20px',
      borderRadius: '25px',
      marginRight: '10px',
      transition: 'all 0.3s ease',
    },
    backButton: {
      backgroundColor: brandColor,
      color: 'white',
      border: 'none',
      padding: '12px 30px',
      borderRadius: '25px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
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
            <div className="spinner-border" style={{ ...styles.spinner, color: brandColor }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={styles.loadingText}>Loading event details...</p>
          </div>
        </div>
        <Footer theme={theme} />
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
        <Header
          theme={theme}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        <div className="container py-5">
          <div className="alert alert-danger text-center" style={styles.errorAlert}>
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            {error || 'Event not found'}
          </div>
          <div className="text-center">
            <button onClick={() => navigate('/all-events')} style={styles.backButton}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Events
            </button>
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
          <nav aria-label="breadcrumb" style={styles.breadcrumb}>
            <ol className="breadcrumb bg-transparent">
              <li className="breadcrumb-item">
                <a href="/" style={styles.breadcrumbLink}>Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/all-events" style={styles.breadcrumbLink}>Events</a>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                {event.title}
              </li>
            </ol>
          </nav>
          <div className="text-center py-3">
            <h1 style={styles.heroTitle}>{event.title}</h1>
            <p className="lead" style={{ opacity: 0.95, textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>Discover the magic of this extraordinary event</p>
          </div>
        </div>
      </div>

      <div className="container" style={styles.contentWrapper}>
        <div className="row">
          <div className="col-lg-8">
            {/* Main Event Card */}
            <div style={styles.mainCard}>
              <img
                src={getImageUrl(event.mainImg) || getImageUrl(event.thumbImg)}
                alt={event.title}
                style={styles.mainImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/1200x500?text=Event+Image';
                }}
              />

              <div style={styles.eventInfo}>
                <h1 style={styles.eventTitle}>{event.mainTitle}</h1>
                <h4 style={styles.eventSubtitle}>{event.subtitle}</h4>

                <div style={styles.description}>
                  <p>{event.description || 'Experience an unforgettable event with premium services and world-class hospitality. Join us for an amazing journey filled with joy, entertainment, and lasting memories.'}</p>
                </div>

                {/* Features Section */}
                {event.features && event.features.length > 0 && (
                  <>
                    <h3 style={styles.sectionTitle}>
                      Event Highlights
                      <div style={styles.sectionTitleUnderline}></div>
                    </h3>
                    <ul style={styles.featureList}>
                      {event.features.map((feature, index) => (
                        <li key={index} style={styles.featureItem}>
                          <FontAwesomeIcon icon={faCheckCircle} style={styles.featureIcon} />
                          <span style={{ color: theme.text }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Share Section */}
                {/* Share Section */}
                <div style={styles.shareSection}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FontAwesomeIcon
                        icon={faShareAlt}
                        style={{
                          fontSize: '20px',
                          color: '#6c757d',
                          marginRight: '8px'
                        }}
                      />
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: theme.text
                      }}>
                        Share:
                      </span>
                    </div>

                    {/* Facebook Icon */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: brandColor, fontSize: '20px', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => e.target.style.color = '#3d1f0a'}
                      onMouseLeave={(e) => e.target.style.color = brandColor}
                    >
                      <FontAwesomeIcon icon={faFacebook} />
                    </a>

                    {/* Twitter (X) Icon */}
                    <a
                      href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${event.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: brandColor, fontSize: '20px', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => e.target.style.color = '#3d1f0a'}
                      onMouseLeave={(e) => e.target.style.color = brandColor}
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>

                    {/* Pinterest Icon (Added as per reference image) */}
                    <a
                      href={`https://pinterest.com/pin/create/button/?url=${window.location.href}&description=${event.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: brandColor, fontSize: '20px', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => e.target.style.color = '#3d1f0a'}
                      onMouseLeave={(e) => e.target.style.color = brandColor}
                    >
                      <FontAwesomeIcon icon={faPinterest} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Event Info Card */}
            <div style={styles.infoCard}>
              <div className="d-flex align-items-center mb-4">
                <FontAwesomeIcon icon={faCalendarAlt} style={styles.infoIcon} />
                <div>
                  <div style={styles.infoLabel}>Date & Time</div>
                  <div style={styles.infoValue}>{formatDate(event.event_datetime)}</div>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <FontAwesomeIcon icon={faUser} style={styles.infoIcon} />
                <div>
                  <div style={styles.infoLabel}>Organized By</div>
                  <div style={styles.infoValue}>{event.postedBy}</div>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <FontAwesomeIcon icon={faComments} style={styles.infoIcon} />
                <div>
                  <div style={styles.infoLabel}>Discussion</div>
                  <div style={styles.infoValue}>{event.comments || 0} Comments</div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faEye} style={styles.infoIcon} />
                <div>
                  <div style={styles.infoLabel}>Views</div>
                  <div style={styles.infoValue}>{event.view_count || 0} Views</div>
                </div>
              </div>
            </div>

            {/* Location Card (Optional) */}
            <div style={styles.infoCard}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.infoIcon} />
                <h6 className="mb-0" style={{ color: theme.text }}>Event Location</h6>
              </div>
              <p style={{ color: theme.textMuted, marginBottom: 0 }}>
                <FontAwesomeIcon icon={faBuilding} className="me-2" />
                Grand Ballroom, Hotel Luxe<br />
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 mt-2" />
                123 Luxury Avenue, Downtown City
              </p>
            </div>

            {/* Booking Card */}
            <div style={styles.infoCard}>
              <div className="text-center">
                <FontAwesomeIcon icon={faTicketAlt} style={{ fontSize: '48px', color: brandColor, marginBottom: '15px', display: 'block' }} />
                <h5 style={{ color: theme.text, marginBottom: '15px' }}>Want to Join?</h5>
                <p style={{ color: theme.textMuted, fontSize: '14px', marginBottom: '20px' }}>
                  Limited seats available. Book your spot now!
                </p>
                <button className="btn w-100" style={{ backgroundColor: brandColor, color: 'white', padding: '12px', borderRadius: '25px', fontWeight: '600' }}>
                  <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                  Register Now
                </button>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center mt-3">
              <button onClick={() => navigate('/all-events')} style={styles.backButton}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to All Events
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer theme={theme} />

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero-section {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .main-card {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }
        
        .info-card {
          animation: fadeInUp 0.6s ease-out 0.3s both;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .breadcrumb-item a:hover {
          color: white !important;
          text-decoration: underline !important;
        }
        
        .btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2rem;
          }
          
          .main-image {
            height: 300px !important;
          }
          
          .event-title {
            font-size: 1.8rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EventsDetails;