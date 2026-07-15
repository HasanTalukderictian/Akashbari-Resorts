import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Common/Header';
import Footer from './Common/Footer';

const Partner = () => {
  const brandColor = '#5e2e10';
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // API Configuration - Fix these in your .env file
  const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://backend.akashbariresort.com/api';
  const API_URL = import.meta.env.VITE_API_URL || 'https://backend.akashbariresort.com';

  // Helper function to get full image URL - CORRECTED
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If already a full URL
    if (imagePath.startsWith('http')) return imagePath;
    
    // Clean the path
    let cleanPath = imagePath;
    
    // Remove /storage/ or storage/ prefix
    if (cleanPath.startsWith('/storage/')) {
      cleanPath = cleanPath.replace('/storage/', '');
    } else if (cleanPath.startsWith('storage/')) {
      cleanPath = cleanPath.replace('storage/', '');
    }
    
    // Remove leading slashes
    cleanPath = cleanPath.replace(/^\/+/, '');
    
    // Construct full URL
    const baseUrl = API_URL.replace(/\/$/, '');
    const fullUrl = `${baseUrl}/storage/${cleanPath}`;
    
    console.log('Generated Image URL:', fullUrl); // For debugging
    
    return fullUrl;
  };

  // Fetch partners from API
  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/partners`);
      console.log('API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        let partnersData = response.data.data;
        
        // Handle pagination structure
        if (partnersData.data && Array.isArray(partnersData.data)) {
          partnersData = partnersData.data;
        } else if (Array.isArray(partnersData)) {
          partnersData = partnersData;
        } else {
          partnersData = [];
        }
        
        // Transform the data for the component
        const transformedData = partnersData.map(partner => {
          // Get image URL - priority: image_url then image
          let imagePath = partner.image_url || partner.image;
          let fullImageUrl = null;
          
          if (imagePath) {
            fullImageUrl = getFullImageUrl(imagePath);
          }
          
          return {
            id: partner.id,
            name: partner.title,
            description: partner.description,
            logo: fullImageUrl,
            website: partner.website,
            buttonText: "VISIT WEBSITE ↗",
            status: partner.status,
            created_at: partner.created_at
          };
        });
        
        setPartners(transformedData);
        console.log('Transformed partners:', transformedData);
      } else {
        setPartners([]);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
      setError('Failed to load partners. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    // Page load scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  // Handle image error
  const handleImageError = (id) => {
    console.log(`Image failed to load for partner ${id}`);
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Handle view details click
  const handleViewDetails = (website) => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div style={styles.loadingContainer}>
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: brandColor }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading partners...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div style={styles.errorContainer}>
          <i className="bi bi-exclamation-triangle" style={{ fontSize: '48px', color: '#dc3545' }}></i>
          <p style={{ marginTop: '20px', color: '#666' }}>{error}</p>
          <button onClick={fetchPartners} style={{ ...styles.retryButton, backgroundColor: brandColor }}>
            Try Again
          </button>
        </div>
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
          <span style={{ ...styles.badge, backgroundColor: brandColor }}>OUR NETWORK</span>
          <h1 style={styles.title}>OUR AFFILATES</h1>
          <p style={styles.subtitle}>
            Discover our partners dedicated to serving your travel, hospitality, 
            and lifestyle needs with excellence and integrity.
          </p>
          <div style={{ ...styles.underline, backgroundColor: brandColor }}></div>
        </section>

        {/* Partners Grid */}
        <section style={styles.grid}>
          {partners.length === 0 ? (
            <div style={styles.noDataContainer}>
              <i className="bi bi-inbox" style={{ fontSize: '48px', color: brandColor }}></i>
              <p style={{ marginTop: '20px', color: '#666' }}>No partners found.</p>
            </div>
          ) : (
            partners.map((item, index) => {
              const isReverse = index % 2 !== 0;

              return (
                <div 
                  key={item.id} 
                  className="partner-row"
                  style={{
                    ...styles.row,
                    flexDirection: isReverse ? 'row-reverse' : 'row'
                  }}
                >
                  {/* Image Box */}
                  <div className="partner-image-box" style={styles.imageBox}>
                    <div className="partner-image-wrapper" style={styles.imageWrapper}>
                      {!imageErrors[item.id] && item.logo ? (
                        <img 
                          src={item.logo} 
                          alt={item.name} 
                          style={styles.logo}
                          onError={() => handleImageError(item.id)}
                          onLoad={() => console.log(`Image loaded: ${item.logo}`)}
                        />
                      ) : (
                        <div style={styles.placeholderImage}>
                          <i className="bi bi-building" style={{ ...styles.placeholderIcon, color: brandColor }}></i>
                          <p style={styles.placeholderText}>{item.name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Box */}
                  <div 
                    className="partner-text-box"
                    style={{
                      ...styles.textBox,
                      borderLeft: isReverse ? `1px solid ${brandColor}30` : 'none',
                      borderRight: isReverse ? 'none' : `1px solid ${brandColor}30`,
                    }}
                  >
                    <h2 style={{ ...styles.cardTitle, color: brandColor }}>{item.name}</h2>
                    <p style={styles.cardText}>{item.description}</p>
                    <button 
                      className="partner-button"
                      style={{ ...styles.button, backgroundColor: brandColor }}
                      onClick={() => handleViewDetails(item.website)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#3d1f0a';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = brandColor;
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {item.buttonText}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <Footer />

      {/* Add responsive styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .partner-row {
          animation: fadeIn 0.6s ease-out;
        }
        
        @media (max-width: 992px) {
          .partner-row {
            flex-direction: column !important;
          }
          .partner-image-box {
            min-width: 100% !important;
            height: 280px !important;
            border-bottom: none !important;
          }
          .partner-text-box {
            min-width: 100% !important;
            height: auto !important;
            padding: 40px 30px !important;
            border-left: 1px solid #e0e0e0 !important;
            border-right: 1px solid #e0e0e0 !important;
            border-top: none !important;
          }
          .partner-image-wrapper:hover {
            transform: scale(1.05);
          }
        }

        @media (max-width: 768px) {
          .partner-container {
            padding: 40px 16px !important;
          }
          .partner-header {
            margin-bottom: 40px !important;
          }
          .partner-title {
            font-size: 32px !important;
          }
          .partner-image-box {
            height: 220px !important;
          }
          .partner-text-box {
            padding: 30px 20px !important;
          }
          .partner-card-title {
            font-size: 24px !important;
          }
          .partner-button {
            width: 100% !important;
            text-align: center !important;
          }
        }

        @media (max-width: 480px) {
          .partner-image-box {
            height: 180px !important;
          }
          .partner-text-box {
            padding: 25px 15px !important;
          }
          .partner-card-title {
            font-size: 20px !important;
          }
        }

        /* Hover Effects */
        .partner-image-wrapper:hover {
          transform: scale(1.05);
          transition: transform 0.5s ease;
        }
        
        .partner-button:hover {
          box-shadow: 0 4px 12px rgba(94, 46, 16, 0.3);
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '80px 20px',
    fontFamily: "'Playfair Display', serif",
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '80px',
  },
  badge: {
    color: 'white',
    padding: '6px 18px',
    fontSize: '13px',
    letterSpacing: '2px',
    fontWeight: '700',
    borderRadius: '50px',
    boxShadow: '0 4px 10px rgba(94, 46, 16, 0.3)',
    display: 'inline-block',
  },
  title: {
    fontSize: '56px',
    margin: '25px 0 15px',
    color: '#1a1a1a',
    fontWeight: '800',
  },
  subtitle: {
    color: '#555',
    maxWidth: '650px',
    margin: '0 auto',
    lineHeight: '1.8',
    fontSize: '18px',
  },
  underline: {
    width: '80px',
    height: '4px',
    margin: '30px auto 0',
    borderRadius: '2px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '60px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
    flexWrap: 'wrap',
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
  },
  imageWrapper: {
    width: '70%',
    transition: 'transform 0.5s ease',
    cursor: 'pointer',
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
  },
  logo: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    transition: 'transform 0.5s ease',
  },
  placeholderImage: {
    width: '100%',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    textAlign: 'center',
  },
  placeholderIcon: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  placeholderText: {
    fontSize: '14px',
    color: '#666',
    marginTop: '10px',
  },
  cardTitle: {
    fontSize: '32px',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  cardText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.7',
    marginBottom: '30px',
  },
  button: {
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
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    textAlign: 'center',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: '20px',
    padding: '10px 24px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  noDataContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
  },
};

export default Partner;