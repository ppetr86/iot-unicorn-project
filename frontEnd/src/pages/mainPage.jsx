import { useContext, useState } from "react";
import { LoginContext } from "../context/loginContext";
import { Link } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";

function MainPage() {
  const { isLoggedIn, login } = useContext(LoginContext);
  const [state, setState] = useState({
    loading: false,
    createAccount: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    logIn: {
      email: "",
      password: "",
    },
    errorMessage: "",
  });

  const updateLogInInput = (event) => {
    let { value, name } = event.target;
    setState({
      ...state,
      logIn: {
        ...state.logIn,
        [name]: value,
      },
    });
  };

  const handleLogin = () => {
    // Make a request to login
    login(state.logIn.email, state.logIn.password)
      .then(() => {
        // Handle successful login
        window.location.href = "/user";
      })
      .catch((error) => {
        // Handle login error
        console.error(error);
        setState({
          ...state,
          errorMessage: `${error.message} - ${JSON.stringify(
            error.response.data,
            null,
            2
          )}`,
        }); // Set error as a string message
      });
  };

  return (
    <>
      {JSON.stringify(state.logIn)}
      {state.errorMessage && (
        <Alert variant="danger">{state.errorMessage}</Alert>
      )}
      <section className="mainPageHeader">
        <div className="container">
          <h1>Welcome to smart terrarium web page</h1>
        </div>
      </section>
      <section className="mainPageNav">
        <div className="container">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="login-tab"
                data-bs-toggle="tab"
                data-bs-target="#login-tab-pane"
                type="button"
                role="tab"
                aria-controls="login-tab-pane"
                aria-selected="true"
              >
                LogIn
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="create-account-tab"
                data-bs-toggle="tab"
                data-bs-target="#create-account-tab-pane"
                type="button"
                role="tab"
                aria-controls="create-account-tab-pane"
                aria-selected="false"
              >
                Create Account
              </button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="login-tab-pane"
              role="tabpanel"
              aria-labelledby="login-tab"
            >
              {/* Obsah pro LogIn. */}
              <div className="logInForm">
                <form>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="logInEmail"
                      placeholder="Enter your email"
                      required
                      name="email"
                      value={state.logIn.email}
                      onChange={updateLogInInput}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="logInPassword"
                      placeholder="Enter your password"
                      required
                      name="password"
                      value={state.logIn.password}
                      onChange={updateLogInInput}
                    />
                  </div>
                  <Button variant="primary" onClick={handleLogin}>
                    LogIn
                  </Button>
                </form>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="create-account-tab-pane"
              role="tabpanel"
              aria-labelledby="create-account-tab"
            >
              {/* Obsah pro Create Account. */}
              <div className="logInForm">
                <form>
                  <div className="mb-3">
                    <label htmlFor="first-name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first-name"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="last-name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last-name"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="createPassword"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="repeat-password" className="form-label">
                      Repeat Password
                    </label>
                    <input
                      type="repeatPassword"
                      className="form-control"
                      id="repeat-password"
                      placeholder="Repeat your password"
                      required
                    />
                  </div>
                  <Button type="submit" className="btn btn-primary">
                    Create
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MainPage;
