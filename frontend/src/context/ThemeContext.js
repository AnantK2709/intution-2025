// frontend/src/context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Define our themes
const lightTheme = {
  name: 'light',
  colors: {
    primary: '#00c2ff',
    secondary: '#6e00ff',
    accent: '#ff0099',
    background: '#f8f9fc',
    surface: '#ffffff',
    text: '#1a1a2e',
    textSecondary: '#4a4a68',
    border: 'rgba(0, 0, 0, 0.08)',
    shadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    gradient: 'linear-gradient(135deg, #00c2ff 0%, #6e00ff 100%)',
    glass: 'rgba(255, 255, 255, 0.7)',
    glassBlur: 'blur(10px)',
    glassStroke: 'rgba(255, 255, 255, 0.5)',
  },
  transition: '0.3s ease-out',
};

const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#00c2ff',
    secondary: '#6e00ff',
    accent: '#ff0099',
    background: '#0f1021',
    surface: '#1a1b36',
    text: '#ffffff',
    textSecondary: '#a0a0c8',
    border: 'rgba(255, 255, 255, 0.08)',
    shadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
    gradient: 'linear-gradient(135deg, #00c2ff 0%, #6e00ff 100%)',
    glass: 'rgba(26, 27, 54, 0.7)',
    glassBlur: 'blur(10px)',
    glassStroke: 'rgba(255, 255, 255, 0.1)',
  },
  transition: '0.3s ease-out',
};

export const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Check for user's preferred color scheme
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark' ? darkTheme : lightTheme;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? darkTheme : lightTheme;
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Update local storage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme.name);
    
    // Update document attributes for theme
    document.documentElement.setAttribute('data-theme', theme.name);
    
    // Apply background color transition to body
    document.body.style.transition = 'background-color 0.5s ease';
    document.body.style.backgroundColor = theme.colors.background;
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
        setTheme(mediaQuery.matches ? darkTheme : lightTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme.name === 'light' ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;