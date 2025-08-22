import axios from "axios";
import TokenStorage from "../utils/tokenStorage";

// Create a shared axios instance for all API calls
const apiClient = axios.create({
  baseURL: "https://localhost:7000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear token and redirect to login
      TokenStorage.clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
