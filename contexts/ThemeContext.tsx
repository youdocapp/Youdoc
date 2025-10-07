import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryLight: string;
  success: string;
  warning: string;
  error: string;
  headerBackground: string;
  statusBarStyle: 'light' | 'dark' | 'auto';
}

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  card: '#F9FAFB',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#3B82F6',
  primaryLight: '#DBEAFE',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  headerBackground: '#FFFFFF',
  statusBarStyle: 'dark',
};

const darkColors: ThemeColors = {
  background: '#111827',
  card: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  primary: '#3B82F6',
  primaryLight: '#1E3A8A',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  headerBackground: '#1F2937',
  statusBarStyle: 'light',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = '@app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useRNColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored !== null) {
        setIsDark(stored === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = useCallback(async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [isDark]);

  const colors = useMemo(() => isDark ? darkColors : lightColors, [isDark]);

  const value = useMemo(() => ({ colors, isDark, toggleTheme }), [colors, isDark, toggleTheme]);

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
