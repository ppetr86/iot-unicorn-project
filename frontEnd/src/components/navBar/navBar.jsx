import { Navbar, Nav, Button } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { House } from "react-bootstrap-icons";
import { LoginContext } from "../../context/loginContext";
import { useContext } from "react";

const NavBar = () => {
  const { isLoggedIn, logout } = useContext(LoginContext);

  const handleLogout = () => {
    logout(); // Call the logout function from LoginContext
  };
  return (
    <>
      <div className="navbar-container sticky-top">
        <Navbar bg="dark" data-bs-theme="dark">
          <Nav className="mr-auto">
            <House color="gold" size={65} />
          </Nav>
          {isLoggedIn ? ( // Check if user is logged in
            <Nav>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          ) : null}
        </Navbar>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};

export default NavBar;
