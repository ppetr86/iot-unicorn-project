import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_URL;

const axiosHandler = axios.create({
  baseURL,
});
export default axiosHandler;
