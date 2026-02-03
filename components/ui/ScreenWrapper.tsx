import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar, Platform } from 'react-native';
import { SafeAreaView, EdgeInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  edges?: readonly ('top' | 'right' | 'bottom' | 'left')[];
  safeArea?: boolean;
  backgroundColor?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  edges = ['top', 'left', 'right'],
  safeArea = true,
  backgroundColor,
}) => {
  const { colors, isDark } = useTheme();
  
  const containerStyle = [
    styles.container,
    { backgroundColor: backgroundColor || colors.background },
    style,
  ];

  if (safeArea) {
    return (
      <SafeAreaView style={containerStyle} edges={edges}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundColor || colors.background}
        />
        {children}
      </SafeAreaView>
    );
  }

  return (
    <View style={containerStyle}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor || colors.background}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
