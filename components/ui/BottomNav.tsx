import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
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
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'home' && styles.activeTab]} 
          onPress={onHome}
        >
          <View style={[styles.iconContainer, activeTab === 'home' && styles.activeIconContainer]}>
            <Home 
              size={24} 
              color={activeTab === 'home' ? '#FFFFFF' : '#6B7280'}
              strokeWidth={2.5}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.centerButton} 
          onPress={onNotifications}
        >
          <View style={styles.centerButtonInner}>
            <Bell 
              size={24} 
              color="#FFFFFF"
              strokeWidth={2.5}
            />
            <View style={styles.notificationBadge} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]} 
          onPress={onProfile}
        >
          <View style={[styles.iconContainer, activeTab === 'profile' && styles.activeIconContainer]}>
            <User 
              size={24} 
              color={activeTab === 'profile' ? '#FFFFFF' : '#6B7280'}
              strokeWidth={2.5}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    backgroundColor: 'transparent'
  },
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-around' as const,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10
  },
  tab: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 20
  },
  activeTab: {
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'transparent'
  },
  activeIconContainer: {
    backgroundColor: '#4F7FFF',
    shadowColor: '#4F7FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  centerButton: {
    marginTop: -30,
    alignItems: 'center' as const,
    justifyContent: 'center' as const
  },
  centerButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F7FFF',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#4F7FFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF'
  },
  notificationBadge: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  }
});

export default BottomNav;
