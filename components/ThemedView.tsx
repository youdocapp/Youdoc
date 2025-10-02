import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedViewProps extends ViewProps {
  children: React.ReactNode;
}

const ThemedView: React.FC<ThemedViewProps> = ({ style, children, ...rest }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background
    }
  });

  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
};

export default ThemedView;
