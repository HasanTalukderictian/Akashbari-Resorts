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

          {/* Logo - ক্লিক করলে হোমে যাবে */}
          <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
            <img src={Logo} alt="Logo" className="logo" />
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center menu">
              
              <Nav.Link onClick={() => navigate("/")}>HOME</Nav.Link>
              <Nav.Link onClick={() => navigate("/packages")}>PACKAGES</Nav.Link>
              <Nav.Link onClick={() => navigate("/destinations")}>DESTINATIONS</Nav.Link>
              <Nav.Link onClick={() => navigate("/resorts")}>HOTELS & RESORTS</Nav.Link>
              
              {/* About Us Link যুক্ত করা হয়েছে */}
              <Nav.Link onClick={() => navigate("/about")}>ABOUT US</Nav.Link>
              
              <Nav.Link onClick={() => navigate("/affiliates")}>AFFILIATES</Nav.Link>

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