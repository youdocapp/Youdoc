import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border
    },
    title: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text
    },
    arrow: {
      fontSize: 18,
      color: colors.textSecondary
    },
    content: {
      padding: 16,
      backgroundColor: colors.background,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: colors.border
    }
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.arrow}>{isOpen ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
};

export default Collapsible;
