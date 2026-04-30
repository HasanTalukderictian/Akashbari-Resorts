import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import '../../css/welcome.css'; 
import logo from '../../image/Akashbari  resort logo png-01.png';

const Welcome = () => {
  // State for storing API data
  const [features, setFeatures] = useState([]);
  const [welcomeData, setWelcomeData] = useState(null); // Left side data state
  const [loading, setLoading] = useState(true);

  // Fetching data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching Left Side (Welcome) Data
        const welcomeRes = await axios.get('http://127.0.0.1:8000/api/get-welcomes');
        if (welcomeRes.data.success && welcomeRes.data.data.length > 0) {
          setWelcomeData(welcomeRes.data.data[0]);
        }

        // Fetching Right Side (Features) Data
        const featuresRes = await axios.get('http://127.0.0.1:8000/api/get-about-features');
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
                   {/* splitting "Welcome To Akashbari Resort" if needed, or just showing title */}
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
              {/* API theke asha description render hocche */}
              {welcomeData ? (
                welcomeData.description.split('\r\n\r\n').map((para, index) => (
                  <p key={index}>{para}</p>
                ))
              ) : (
                <p>Loading description...</p>
              )}
            </div>
          </div>

          {/* Right Features Side - Dynamic Part */}
          <div className="col-lg-5 offset-lg-1">
            <div className="features-box p-4 p-md-5">
              <h2 className="features-title text-center text-uppercase mb-4">Resort Features</h2>
              
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                <ul className="list-unstyled features-list">
                  {features.map((item, index) => (
                    <li key={index}>
                      <i className="bi bi-check2"></i> {item}
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