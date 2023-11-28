import { useState } from "react";
import { Navbar, Nav, Button, NavDropdown, Spinner } from "react-bootstrap";
import { Outlet, NavLink } from "react-router-dom";
import { LoginContext } from "../../context/loginContext";
import { useContext } from "react";
import GlobalDataFetch from "../../services/globalDataFetch";

const NavBar = () => {
  const { isLoggedIn, logout } = useContext(LoginContext);

  const [expanded, setExpanded] = useState(false);
  const { data, isLoading, isError } = GlobalDataFetch();

  const handleLogout = () => {
    logout(); // Call the logout function from LoginContext
  };

  return (
    <>
      <div className="navbar-container sticky-top">
        <Navbar bg="dark" variant="dark" expand="md">
          <Navbar.Brand>
            <Nav.Link as={NavLink} to="/dashboard">
              <h1>🌡️🦎📡</h1>
            </Nav.Link>
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
                  <NavDropdown
                    title={
                      isLoading ? (
                        <>
                          {"Terrariums "}
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            text="light"
                          />
                        </>
                      ) : (
                        <>{"Terrariums"}</>
                      )
                    }
                    id="basic-nav-dropdown"
                  >
                    {isLoading ? (
                      <NavDropdown.Item disabled>Loading ...</NavDropdown.Item>
                    ) : data &&
                      data.data &&
                      data.data.terrariums &&
                      data.data.terrariums.length > 0 ? (
                      data.data.terrariums.map((terrarium) => (
                        <NavDropdown.Item
                          as={NavLink}
                          to={`/terrarium/${terrarium._id}`}
                          key={terrarium._id}
                        >
                          {terrarium.name}
                        </NavDropdown.Item>
                      ))
                    ) : isError ? (
                      <NavDropdown.Item disabled>
                        Error fetching terrariums
                      </NavDropdown.Item>
                    ) : (
                      <NavDropdown.Item disabled>
                        No terrariums available
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>

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
