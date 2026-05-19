import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom'; // রাউটিং এর জন্য Link ইম্পোর্ট করা হয়েছে
import '../../css/welcome.css'; 
import logo from '../../image/Akashbari  resort logo png-01.png';

const Welcome = () => {
  // State for storing API data
  const [features, setFeatures] = useState([]);
  const [welcomeData, setWelcomeData] = useState(null); // Left side data state
  const [loading, setLoading] = useState(true);
  
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetching data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching Left Side (Welcome) Data
        const welcomeRes = await axios.get(`${API_BASE_URL}/get-welcomes`);
        if (welcomeRes.data.success && welcomeRes.data.data.length > 0) {
          setWelcomeData(welcomeRes.data.data[0]);
        }

        // Fetching Right Side (Features) Data
        const featuresRes = await axios.get(`${API_BASE_URL}/get-about-features`);
        if (featuresRes.data.status === "success") {
          setFeatures(featuresRes.data.data[0].details);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="welcome-section py-5">
      <div className="container">
        <div className="row align-items-center">
          
          {/* Left Content Side - Now Dynamic */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="d-flex align-items-center gap-3">
              {/* Left Side: Text Div */}
              <div>
                <h3 className="welcome-title text-uppercase mb-0">
                   {welcomeData ? welcomeData.title.split(' ').slice(0, 2).join(' ') : "Welcome To"}
                </h3>
                <h3 className="welcome-subtitle text-uppercase mb-0">
                   {welcomeData ? welcomeData.title.split(' ').slice(2).join(' ') : "Akashbari Resort"}
                </h3>
              </div>

              {/* Right Side: Image Div */}
              <div className="welcome-logo-wrapper">
                <img
                  src={logo}
                  alt="logo"
                  style={{ width: '110px', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>
            <div className="yellow-divider mb-4"></div>

            <div className="welcome-text">
              {welcomeData ? (
                welcomeData.description.split('\r\n\r\n').map((para, index) => (
                  <p key={index}>{para}</p>
                ))
              ) : (
                <p>Loading description...</p>
              )}
            </div>

            {/* বাটনটি এখানে ফিক্স করা হয়েছে */}
            <div className="mt-4">
              <Link 
                to="/club" 
                className="btn text-uppercase px-4 py-2 text-decoration-none"
                style={{ 
                  backgroundColor: '#b8860b', 
                  color: '#ffffff',
                  fontWeight: '500',
                  letterSpacing: '1px',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#b8860b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#b8860b';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                Club
              </Link>
            </div>
          </div>

          {/* Right Features Side - Dynamic Part - Icons Removed */}
          <div className="col-lg-5 offset-lg-1">
            <div className="features-box p-4 p-md-5">
              <h2 className="features-title text-center text-uppercase mb-4">Resort Features</h2>
              
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                <ul className="list-unstyled features-list">
                  {features.map((item, index) => (
                    <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;