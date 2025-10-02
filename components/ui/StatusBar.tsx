import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface StatusBarProps {
  time?: string;
  battery?: number;
  signal?: number;
}

const StatusBar: React.FC<StatusBarProps> = ({
  time = '9:41',
  battery = 100,
  signal = 4
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 8
    },
    time: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text
    },
    rightSection: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8
    },
    icon: {
      fontSize: 14,
      color: colors.text
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.rightSection}>
        <Text style={styles.icon}>📶</Text>
        <Text style={styles.icon}>🔋</Text>
      </View>
    </View>
  );
};

export default StatusBar;
