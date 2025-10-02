import React, { createContext, useContext } from 'react';

interface AuthThemeColors {
  background: string;
  surface: string;
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  inputBackground: string;
  error?: string;
  success?: string;
}

interface AuthThemeContextType {
  colors: AuthThemeColors;
}

const AuthThemeContext = createContext<AuthThemeContextType | undefined>(undefined);

export const AuthThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colors: AuthThemeColors = {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    primary: '#3B82F6',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    inputBackground: '#F9FAFB',
    error: '#EF4444',
    success: '#10B981'
  };

  return (
    <AuthThemeContext.Provider value={{ colors }}>
      {children}
    </AuthThemeContext.Provider>
  );
};

export const useAuthTheme = () => {
  const context = useContext(AuthThemeContext);
  if (!context) {
    throw new Error('useAuthTheme must be used within AuthThemeProvider');
  }
  return context;
};

export const getAuthButtonStyle = (
  colors: AuthThemeColors,
  variant: 'primary' | 'secondary',
  state: 'default' | 'disabled' = 'default',
  customStyles?: any
) => {
  const baseButton = {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const baseText = {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: 'ReadexPro-Medium',
  };

  if (variant === 'primary') {
    return {
      button: {
        ...baseButton,
        backgroundColor: state === 'disabled' ? colors.border : colors.primary,
        ...customStyles,
      },
      text: {
        ...baseText,
        color: 'white',
      },
    };
  }

  return {
    button: {
      ...baseButton,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      ...customStyles,
    },
    text: {
      ...baseText,
      color: colors.text,
    },
  };
};
