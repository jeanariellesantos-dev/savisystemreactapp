import axios from 'axios';
import env from "../../config/env";

const URL_API = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

URL_API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

URL_API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TOKEN EXPIRED OR INVALID
      localStorage.clear();

      // Hard redirect prevents back navigation
      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default URL_API;