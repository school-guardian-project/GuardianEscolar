import { useState, createContext, useContext } from 'react';
import { themes, defaultTheme } from '../constants/Colors';

// Contexto del tema
export const ThemeContext = createContext();

// Hook para usar el tema en cualquier componente
export function useTheme() {
  return useContext(ThemeContext);
}

// Proveedor del tema
export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(defaultTheme);
  const theme = themes[themeName];

  const changeTheme = (name) => {
    if (themes[name]) setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}