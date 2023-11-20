import { createContext, useState } from "react";
import { ApiService } from "../services/apiService";
import PropTypes from "prop-types";

export const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [isLoggedIn, setIsLoggedIn] = useState(accessToken ? true : false);
  const [userData, setuserData] = useState(
    localStorage.getItem("userData") || ""
  );
  const [error, setError] = useState(null); // New error state

  const getAccessTokenHeader = () => {
    return localStorage.getItem("accessToken");
  };

  const login = async (email, password) => {
    try {
      const response = await ApiService.login(email, password);
      const accessToken = response.data.token;
      const userData = response.data.data;
      console.log(userData);
      setIsLoggedIn(true);
      setuserData(userData);
      setAccessToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      setError(null); // Clear any previous error
    } catch (error) {
      console.error(error);
      setError("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAccessToken("");
    localStorage.removeItem("accessToken");
    console.log("Logout successful");
    setError(null); // Clear any previous error
  };

  return (
    <LoginContext.Provider
      value={{
        userData,
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
