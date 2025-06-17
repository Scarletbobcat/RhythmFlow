import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// Automatically set the Authorization header for all requests
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(
      localStorage.getItem("sb-emvtnpvqsjljsrkzmwwp-auth-token") ?? "{}"
    ).access_token;
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
