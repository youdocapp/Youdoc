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
  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
      
      <View style={styles.navContent}>
        <TouchableOpacity style={styles.tab} onPress={onHome}>
          <Home 
            size={28} 
            color={activeTab === 'home' ? '#1F2937' : '#9CA3AF'}
            fill={activeTab === 'home' ? '#1F2937' : 'transparent'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, styles.notificationTab]} onPress={onNotifications}>
          <View style={styles.bellContainer}>
            <Bell 
              size={28} 
              color="#4F7FFF"
              fill="#4F7FFF"
            />
            <View style={styles.notificationBadge} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={onProfile}>
          <User 
            size={28} 
            color={activeTab === 'profile' ? '#1F2937' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  indicator: {
    height: 4,
    backgroundColor: '#000000',
    marginHorizontal: 120,
    marginTop: 8,
    borderRadius: 2
  },
  navContent: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 24
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
  bellContainer: {
    position: 'relative' as const
  },
  notificationBadge: {
    position: 'absolute' as const,
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444'
  }
});

export default BottomNav;
