import axios from "axios";
import * as jwtDecode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = import.meta.env.VITE_SERVER_URL;

const axiosHandler = axios.create({
  baseURL,
});

// this intercepts every api call and check if the jwtoken is still valid. If not, the user is redirected to the login page
axiosHandler.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");

    // Check if the token exists and is not expired
    if (token) {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = dayjs(decodedToken.exp * 1000).isBefore(dayjs());

      if (isTokenExpired) {
        window.location.href = "/";
      } else {
        // Token is valid, use it for the request
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosHandler;
