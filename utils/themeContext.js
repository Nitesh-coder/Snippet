import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create theme context
const ThemeContext = createContext();

// Theme color options organized by category
const themeColors = {
  light: {
    // Base colors
    backgroundColor: '#f5f5f5',
    cardBackground: '#ffffff',
    textColor: '#333333',
    secondaryTextColor: '#888888',
    borderColor: '#e0e0e0',
    
    // UI elements
    headerBackground: '#f9f9f9',
    buttonBackground: '#ffffff',
    selectedItemBackground: '#e6f2ff',
    selectedItemColor: '#007AFF',
    accentColor: '#007AFF',
    highlightColor: '#e6f2ff',
    switchTrackColor: { false: '#767577', true: '#81b0ff' },
    switchThumbColor: '#f4f3f4',
    placeholderTextColor: '#999999',
    modalOverlayColor: 'rgba(0, 0, 0, 0.5)',
    destructiveColor: '#ff3b30',
    
    // Code editor specific
    lineNumberBackground: '#f0f0f0',
    lineNumberColor: '#888888',
    
    // Status bar
    statusBarStyle: 'dark-content',
    statusBarBackgroundColor: '#f5f5f5',

    // Misc
    shadowColor: '#000',
    iconColor: '#333333',
  },
  dark: {
    // Base colors
    backgroundColor: '#121212',
    cardBackground: '#1e1e1e',
    textColor: '#f0f0f0',
    secondaryTextColor: '#aaaaaa',
    borderColor: '#444444',
    
    // UI elements
    headerBackground: '#252525',
    buttonBackground: '#333333',
    selectedItemBackground: '#0d47a1',
    selectedItemColor: '#ffffff',
    accentColor: '#4d95ff',
    highlightColor: '#2c2c2c',
    switchTrackColor: { false: '#555555', true: '#81b0ff' },
    switchThumbColor: '#f1f1f1',
    placeholderTextColor: '#777777',
    modalOverlayColor: 'rgba(0, 0, 0, 0.7)',
    destructiveColor: '#ff453a',
    
    // Code editor specific
    lineNumberBackground: '#292929',
    lineNumberColor: '#aaaaaa',
    
    // Status bar
    statusBarStyle: 'light-content',
    statusBarBackgroundColor: '#121212',

    // Misc
    shadowColor: '#000',
    iconColor: '#f0f0f0',
  }
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Load theme preference from storage when component mounts
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const themePreference = await AsyncStorage.getItem('themePreference');
        if (themePreference !== null) {
          setIsDarkMode(themePreference === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [isDarkMode]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  // Get theme colors based on the current mode
  const getThemeColors = () => {
    return isDarkMode ? themeColors.dark : themeColors.light;
  };
  
  // Value to be provided by the context
  const contextValue = {
    isDarkMode,
    toggleDarkMode,
    getThemeColors,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 