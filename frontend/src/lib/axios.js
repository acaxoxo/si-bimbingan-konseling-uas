import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token from localStorage on each request
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore errors reading localStorage
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Emit an event on 401 so the app can react (logout/redirect)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    // If 401, emit unauthorized event and reject
    if (status === 401) {
      window.dispatchEvent(
        new CustomEvent("app:unauthorized", { detail: { source: "axios-401" } })
      );
    }
    return Promise.reject(error);
  }
);

export default api;
