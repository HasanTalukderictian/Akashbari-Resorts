import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import "../../css/Footer.css";
import logo from '../../image/Akashbari  resort logo png-01.png'

const Footer = () => {
  // Automatically gets the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-top">
        {/* Left Section */}
        <div className="footer-col brand">
          <h2>AKASHBARI<br />HOLIDAYS</h2>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Akashbari Resort</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Middle Section */}
        <div className="footer-col services">
          <h3>SERVICES</h3>
          <ul>
            <li>Packages</li>
            <li>Destinations</li>
            <li>Medical Tourism</li>
            <li>Price List</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-col cta">
          <h3>Design your<br />customized package</h3>
          <button className="cta-btn">
            CONTACT US NOW →
          </button>
        </div>
      </div>

      {/* --- Added Copyright Section Above Divider --- */}
      <div className="container text-center mb-3">
        <p className="footer-copyright-text">
          &copy; {currentYear} AkashBari Resorts. Design and Development By{" "}
          <a
            href="https://hasan-portfilo.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="developer-link"
            style={{ textDecoration: "none" }}
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
          <img src={logo} alt="logo" />
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
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;