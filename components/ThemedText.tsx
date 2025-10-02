import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedTextProps extends TextProps {
  type?: 'default' | 'title' | 'subtitle' | 'link';
  children: React.ReactNode;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  type = 'default',
  style,
  children,
  ...rest
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    default: {
      fontSize: 16,
      color: colors.text
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      color: colors.text
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: colors.text
    },
    link: {
      fontSize: 16,
      color: colors.primary,
      textDecorationLine: 'underline' as const
    }
  });

  return (
    <Text style={[styles[type], style]} {...rest}>
      {children}
    </Text>
  );
};

export default ThemedText;
