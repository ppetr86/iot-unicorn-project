import { createContext, useState, useEffect } from "react";
import { ApiService } from "../services/apiService";
import PropTypes from "prop-types";

export const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [refreshToken] = useState(localStorage.getItem("refreshToken") || "");
  const [error, setError] = useState(null); // New error state

  useEffect(() => {
    // Check localStorage for tokens on component mount (initial load)
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      setIsLoggedIn(true);
    }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("accessToken", accessToken);
  // }, [accessToken]);

  const getAccessTokenHeader = () => {
    return localStorage.getItem("accessToken");
  };

  const login = async (email, password) => {
    try {
      const response = await ApiService.login(email, password);
      const { accessToken } = response.data;
      setIsLoggedIn(true);
      setAccessToken(accessToken);
      setError(null); // Clear any previous error
    } catch (error) {
      console.error(error);
      setError("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoggedIn(false);
      setAccessToken("");
      localStorage.removeItem("accessToken");
      await ApiService.logout(accessToken, refreshToken);
      console.log("Logout successful");
      setError(null); // Clear any previous error
    } catch (error) {
      console.error(error);
      setError("Logout failed. Please try again.");
    }
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        getAccessTokenHeader,
        error, // Pass error state to your components
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
LoginProvider.propTypes = {
  children: PropTypes.node, // is a valid React node.
};
export default LoginProvider;