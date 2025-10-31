import { createContext } from "react";

// Simple Theme Context used by ThemeProvider
const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  isLight: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export default ThemeContext;
