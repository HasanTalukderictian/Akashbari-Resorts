import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

import "../../css/Header.css";
import Logo from "../../image/Akashbari  resort logo png-01.png";

const Header = ({ scrollToOwner }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleInvestmentClick = () => {

    // already home page
    if (location.pathname === "/") {

      scrollToOwner?.();

    } else {

      // first go home page
      navigate("/");

      // wait page render
      setTimeout(() => {

        const ownerSection =
          document.getElementById("owner-section");

        ownerSection?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }, 500);
    }
  };

  const handleHomeClick = () => {

    navigate("/");

    setTimeout(() => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }, 100);
  };

  return (
    <header className="sticky-header shadow-sm">

      <Container>
        <Navbar expand="lg" className="py-2 px-0">

          {/* Logo */}
          <Navbar.Brand
            onClick={handleHomeClick}
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <img
              src={Logo}
              alt="Logo"
              className="logo"
            />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>

            <Nav className="ms-auto align-items-center menu">

              <Nav.Link onClick={handleHomeClick}>
                HOME
              </Nav.Link>

              <Nav.Link onClick={handleInvestmentClick}>
                INVESTMENT
              </Nav.Link>

              <Nav.Link onClick={() => navigate("/gallery")}>
                GALLERY
              </Nav.Link>

              <Nav.Link onClick={() => navigate("/about")}>
                ABOUT US
              </Nav.Link>

              <Nav.Link onClick={() => navigate("/blog")}>
                BLOG
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/all-events")}>
                EVENT
              </Nav.Link>

              {/* AFFILIATES Dropdown Menu */}
              <NavDropdown
                title={<span style={{ color: "#5e2e10" }}>AFFILIATES</span>}
                id="affiliates-dropdown"
              >
                <NavDropdown.Item onClick={() => navigate("/partner")}>
                  PARTNER
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/sister")}>
                  SISTER CONCERS
                </NavDropdown.Item>
              </NavDropdown>

              <button
                className="contact-btn"
                onClick={() => navigate("/contact")}
              >
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