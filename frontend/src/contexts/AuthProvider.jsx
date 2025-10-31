import { useState, useEffect, useCallback } from "react";
import api from "../lib/axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token) => {
    try {
      if (!token || typeof token !== "string") {
        console.error("Token tidak valid: token kosong atau bukan string", token);
        return null;
      }
      const parts = token.split(".");
      if (parts.length < 3 || !parts[1]) {
        console.error("Token tidak valid: format JWT tidak benar", token);
        return null;
      }
      return JSON.parse(atob(parts[1]));
    } catch (err) {
      console.error("Token tidak valid:", err);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        // If token has exp claim, check expiry
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && typeof decoded.exp === "number" && decoded.exp < now) {
          // token expired
          localStorage.removeItem("token");
        } else {
          setUser({
            id: decoded.id,
            role: decoded.role,
            name: decoded.name,
            email: decoded.email,
          });
        }
      }
    }
    setLoading(false);
  }, []);

  // Listen for global unauthorized events (emitted by axios interceptor)
  useEffect(() => {
    const navigate = () => {
      try {
        // attempt to use window.location to ensure navigation even outside React lifecycle
        localStorage.removeItem("token");
        window.location.pathname = "/login";
      } catch {
        // ignore
      }
    };

    const handler = () => navigate();
    window.addEventListener("app:unauthorized", handler);
    return () => window.removeEventListener("app:unauthorized", handler);
  }, []);

  const login = useCallback(async (email, password, role = "admin") => {
    try {
      const res = await api.post("/auth/login", { email, password, role });
      // Accept common token fields from various backends
      const token = res?.data?.token ?? res?.data?.accessToken ?? null;

      if (!token) {
        console.error("Login response tidak berisi token:", res?.data);
        setError("Login gagal: token tidak ditemukan pada respon server");
        return null;
      }

      localStorage.setItem("token", token);
      const decoded = decodeToken(token);

      if (!decoded) {
        setError("Login gagal: token tidak valid");
        return null;
      }

      setUser({
        id: decoded.id,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
      });
      setError(null);
      return decoded;
    } catch (err) {
      // Detailed logging to help debug 4xx/5xx responses from the backend
      console.error("Login gagal:", err);
      console.error("Login response data:", err.response?.data);
      console.error("Login request payload:", { email, password });

      // Prefer server-provided message when available
      const serverMessage =
        err.response?.data?.message || err.response?.data?.error || null;
      setError(serverMessage || "Email atau password salah");
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, error, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
