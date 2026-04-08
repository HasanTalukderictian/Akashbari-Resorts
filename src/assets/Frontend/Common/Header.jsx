import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import "../../css/Header.css";
import Logo from "../../image/Akashbari  resort logo png-01.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky-header">
      <Container fluid className="px-4">
        <Navbar expand="lg" className="py-2">

          {/* Logo */}
          <Navbar.Brand onClick={() => navigate("/")}>
            <img src={Logo} alt="Logo" className="logo" />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center menu">
              
              <Nav.Link onClick={() => navigate("/")}>HOME</Nav.Link>
              <Nav.Link>PACKAGES</Nav.Link>
              <Nav.Link>DESTINATIONS</Nav.Link>
              <Nav.Link>HOTELS & RESORTS</Nav.Link>
              <Nav.Link>ABOUT</Nav.Link>
              <Nav.Link>AFFILIATES</Nav.Link>

              {/* Contact Button */}
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