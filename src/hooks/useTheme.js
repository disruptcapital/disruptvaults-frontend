import { useContext } from 'react';
import { ThemeContext as StyledThemeContext } from 'styled-components';
import { ThemeContext } from 'contexts/ThemeContext';

const useTheme = () => {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const theme = useContext(StyledThemeContext);
  return { isDarkMode, setIsDarkMode, theme };
};

export default useTheme;
