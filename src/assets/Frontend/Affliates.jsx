import React from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import logo1 from '../../assets/image/section/Blog/ddd.jpg';
import logo2 from '../../assets/image/section/Blog/hhh.jpg';
import logo3 from '../../assets/image/section/Blog/kkk.jpg';
import logo4 from '../../assets/image/section/Blog/logo (1).webp';

const Affiliates = () => {
  const partners = [
    {
      name: "Akashbari Holidays",
      description: "Akashbari Holidays is your gateway to unforgettable adventures around the world. Whether you dream of a getaway to North America, an immersion in the cultural riches of Europe, or a luxurious adventure in French Polynesia, we offer exceptional trips that transcend simple vacations to become truly unforgettable experiences.",
      logo: logo4,
    },
    {
      name: "Akashbari Global Service",
      description: "Akashbari Global Services known as AGS is one of the best education consultancy services in Bangladesh. Best services for Study Abroad & Visa Consultancy and student support from university application to immigration.",
      logo: logo1,
    },
    {
      name: "Rupkatha Adventure Tours",
      description: "Rupkatha Adventure Tours is a top-tier travel agency specializing in Holidays Packages, International Hotels, Air Tickets, and Visa processing with a focus on customer satisfaction.",
      logo: logo2,
    },
    {
      name: "Rupkatha Edu World",
      description: "A Bangladesh-based education consultancy that turns global dreams into achievable journeys through thoughtful counseling, seamless admissions, and scholarship guidance.",
      logo: logo3,
    }
  ];

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
              <div key={index} style={{
                ...styles.row,
                flexDirection: isReverse ? 'row-reverse' : 'row'
              }}>
                {/* Image Box */}
                <div style={styles.imageBox}>
                  <div style={styles.imageWrapper}>
                    <img src={item.logo} alt={item.name} style={styles.logo} />
                  </div>
                </div>

                {/* Text Box */}
                <div style={{
                  ...styles.textBox,
                  // Fix: Remove border on the side that touches the image
                  borderLeft: isReverse ? '1px solid #e0e0e0' : 'none',
                  borderRight: isReverse ? 'none' : '1px solid #e0e0e0',
                }}>
                  <h2 style={styles.cardTitle}>{item.name}</h2>
                  <p style={styles.cardText}>{item.description}</p>
                  <button 
                    style={styles.button}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#5e853d'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#76a34d'}
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
    // Mobile padding adjustment
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
  }
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