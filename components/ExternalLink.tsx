import React from 'react';
import { Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  style?: any;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children, style }) => {
  const { colors } = useTheme();

  const handlePress = async () => {
    const supported = await Linking.canOpenURL(href);
    if (supported) {
      await Linking.openURL(href);
    }
  };

  const styles = StyleSheet.create({
    link: {
      color: colors.primary,
      textDecorationLine: 'underline' as const
    }
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.link, style]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default ExternalLink;
