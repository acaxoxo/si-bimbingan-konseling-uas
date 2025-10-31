import { useEffect, useState } from "react";
import ThemeContext from "./theme-utils";

/**
 * Theme Provider Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * 
 * Features:
 * - Auto-detect system theme preference
 * - Save theme to localStorage
 * - Toggle between light/dark
 * - Apply theme to document root
 * 
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme on mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Auto-detect system theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setThemeState(prefersDark ? "dark" : "light");
    }
    
    setIsLoading(false);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    const body = document.body;
    
    // Remove old theme classes from both html and body
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");
    
    // Add new theme class to both html and body for maximum compatibility
    root.classList.add(theme);
    body.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#0f172a" : "#ffffff"
      );
    } else {
      // Create meta tag if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = theme === "dark" ? "#0f172a" : "#ffffff";
      document.head.appendChild(meta);
    }
  }, [theme, isLoading]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };

  // Prevent flash of wrong theme on initial load
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
