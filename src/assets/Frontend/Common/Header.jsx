import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import "../../css/Header.css";
import Logo from "../../image/Akashbari  resort logo png-01.png";

const scrollToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Home page এর কোনো section এ যাওয়া
  const goToSection = (id) => {
    if (isHome) {
      scrollToId(id);
    } else {
      // Landing page data load হওয়ার পর নিজেই এই section এ scroll করবে
      navigate("/", { state: { scrollTo: id } });
    }
  };

  const handleHomeClick = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <header className="sticky-header shadow-sm">
      <Container>
        {/* collapseOnSelect: mobile এ menu item চাপলে menu বন্ধ হবে */}
        <Navbar expand="lg" collapseOnSelect className="py-2 px-0">
          <Navbar.Brand
            onClick={handleHomeClick}
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <img src={Logo} alt="Logo" className="logo" />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center menu">
              <Nav.Link eventKey="home" onClick={handleHomeClick}>
                HOME
              </Nav.Link>

              <Nav.Link eventKey="packages" onClick={() => goToSection("invest-section")}>
                PACKAGES
              </Nav.Link>

              <Nav.Link eventKey="investment" onClick={() => goToSection("owner-section")}>
                INVESTMENT
              </Nav.Link>

              <Nav.Link eventKey="gallery" onClick={() => navigate("/gallery")}>
                GALLERY
              </Nav.Link>

              <Nav.Link eventKey="about" onClick={() => navigate("/about")}>
                ABOUT US
              </Nav.Link>

              <Nav.Link eventKey="blog" onClick={() => navigate("/blog")}>
                BLOG
              </Nav.Link>

              <Nav.Link eventKey="career" onClick={() => navigate("/career")}>
                CAREER
              </Nav.Link>

              <Nav.Link eventKey="event" onClick={() => navigate("/all-events")}>
                EVENT
              </Nav.Link>

              <button className="contact-btn" onClick={() => navigate("/contact")}>
                CONTACT
              </button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;