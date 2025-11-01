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
        
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && typeof decoded.exp === "number" && decoded.exp < now) {
          
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

  useEffect(() => {
    const navigate = () => {
      try {
        
        localStorage.removeItem("token");
        window.location.pathname = "/login";
      } catch { /* empty */ }
    };

    const handler = () => navigate();
    window.addEventListener("app:unauthorized", handler);
    return () => window.removeEventListener("app:unauthorized", handler);
  }, []);

  const login = useCallback(async (email, password, role = "admin") => {
    try {
      const res = await api.post("/auth/login", { email, password, role });
      
      const token = res?.data?.token ?? res?.data?.accessToken ?? null;

      if (!token) {
        console.error("Login response tidak berisi token:", res?.data);
        const errorMsg = "Login gagal: token tidak ditemukan pada respon server";
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      localStorage.setItem("token", token);
      const decoded = decodeToken(token);

      if (!decoded) {
        const errorMsg = "Login gagal: token tidak valid";
        setError(errorMsg);
        throw new Error(errorMsg);
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
      console.error("Login gagal:", err);
      console.error("Login response data:", err.response?.data);
      console.error("Login request payload:", { email, password });

      const serverMessage =
        err.response?.data?.message || err.response?.data?.error || null;
      const errorMsg = serverMessage || err.message || "Email atau password salah";
      setError(errorMsg);
      
      // Lempar error agar bisa ditangkap di komponen Login
      throw err;
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
