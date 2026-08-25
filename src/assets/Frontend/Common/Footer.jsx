import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import "../../css/Footer.css";
import logo from '../../image/Akashbari  resort logo png-01.png'
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Footer = () => {
  const brandColor = '#5e2e10';
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Timer function to update current year
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentYear(new Date().getFullYear());
    }, 1000); // Updates every second (though year only changes once per year)
    
    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-top">
        {/* Left Section - Address & Contact */}
        <div className="footer-col brand">
          <h2>AKASHBARI<br />HOTELS & RESORTS</h2>
          <div className="contact-info">
            <p className="address">
              <FaMapMarkerAlt className="contact-icon" />
              House 43, Road 7, Block G, Banani, Dhaka 1213
            </p>
            <p className="phone">
              <FaPhoneAlt className="contact-icon" />
              +8801329737073
            </p>
          </div>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="footer-col quick-links">
          <h3>QUICK LINKS</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Right Section - Services */}
        <div className="footer-col quick-links">
          <h3>SERVICES</h3>
          <ul>
            <li>Rooms</li>
            <li>Investment</li>
            <li>Events</li>
            <li>Facilities</li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container text-center mb-3">
        <p className="footer-copyright-text">
          &copy; {currentYear} AkashBari Hotels & Resorts. Design and Development By{" "}
          <a
            href="https://hasan-portfilo.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="developer-link"
          >
            Hasan Talukder
          </a>
        </p>
      </div>
      
      {/* Divider */}
      <div className="footer-divider"></div>

      {/* Bottom Section */}
      <div className="footer-bottom container">
        <div className="footer-logo">
          <img src={logo} alt="Akashbari Resorts Logo" />
        </div>

        <div className="social-icons">
          <a href="https://www.instagram.com/akashbariholidays_/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.facebook.com/akashbariholidays" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://www.youtube.com/@AkashbariHolidaysYT" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
          <a href="https://www.linkedin.com/company/akashbari-holidays/" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
        </div>

        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>

      <style>{`
        .footer .contact-info p {
          font-size: 14px;
          line-height: 1.6;
        }
      `}</style>
    </footer>
  );
};

export default Footer;