import { useEffect, useState } from "react";
import ThemeContext from "./theme-utils";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setThemeState(prefersDark ? "dark" : "light");
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    const body = document.body;

    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");

    root.classList.add(theme);
    body.classList.add(theme);

    localStorage.setItem("theme", theme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#0f172a" : "#ffffff"
      );
    } else {
      
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = theme === "dark" ? "#0f172a" : "#ffffff";
      document.head.appendChild(meta);
    }
  }, [theme, isLoading]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    
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

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
