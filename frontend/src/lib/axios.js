import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // Ignore errors reading localStorage (e.g., in private mode)
      console.warn("Could not access localStorage to retrieve token:", err);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const currentPath = window.location.pathname;
    
    // Jangan trigger unauthorized event jika:
    // 1. Error dari endpoint login/register (expected 401 untuk kredensial salah)
    // 2. Sudah berada di halaman login
    const isAuthEndpoint = requestUrl.includes("/auth/login") || 
                          requestUrl.includes("/auth/register");
    const isOnLoginPage = currentPath === "/login" || currentPath === "/";
    
    if (status === 401 && !isAuthEndpoint && !isOnLoginPage) {
      // Token expired atau invalid - logout user
      window.dispatchEvent(
        new CustomEvent("app:unauthorized", { 
          detail: { 
            source: "axios-interceptor",
            status: 401,
            url: requestUrl
          } 
        })
      );
    }
    
    // Handle network errors
    if (!error.response) {
      console.error("Network error or server is down:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
