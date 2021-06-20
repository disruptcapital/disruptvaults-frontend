import { useEffect, useState } from 'react';

const useDarkMode = () => {
  const key = 'theme';
  const light = 'light';
  const dark = 'dark';
  let theme = light;
  if (localStorage) {
    try {
      theme = localStorage.getItem(key);
    } catch (e) {}
  }
  const [darkMode, setDarkMode] = useState(theme === dark);

  useEffect(() => {
    try {
      localStorage.setItem(key, darkMode ? dark : light);
    } catch (e) {}
  }, [darkMode]);

  return { darkMode, setDarkMode };
};

export default useDarkMode;
