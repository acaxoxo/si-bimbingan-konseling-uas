import { createContext } from "react";

const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  isLight: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export default ThemeContext;
