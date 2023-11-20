import { useState } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Outlet, NavLink } from "react-router-dom";
import { LoginContext } from "../../context/loginContext";
import { useContext } from "react";

const NavBar = () => {
  const { isLoggedIn, logout } = useContext(LoginContext);
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout(); // Call the logout function from LoginContext
  };

  return (
    <>
      <div className="navbar-container sticky-top">
        <Navbar bg="dark" variant="dark" expand="md">
          <Navbar.Brand href="/">
            <h1>🌡️🦎📡</h1>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`${expanded ? "show" : ""}`}
          >
            <Nav className="mr-auto">
              {isLoggedIn ? (
                <>
                  <Nav.Link as={NavLink} to="/user">
                    User
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/createTerrarium">
                    Create Terrarium
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/dashboard">
                    Dashboard
                  </Nav.Link>
                  {/* <Nav.Link as={NavLink} to="/terrarium">
                    Terrarium
                  </Nav.Link> */}
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};

export default NavBar;
