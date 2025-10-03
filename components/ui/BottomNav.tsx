import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Bell, User } from 'lucide-react-native';

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
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row' as const,
      justifyContent: 'space-around' as const,
      alignItems: 'center' as const,
      paddingVertical: 16,
      paddingHorizontal: 24,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6'
    },
    tab: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: 8,
      paddingHorizontal: 16
    },
    notificationTab: {
      position: 'relative' as const
    },
    notificationBadge: {
      position: 'absolute' as const,
      top: 4,
      right: 12,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#EF4444'
    },
    bellIcon: {
      position: 'relative' as const
    },
    bellBody: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#4F7FFF',
      position: 'relative' as const
    },
    bellHandle: {
      position: 'absolute' as const,
      top: -4,
      left: 8,
      width: 8,
      height: 4,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      backgroundColor: '#4F7FFF'
    },
    bellClapper: {
      position: 'absolute' as const,
      bottom: -3,
      left: 10,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#4F7FFF'
    }
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={onHome}>
        <Home 
          size={28} 
          color={activeTab === 'home' ? '#1F2937' : '#9CA3AF'}
          fill={activeTab === 'home' ? '#1F2937' : 'transparent'}
        />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tab, styles.notificationTab]} onPress={onNotifications}>
        <Bell 
          size={28} 
          color={activeTab === 'notifications' ? '#4F7FFF' : '#9CA3AF'}
          fill={activeTab === 'notifications' ? '#4F7FFF' : 'transparent'}
        />
        {activeTab === 'notifications' && <View style={styles.notificationBadge} />}
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={onProfile}>
        <User 
          size={28} 
          color={activeTab === 'profile' ? '#1F2937' : '#9CA3AF'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNav;
