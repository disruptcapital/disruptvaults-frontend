import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { dark, light } from 'theme';
const ThemeContext = React.createContext({ isDarkMode: null, setIsDarkMode: () => null });

const ThemeContextProvider = ({ children }) => {
  const key = 'theme';
  const lightMode = 'lightMode';
  const darkMode = 'darkMode';

  let theme = light;

  if (localStorage) {
    try {
      theme = localStorage.getItem(key);
    } catch (e) {}
  }
  const [isDarkMode, setIsDarkMode] = useState(theme === darkMode);

  useEffect(() => {
    try {
      localStorage.setItem(key, isDarkMode ? darkMode : lightMode);
    } catch (e) {}
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <ThemeProvider theme={isDarkMode ? dark : light}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
