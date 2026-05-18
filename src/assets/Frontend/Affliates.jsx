import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Common/Header';
import Footer from './Common/Footer';

const Affiliates = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Configuration
  const API_BASE_URL =  'http://localhost:8000/api';
  const API_URL =  'http://localhost:8000';

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Remove leading slash if exists and prepend API_URL
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_URL}${cleanPath}`;
  };

  // Fetch affiliates from API
  const fetchAffiliates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/affiliates`);
      console.log('API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        // Transform the data to match the component's expected format
        const transformedData = response.data.data.map(affiliate => ({
          id: affiliate.id,
          name: affiliate.title,
          description: affiliate.description,
          logo: getFullImageUrl(affiliate.image),
          website: affiliate.website,
          status: affiliate.status,
          createdAt: affiliate.created_at,
          sortOrder: affiliate.sort_order,
          clickCount: affiliate.click_count
        }));
        setPartners(transformedData);
      } else {
        setPartners([]);
        setError('No affiliates found');
      }
    } catch (err) {
      console.error('Error fetching affiliates:', err);
      setError('Failed to load affiliates. Please try again later.');
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  // Handle view details click
  const handleViewDetails = (website) => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main style={styles.container}>
          <div style={styles.loadingContainer}>
            <div className="spinner-border text-success" role="status" style={styles.spinner}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={styles.loadingText}>Loading our sister concerns...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main style={styles.container}>
          <div style={styles.errorContainer}>
            <i className="bi bi-exclamation-triangle-fill" style={styles.errorIcon}></i>
            <h3 style={styles.errorTitle}>Oops! Something went wrong</h3>
            <p style={styles.errorMessage}>{error}</p>
            <button onClick={fetchAffiliates} style={styles.retryButton}>
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (partners.length === 0) {
    return (
      <>
        <Header />
        <main style={styles.container}>
          <div style={styles.emptyContainer}>
            <i className="bi bi-building" style={styles.emptyIcon}></i>
            <h3 style={styles.emptyTitle}>No Sister Concerns Found</h3>
            <p style={styles.emptyMessage}>Please check back later for updates.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main style={styles.container}>
        {/* Header Section */}
        <section style={styles.headerSection}>
          <span style={styles.badge}>OUR NETWORK</span>
          <h1 style={styles.title}>Sister Concerns</h1>
          <p style={styles.subtitle}>
            Discover our family of companies dedicated to serving your travel, hospitality, and lifestyle needs with excellence and integrity.
          </p>
          <div style={styles.underline}></div>
        </section>

        {/* Partners Grid */}
        <section style={styles.grid}>
          {partners.map((item, index) => {
            // Automatically alternate: even index = Normal, odd index = Reverse
            const isReverse = index % 2 !== 0;

            return (
              <div key={item.id} style={{
                ...styles.row,
                flexDirection: isReverse ? 'row-reverse' : 'row'
              }}>
                {/* Image Box */}
                <div style={styles.imageBox}>
                  <div style={styles.imageWrapper}>
                    <img 
                      src={item.logo} 
                      alt={item.name} 
                      style={styles.logo}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  </div>
                </div>

                {/* Text Box */}
                <div style={{
                  ...styles.textBox,
                  borderLeft: isReverse ? '1px solid #e0e0e0' : 'none',
                  borderRight: isReverse ? 'none' : '1px solid #e0e0e0',
                }}>
                  <h2 style={styles.cardTitle}>{item.name}</h2>
                  <p style={styles.cardText}>{item.description}</p>
                  <button 
                    style={styles.button}
                    onClick={() => handleViewDetails(item.website)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#5e853d'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#76a34d'}
                  >
                    VIEW DETAILS ↗
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px',
    fontFamily: "'Playfair Display', serif",
    '@media (maxWidth: 768px)': {
      padding: '40px 16px',
    },
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '80px',
    '@media (maxWidth: 768px)': {
      marginBottom: '40px',
    },
  },
  badge: {
    backgroundColor: '#76a34d',
    color: 'white',
    padding: '6px 18px',
    fontSize: '13px',
    letterSpacing: '2px',
    fontWeight: '700',
    borderRadius: '50px',
    boxShadow: '0 4px 10px rgba(118, 163, 77, 0.3)',
    display: 'inline-block',
    '@media (maxWidth: 768px)': {
      fontSize: '11px',
      padding: '4px 14px',
    },
  },
  title: {
    fontSize: '56px',
    margin: '25px 0 15px',
    color: '#1a1a1a',
    fontWeight: '800',
    '@media (maxWidth: 768px)': {
      fontSize: '32px',
      margin: '15px 0 10px',
    },
    '@media (maxWidth: 480px)': {
      fontSize: '28px',
    },
  },
  subtitle: {
    color: '#555',
    maxWidth: '650px',
    margin: '0 auto',
    lineHeight: '1.8',
    fontSize: '18px',
    '@media (maxWidth: 768px)': {
      fontSize: '15px',
      lineHeight: '1.6',
      padding: '0 10px',
    },
  },
  underline: {
    width: '80px',
    height: '4px',
    backgroundColor: '#76a34d',
    margin: '30px auto 0',
    borderRadius: '2px',
    '@media (maxWidth: 768px)': {
      width: '60px',
      margin: '20px auto 0',
    },
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '60px',
    '@media (maxWidth: 768px)': {
      gap: '30px',
    },
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
    flexWrap: 'wrap',
    '@media (maxWidth: 992px)': {
      flexDirection: 'column !important',
    },
  },
  imageBox: {
    flex: '1',
    minWidth: '350px',
    height: '400px',
    border: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    '@media (maxWidth: 992px)': {
      minWidth: '100%',
      height: '280px',
      borderBottom: 'none',
    },
    '@media (maxWidth: 768px)': {
      height: '220px',
    },
    '@media (maxWidth: 480px)': {
      height: '180px',
    },
  },
  imageWrapper: {
    width: '70%',
    transition: 'transform 0.5s ease',
    cursor: 'pointer',
    '@media (maxWidth: 768px)': {
      width: '50%',
    },
    '@media (maxWidth: 480px)': {
      width: '60%',
    },
  },
  textBox: {
    flex: '1',
    minWidth: '350px',
    height: '400px',
    borderTop: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
    padding: '60px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    '@media (maxWidth: 992px)': {
      minWidth: '100%',
      height: 'auto',
      padding: '40px 30px',
      borderLeft: '1px solid #e0e0e0 !important',
      borderRight: '1px solid #e0e0e0 !important',
      borderTop: 'none',
    },
    '@media (maxWidth: 768px)': {
      padding: '30px 20px',
    },
    '@media (maxWidth: 480px)': {
      padding: '25px 15px',
    },
  },
  logo: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    transition: 'transform 0.5s ease',
  },
  cardTitle: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#1a1a1a',
    lineHeight: '1.2',
    '@media (maxWidth: 768px)': {
      fontSize: '24px',
      marginBottom: '15px',
    },
    '@media (maxWidth: 480px)': {
      fontSize: '20px',
      marginBottom: '12px',
    },
  },
  cardText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.7',
    marginBottom: '30px',
    '@media (maxWidth: 768px)': {
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '20px',
    },
    '@media (maxWidth: 480px)': {
      fontSize: '13px',
    },
  },
  button: {
    backgroundColor: '#76a34d',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    cursor: 'pointer',
    fontWeight: '600',
    width: 'fit-content',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    letterSpacing: '1px',
    '@media (maxWidth: 768px)': {
      padding: '10px 20px',
      fontSize: '12px',
      width: '100%',
      textAlign: 'center',
    },
    '@media (maxWidth: 480px)': {
      padding: '8px 16px',
      fontSize: '11px',
    },
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  spinner: {
    width: '3rem',
    height: '3rem',
  },
  loadingText: {
    marginTop: '20px',
    color: '#666',
    fontSize: '16px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
  },
  errorIcon: {
    fontSize: '48px',
    color: '#dc3545',
    marginBottom: '20px',
  },
  errorTitle: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px',
  },
  errorMessage: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  retryButton: {
    backgroundColor: '#76a34d',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    color: '#76a34d',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px',
  },
  emptyMessage: {
    fontSize: '16px',
    color: '#666',
  },
};

// Add responsive styles using CSS-in-JS with media queries
const responsiveStyles = `
  @media (max-width: 992px) {
    .affiliates-row {
      flex-direction: column !important;
    }
    .affiliates-image-box {
      min-width: 100% !important;
      height: 280px !important;
      border-bottom: none !important;
    }
    .affiliates-text-box {
      min-width: 100% !important;
      height: auto !important;
      padding: 40px 30px !important;
      border-left: 1px solid #e0e0e0 !important;
      border-right: 1px solid #e0e0e0 !important;
      border-top: none !important;
    }
  }

  @media (max-width: 768px) {
    .affiliates-container {
      padding: 40px 16px !important;
    }
    .affiliates-header {
      margin-bottom: 40px !important;
    }
    .affiliates-title {
      font-size: 32px !important;
      margin: 15px 0 10px !important;
    }
    .affiliates-subtitle {
      font-size: 15px !important;
      padding: 0 10px !important;
    }
    .affiliates-grid {
      gap: 30px !important;
    }
    .affiliates-image-box {
      height: 220px !important;
    }
    .affiliates-text-box {
      padding: 30px 20px !important;
    }
    .affiliates-card-title {
      font-size: 24px !important;
      margin-bottom: 15px !important;
    }
    .affiliates-card-text {
      font-size: 14px !important;
      margin-bottom: 20px !important;
    }
    .affiliates-button {
      padding: 10px 20px !important;
      font-size: 12px !important;
      width: 100% !important;
      text-align: center !important;
    }
  }

  @media (max-width: 480px) {
    .affiliates-title {
      font-size: 28px !important;
    }
    .affiliates-image-box {
      height: 180px !important;
    }
    .affiliates-text-box {
      padding: 25px 15px !important;
    }
    .affiliates-card-title {
      font-size: 20px !important;
    }
    .affiliates-card-text {
      font-size: 13px !important;
    }
    .affiliates-button {
      padding: 8px 16px !important;
      font-size: 11px !important;
    }
  }

  /* Hover Effects */
  .affiliates-image-wrapper:hover {
    transform: scale(1.05);
  }
  .affiliates-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(118, 163, 77, 0.3);
  }
`;

// Inject styles into document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = responsiveStyles;
  document.head.appendChild(styleSheet);
}

export default Affiliates;