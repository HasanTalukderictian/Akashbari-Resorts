import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import "../../css/Header.css";
import Logo from "../../image/Akashbari  resort logo png-01.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // একই page এ থাকলে উপরে scroll, না হলে সেই page এ যাও
  const goToPage = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(path);
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <header className="sticky-header shadow-sm">
      <Container>
        {/* collapseOnSelect: mobile এ menu item চাপলে menu বন্ধ হবে */}
        <Navbar expand="lg" collapseOnSelect className="py-2 px-0">
          <Navbar.Brand
            onClick={() => goToPage("/")}
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <img src={Logo} alt="Logo" className="logo" />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center menu">
              <Nav.Link eventKey="home" onClick={() => goToPage("/")}>
                HOME
              </Nav.Link>

              {/* Investment + Packages + Owner */}
              <Nav.Link eventKey="investment" onClick={() => goToPage("/investment")}>
                INVESTMENT
              </Nav.Link>

              {/* Welcome + Facility */}
              <Nav.Link eventKey="benefits" onClick={() => goToPage("/benefits")}>
                BENEFITS
              </Nav.Link>

              <Nav.Link eventKey="gallery" onClick={() => goToPage("/gallery")}>
                GALLERY
              </Nav.Link>

              <Nav.Link eventKey="about" onClick={() => goToPage("/about")}>
                ABOUT US
              </Nav.Link>

              <Nav.Link eventKey="blog" onClick={() => goToPage("/blog")}>
                BLOG
              </Nav.Link>

              <Nav.Link eventKey="career" onClick={() => goToPage("/career")}>
                CAREER
              </Nav.Link>

              <Nav.Link eventKey="event" onClick={() => goToPage("/all-events")}>
                EVENT
              </Nav.Link>

              <Nav.Link eventKey="contact" onClick={() => goToPage("/contact")}>
                CONTACT
              </Nav.Link>

              <button className="contact-btn" onClick={() => goToPage("/invest-form")}>
                Ownership
              </button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;