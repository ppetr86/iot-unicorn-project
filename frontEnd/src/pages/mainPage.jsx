import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context/loginContext";
import { useNavigate } from "react-router-dom";
import { Button, Alert, Form, Spinner } from "react-bootstrap";
import { ApiService } from "../services/apiService";

function MainPage() {
  const { isLoggedIn, login } = useContext(LoginContext);
  const [newAccountSuccess, setNewAccountSuccess] = useState(false);
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
  const [validationErrors, setValidationErrors] = useState({
    logIn: {
      email: "",
      password: "",
    },
    createAccount: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const navigateTo = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigateTo("/user");
    }
  }, [isLoggedIn, navigateTo]);

  const updateLogInInput = (event) => {
    let { value, name } = event.target;
    setState((prevState) => ({
      ...prevState,
      logIn: {
        ...prevState.logIn,
        [name]: value,
      },
    }));
  };
  const updateCreateAccountInput = (event) => {
    let { value, name } = event.target;
    setState((prevState) => ({
      ...prevState,
      createAccount: {
        ...prevState.createAccount,
        [name]: value,
      },
    }));
  };

  const handleLogin = () => {
    // Clear validation errors
    setValidationErrors({ ...validationErrors, logIn: {} });

    if (!state.logIn.email || !state.logIn.password) {
      setValidationErrors({
        ...validationErrors,
        logIn: {
          email: !state.logIn.email,
          password: !state.logIn.password,
        },
      });
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true }));
    // Make a request to login
    login(state.logIn.email, state.logIn.password)
      .then(() => {
        setState((prevState) => ({ ...prevState, loading: false }));
      })
      .catch((error) => {
        // Handle login error
        console.error(error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
          errorMessage: `${error.message} - ${JSON.stringify(
            error.response.data,
            null,
            2
          )}`,
        })); // Set error as a string message
      });
  };

  const handleCreateAccount = async () => {
    // Clear validation errors
    setValidationErrors({ ...validationErrors, createAccount: {} });
    if (
      !state.createAccount.firstName ||
      !state.createAccount.lastName ||
      !state.createAccount.email ||
      !state.createAccount.password ||
      !state.createAccount.confirmPassword ||
      state.createAccount.password !== state.createAccount.confirmPassword
    ) {
      setValidationErrors({
        ...validationErrors,
        createAccount: {
          firstName: !state.createAccount.firstName,
          lastName: !state.createAccount.lastName,
          email: !state.createAccount.email,
          password: !state.createAccount.password,
          confirmPassword:
            state.createAccount.password !==
            state.createAccount.confirmPassword,
        },
      });
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await ApiService.createUser(
        state.createAccount.email,
        state.createAccount.password,
        state.createAccount.firstName,
        state.createAccount.lastName
      );
      setState((prevState) => ({ ...prevState, loading: false }));
      if (response.status === 201) {
        setNewAccountSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setState((prevState) => ({
        ...prevState,
        errorMessage: `${error.message} - ${JSON.stringify(
          error.response.data,
          null,
          2
        )}`,
      }));
    }
  };

  return (
    <>
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
                <Form className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      id="logInEmail"
                      placeholder="Enter your email"
                      required
                      name="email"
                      value={state.logIn.email}
                      onChange={updateLogInInput}
                      isInvalid={validationErrors.logIn.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid email.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      id="logInPassword"
                      placeholder="Enter your password"
                      required
                      name="password"
                      value={state.logIn.password}
                      onChange={updateLogInInput}
                      isInvalid={validationErrors.logIn.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter your password.
                    </Form.Control.Feedback>
                  </Form.Group>
                  {state.loading ? (
                    <Button variant="primary" type="button" disabled>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Loading...
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handleLogin}>
                      LogIn
                    </Button>
                  )}
                </Form>
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
                {newAccountSuccess ? (
                  <div className="alert alert-success" role="alert">
                    {`🚀 Welcome on board, ${state.createAccount.firstName}! Your account ${state.createAccount.email} has been ✅ successfully created! You can now log in 🔑.`}
                  </div>
                ) : (
                  <Form className="col-6">
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        id="first-name"
                        placeholder="Enter your first name"
                        required
                        name="firstName"
                        value={state.createAccount.firstName}
                        onChange={updateCreateAccountInput}
                        isInvalid={validationErrors.createAccount.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your first name.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        id="last-name"
                        placeholder="Enter your last name"
                        required
                        name="lastName"
                        value={state.createAccount.lastName}
                        onChange={updateCreateAccountInput}
                        isInvalid={validationErrors.createAccount.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your last name.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        id="createAccountEmail"
                        placeholder="Enter your email"
                        required
                        name="email"
                        value={state.createAccount.email}
                        onChange={updateCreateAccountInput}
                        isInvalid={validationErrors.createAccount.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        id="createPassword"
                        placeholder="Enter your password"
                        required
                        name="password"
                        value={state.createAccount.password}
                        onChange={updateCreateAccountInput}
                        isInvalid={validationErrors.createAccount.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your password.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Repeat Password</Form.Label>
                      <Form.Control
                        type="password"
                        id="repeat-password"
                        placeholder="Repeat your password"
                        required
                        name="confirmPassword"
                        value={state.createAccount.confirmPassword}
                        onChange={updateCreateAccountInput}
                        isInvalid={
                          validationErrors.createAccount.confirmPassword
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Passwords do not match.
                      </Form.Control.Feedback>
                    </Form.Group>
                    {state.loading ? (
                      <Button variant="primary" type="button" disabled>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Loading...
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleCreateAccount}>
                        Create
                      </Button>
                    )}
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MainPage;
