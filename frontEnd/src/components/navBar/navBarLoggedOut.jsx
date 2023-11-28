import { Navbar } from "react-bootstrap";
import { Outlet, NavLink } from "react-router-dom";

const NavBarLoggedOut = () => {
  return (
    <>
      <div className="navbar-container sticky-top">
        <Navbar bg="dark" variant="dark" expand="md">
          <Navbar.Brand>
            <h1>🌡️🦎📡</h1>
          </Navbar.Brand>
        </Navbar>
      </div>
      <Outlet />
    </>
  );
};

export default NavBarLoggedOut;
