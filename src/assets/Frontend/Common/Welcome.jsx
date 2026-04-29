import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios: npm install axios
import '../../css/welcome.css'; 
import logo from '../../image/Akashbari  resort logo png-01.png';

const Welcome = () => {
  // State for storing API data
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching data from API
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/get-about-features');
        if (response.data.status === "success") {
          // Accessing the details array from the first object of data
          setFeatures(response.data.data[0].details);
        }
      } catch (error) {
        console.error("Error fetching features:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return (
    <section className="welcome-section py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Content Side */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="d-flex align-items-center gap-3">
              {/* Left Side: Text Div */}
              <div>
                <h3 className="welcome-title text-uppercase mb-0">Welcome To</h3>
                <h3 className="welcome-subtitle text-uppercase mb-0">Akashbari Resort</h3>
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
              <p>
                Akashbari Hotel & Resorts is another step forward in expanding the Akashbari brand,
                offering premium hospitality and world-class accommodation services.
              </p>
              <p>
                Akashbari Hotels & Resorts is a premium hospitality venture under the renowned
                Akashbari Holidays brand. Located in the serene and nature-rich area of Gazipur,
                the resort is designed to provide guests with an exceptional blend of comfort,
                luxury, and tranquility. Built with a vision to redefine leisure and corporate
                hospitality in Bangladesh, Akashbari Hotels & Resorts offers a refreshing escape
                from the hustle and bustle of city life.
              </p>
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