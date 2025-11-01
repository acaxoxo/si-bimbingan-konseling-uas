import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // Ignore errors reading localStorage (e.g., in private mode) and log for debugging
      console.warn("Could not access localStorage to retrieve token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    
    // Jangan trigger unauthorized event jika error dari endpoint login
    // Karena login dengan kredensial salah akan return 401, tapi itu bukan unauthorized session
    if (status === 401 && !requestUrl.includes("/auth/login")) {
      window.dispatchEvent(
        new CustomEvent("app:unauthorized", { detail: { source: "axios-401" } })
      );
    }
    return Promise.reject(error);
  }
);

export default api;
