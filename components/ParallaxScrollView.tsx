import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ParallaxScrollViewProps {
  headerImage?: React.ReactNode;
  headerBackgroundColor?: string;
  children: React.ReactNode;
}

const ParallaxScrollView: React.FC<ParallaxScrollViewProps> = ({
  headerImage,
  headerBackgroundColor,
  children
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      height: 200,
      backgroundColor: headerBackgroundColor || colors.primary,
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    },
    content: {
      flex: 1,
      padding: 24
    }
  });

  return (
    <ScrollView style={styles.container}>
      {headerImage && <View style={styles.header}>{headerImage as React.ReactNode}</View>}
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
};

export default ParallaxScrollView;
