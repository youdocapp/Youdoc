import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Bell, User } from 'lucide-react-native';
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
        <Home 
          size={28} 
          color={activeTab === 'home' ? colors.primary : colors.textSecondary}
          fill={activeTab === 'home' ? colors.primary : 'transparent'}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={onNotifications}>
        <Bell 
          size={28} 
          color={activeTab === 'notifications' ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={onProfile}>
        <User 
          size={28} 
          color={activeTab === 'profile' ? colors.primary : colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNav;
