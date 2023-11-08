import { Navbar, Nav } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { House } from "react-bootstrap-icons";
const NavBar = () => {
  return (
    <>
      <div className="navbar-container sticky-top">
        <Navbar bg="dark" data-bs-theme="dark">
          <Nav className="mr-auto">
            <House color="gold" size={65} />
          </Nav>
        </Navbar>
      </div>
      <Outlet />
    </>
  );
};
export default NavBar;
