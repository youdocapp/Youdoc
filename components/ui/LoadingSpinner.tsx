import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'large',
  fullScreen = false,
}) => {
  const { colors } = useTheme();

  const containerStyle = fullScreen
    ? [styles.fullScreen, { backgroundColor: colors.background }]
    : styles.inline;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={colors.primary || '#4F7FFF'} />
      {message && (
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  inline: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  message: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

