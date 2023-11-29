import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import { useContext } from "react";
import { LoginContext } from "../context/loginContext";
import { useQueryClient } from "@tanstack/react-query";

const baseURL = import.meta.env.VITE_SERVER_URL;
const axiosHandler = axios.create({
  baseURL,
});

const CreateAxiosInterceptor = ({ children }) => {
  const [isSet, setIsSet] = useState(false);
  const { logout } = useContext(LoginContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsSet(true);
    // this intercepts every api call and check if the jwtoken is still valid. If not, the user is redirected to the login page
    const interceptor = axiosHandler.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem("accessToken");

        // Check if the request not contains the Authorization header
        if (!config.headers["Authorization"]) {
          return config; // Skip token validation, if the header is not present
        }

        // Check if the token exists and is not expired
        if (token) {
          const decodedToken = jwtDecode(token);
          const isTokenExpired = dayjs(decodedToken.exp * 1000).isBefore(
            dayjs()
          );

          if (isTokenExpired) {
            console.log("token is expired");
            return logout(), queryClient.removeQueries();
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    return () => axiosHandler.interceptors.request.eject(interceptor);
  }, [logout, queryClient]);

  return isSet && children;
};
export default axiosHandler;
export { CreateAxiosInterceptor };
