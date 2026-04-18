import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import "../../css/Header.css";
import Logo from "../../image/Akashbari  resort logo png-01.png";

const Header = () => {
  const navigate = useNavigate();

  return (
   
    <header className="sticky-header shadow-sm">
  {/* Fluid baad diye sudhu Container use korun */}
  <Container> 
    <Navbar expand="lg" className="py-2 px-0"> {/* px-0 dile content container er sathe align hobe */}
      
      {/* Logo */}
      {/* <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        <img src={Logo} alt="Logo" className="logo" />
      </Navbar.Brand> */}

      <Navbar.Brand 
            onClick={() => navigate("/")} 
            className="d-flex align-items-center"
            style={{ cursor: 'pointer' }}
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
          <Nav.Link onClick={() => navigate("/")}>HOME</Nav.Link>
          <Nav.Link onClick={() => navigate("/gallery")}>GALLERY</Nav.Link>
          <Nav.Link onClick={() => navigate("/about")}>ABOUT US</Nav.Link>
          <Nav.Link onClick={() => navigate("/blog")}>BLOG</Nav.Link>

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