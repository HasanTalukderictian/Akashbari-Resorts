import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import "../../css/Footer.css";
import logo from '../../image/Akashbari  resort logo png-01.png';
import { Link } from "react-router-dom";

const ADDRESS = 'House 43, Road 7, Block G, Banani, Dhaka 1213';
const PHONE = '+8801701294455';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Career', to: '/career' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/akashbariholidays_/', icon: <FaInstagram /> },
  { label: 'Facebook', href: 'https://www.facebook.com/akashbariholidays', icon: <FaFacebookF /> },
  { label: 'YouTube', href: 'https://www.youtube.com/@AkashbariHolidaysYT', icon: <FaYoutube /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/akashbari-holidays/', icon: <FaLinkedinIn /> },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ab-footer">
      <div className="container">
        <div className="ab-footer-top">

          {/* ---------- Brand ---------- */}
          <div className="ab-footer-col ab-footer-brand">
            <Link to="/" className="ab-footer-logo" aria-label="Akashbari Hotels & Resorts — Home">
              <img src={logo} alt="Akashbari Resorts Logo" />
            </Link>
            <h2>AKASHBARI<br />HOTELS &amp; RESORTS</h2>
            <p className="ab-footer-tagline">
              Comfort, nature and hospitality — your perfect escape awaits.
            </p>
          </div>

          {/* ---------- Quick Links ---------- */}
          <div className="ab-footer-col">
            <h3>QUICK LINKS</h3>
            <ul className="ab-footer-links">
              {QUICK_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Contact + Social ---------- */}
          <div className="ab-footer-col">
            <h3>GET IN TOUCH</h3>

            <a
              className="ab-footer-contact"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaMapMarkerAlt className="ab-footer-icon" />
              <span>{ADDRESS}</span>
            </a>

            <a className="ab-footer-contact" href={`tel:${PHONE}`}>
              <FaPhoneAlt className="ab-footer-icon" />
              <span>{PHONE}</span>
            </a>

            <div className="ab-footer-social">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Bottom ---------- */}
        <div className="ab-footer-bottom">
          <p>&copy; {currentYear} AkashBari Hotels &amp; Resorts. All rights reserved.</p>
          <p>
            Created by{' '}
            <a
              href="https://hasan-portfilo.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="ab-footer-dev"
            >
              Hasan Talukder
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;