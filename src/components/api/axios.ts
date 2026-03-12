import axios from "axios";
import env from "../../config/env";

const URL_API = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * Attach token automatically
 */
URL_API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 */
URL_API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    /**
     * Prevent redirect when login fails
     */
    if (status === 401 && requestUrl !== "/user/login") {
      localStorage.clear();

      // safer redirect
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default URL_API;