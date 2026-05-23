import React, { useEffect, useState } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';

const Partner = () => {
  const [imageErrors, setImageErrors] = useState({});

  // Page load scroll to top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  // Static Partners Data (No API needed)
  const partners = [
    {
      id: 1,
      name: "Cholo Jai Limited",
      description: "Cholo Jai is an online-based travel start-up dedicated to ensuring a smooth and hassle-free travel experience for all travelers. By combining friendly customer support with modern technology, the company provides complete travel assistance, including expert travel advice, competitively priced tour packages, and air ticketing services. Its call center is operated by skilled and travel-experienced professionals who deliver personalized support around the clock. Reflecting Bangladesh's language and culture, Cholo Jai offers Bangla content on its website and remains committed to providing reliable travel solutions both online and offline as a trusted travel partner.",
      logo: "https://i.ibb.co.com/SwtBWxCF/xx-2.webp",
    //   website: "https://www.cholojaibd.com",
      buttonText: "VISIT WEBSITE ↗"
    },
    {
      id: 2,
      name: "Pan Pacific Tours",
      description: "Pan Pacific Tours is a next-generation travel agency dedicated to simplifying global travel. Since our launch in 2024, we have been committed to connecting travelers with unforgettable experiences, whether it's flights, hotels, holiday packages, or Umrah services. With trusted global partners and 24/7 support, we're here to make travel seamless for everyone.",
      logo: "https://i.ibb.co.com/tpNjY45Q/yy.webp",
    //   website: "https://www.panpacifictours.com",
      buttonText: "VISIT WEBSITE ↗"
    }
  ];

  // Handle image error
  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Handle view details click
  const handleViewDetails = (website) => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <Header />
      
      <main style={styles.container}>
        {/* Header Section */}
        <section style={styles.headerSection}>
          <span style={styles.badge}>OUR NETWORK</span>
          <h1 style={styles.title}>Our Partners</h1>
          <p style={styles.subtitle}>
            Discover our partners dedicated to serving your travel, hospitality, 
            and lifestyle needs with excellence and integrity.
          </p>
          <div style={styles.underline}></div>
        </section>

        {/* Partners Grid */}
        <section style={styles.grid}>
          {partners.map((item, index) => {
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
                    {!imageErrors[item.id] ? (
                      <img 
                        src={item.logo} 
                        alt={item.name} 
                        style={styles.logo}
                        onError={() => handleImageError(item.id)}
                      />
                    ) : (
                      <div style={styles.placeholderImage}>
                        <i className="bi bi-building" style={styles.placeholderIcon}></i>
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
                    borderLeft: isReverse ? '1px solid #e0e0e0' : 'none',
                    borderRight: isReverse ? 'none' : '1px solid #e0e0e0',
                  }}
                >
                  <h2 style={styles.cardTitle}>{item.name}</h2>
                  <p style={styles.cardText}>{item.description}</p>
                  <button 
                    className="partner-button"
                    style={styles.button}
                    onClick={() => handleViewDetails(item.website)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#5e853d';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#76a34d';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {item.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />

      {/* Add responsive styles */}
      <style jsx="true">{`
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
          box-shadow: 0 4px 12px rgba(118, 163, 77, 0.3);
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
    backgroundColor: '#76a34d',
    color: 'white',
    padding: '6px 18px',
    fontSize: '13px',
    letterSpacing: '2px',
    fontWeight: '700',
    borderRadius: '50px',
    boxShadow: '0 4px 10px rgba(118, 163, 77, 0.3)',
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
    backgroundColor: '#76a34d',
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
    color: '#76a34d',
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
    color: '#1a1a1a',
    lineHeight: '1.2',
  },
  cardText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.7',
    marginBottom: '30px',
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
  },
};

export default Partner;