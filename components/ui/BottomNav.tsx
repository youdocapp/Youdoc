import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface BottomNavProps {
  activeTab?: string;
  onHome?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({
  activeTab = 'home',
  onHome,
  onNotifications,
  onProfile
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row' as const,
      justifyContent: 'space-around' as const,
      alignItems: 'center' as const,
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border
    },
    tab: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: 8,
      paddingHorizontal: 16
    },
    tabIcon: {
      fontSize: 24,
      marginBottom: 4
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '500' as const
    },
    activeTab: {
      color: colors.primary
    },
    inactiveTab: {
      color: colors.textSecondary
    }
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={onHome}>
        <Text style={[styles.tabIcon, activeTab === 'home' ? styles.activeTab : styles.inactiveTab]}>
          🏠
        </Text>
        <Text style={[styles.tabLabel, activeTab === 'home' ? styles.activeTab : styles.inactiveTab]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={onNotifications}>
        <Text style={[styles.tabIcon, activeTab === 'notifications' ? styles.activeTab : styles.inactiveTab]}>
          🔔
        </Text>
        <Text style={[styles.tabLabel, activeTab === 'notifications' ? styles.activeTab : styles.inactiveTab]}>
          Notifications
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={onProfile}>
        <Text style={[styles.tabIcon, activeTab === 'profile' ? styles.activeTab : styles.inactiveTab]}>
          👤
        </Text>
        <Text style={[styles.tabLabel, activeTab === 'profile' ? styles.activeTab : styles.inactiveTab]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNav;
