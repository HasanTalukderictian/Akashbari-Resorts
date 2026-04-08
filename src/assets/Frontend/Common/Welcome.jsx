import React from 'react';
import '../../css/welcome.css'; // Make sure to create this file
import logo from '../../image/Akashbari  resort logo png-01.png';

const Welcome = () => {
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

          {/* Right Features Side */}
          <div className="col-lg-5 offset-lg-1">
            <div className="features-box p-4 p-md-5">
              <h2 className="features-title text-center text-uppercase mb-4">Resort Features</h2>
              <ul className="list-unstyled features-list">
                <li><i className="bi bi-check2"></i> Total Land Area: 22 Bigha</li>
                <li><i className="bi bi-check2"></i> Number of Rooms: 102</li>
                <li><i className="bi bi-check2"></i> 40+ Premium Facilities</li>
                <li><i className="bi bi-check2"></i> Presidential Suites</li>
                <li><i className="bi bi-check2"></i> Premium Suites</li>
                <li><i className="bi bi-check2"></i> Deluxe Rooms</li>
                <li><i className="bi bi-check2"></i> Villa Suites</li>
                <li><i className="bi bi-check2"></i> Swimming Pool: 01</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;