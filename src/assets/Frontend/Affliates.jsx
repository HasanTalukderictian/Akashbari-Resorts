import React, { useState } from 'react';
import Header from './Common/Header';
import Footer from './Common/Footer';
import logo1 from '../../assets/image/section/Blog/ddd.jpg';
import logo2 from '../../assets/image/section/Blog/hhh.jpg';
import logo3 from '../../assets/image/section/Blog/kkk.jpg';

const Affiliates = () => {
  const partners = [
    {
      name: "Akashbari Global Service",
      description: "Akashbari Global Services known as AGS is one of the best education consultancy services in Bangladesh. Best services for Study Abroad & Visa Consultancy and student support from university application to immigration.",
      logo: logo1,
      reverse: false
    },
    {
      name: "Rupkatha Adventure Tours",
      description: "Rupkatha Adventure Tours is a top-tier travel agency specializing in Holidays Packages, International Hotels, Air Tickets, and Visa processing with a focus on customer satisfaction.",
      logo: logo2,
      reverse: true
    },
    {
      name: "Rupkatha Edu World",
      description: "A Bangladesh-based education consultancy that turns global dreams into achievable journeys through thoughtful counseling, seamless admissions, and scholarship guidance.",
      logo: logo3,
      reverse: false
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
          {partners.map((item, index) => (
            <div key={index} style={{
              ...styles.row,
              flexDirection: item.reverse ? 'row-reverse' : 'row'
            }}>
              {/* Image Box with Hover Effect Container */}
              <div style={styles.imageBox}>
                <div style={styles.imageWrapper}>
                  <img src={item.logo} alt={item.name} style={styles.logo} />
                </div>
              </div>

              {/* Text Box with Card Style */}
              <div style={styles.textBox}>
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
          ))}
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
    fontFamily: "'Playfair Display', serif", // More elegant serif
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
    borderRadius: '50px', // Rounded badge looks more modern
    boxShadow: '0 4px 10px rgba(118, 163, 77, 0.3)',
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
    gap: '0px', // Removed gap to allow the borders to "touch" or align closely
    flexWrap: 'wrap',
    transition: 'transform 0.3s ease',
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
    width: '80%',
    transition: 'transform 0.5s ease',
  },
  textBox: {
    flex: '1',
    minWidth: '350px',
    height: '400px',
    border: '1px solid #e0e0e0',
    padding: '60px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fdfdfd',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    borderLeft: 'none', // Creates a seamless look on desktop
  },
  logo: {
    width: '100%',
    height: 'auto',
    filter: 'grayscale(20%)', // Slight grayscale for professional look
  },
  cardTitle: {
    fontSize: '36px',
    marginBottom: '20px',
    color: '#1a1a1a',
    lineHeight: '1.2',
  },
  cardText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.9',
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
    boxShadow: '0 4px 15px rgba(118, 163, 77, 0.2)',
  }
};

export default Affiliates;