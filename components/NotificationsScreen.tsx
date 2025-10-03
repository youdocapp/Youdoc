import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Pill, Info, RefreshCw } from 'lucide-react-native';
import BottomNav from './ui/BottomNav';

interface NotificationsScreenProps {
  onBack: () => void;
  onHome?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
}

interface Notification {
  id: string;
  type: 'medication' | 'health-tip' | 'sync';
  title: string;
  message: string;
  time: string;
  icon: 'pill' | 'info' | 'refresh';
  iconBg: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'medication',
    title: 'Medication Reminder',
    message: 'Time to take Aspirin (08:00)',
    time: 'Just now',
    icon: 'pill',
    iconBg: '#E0E7FF',
  },
  {
    id: '2',
    type: 'medication',
    title: 'Medication Reminder',
    message: 'Time to take Vitamin D (09:00)',
    time: 'Just now',
    icon: 'pill',
    iconBg: '#E0E7FF',
  },
  {
    id: '3',
    type: 'health-tip',
    title: 'New Health Tip',
    message: '5 Ways to Manage Stress Daily',
    time: '1h ago',
    icon: 'info',
    iconBg: '#D1FAE5',
  },
  {
    id: '4',
    type: 'sync',
    title: 'Sync Complete',
    message: 'Apple Watch data synced successfu...',
    time: 'Yesterday',
    icon: 'refresh',
    iconBg: '#E0E7FF',
  },
];

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ 
  onBack,
  onHome,
  onNotifications,
  onProfile 
}) => {
  const renderIcon = (icon: string, iconBg: string) => {
    const iconColor = icon === 'info' ? '#10B981' : '#4F7FFF';
    
    return (
      <View style={[styles.notificationIcon, { backgroundColor: iconBg }]}>
        {icon === 'pill' && <Pill size={24} color="#F59E0B" />}
        {icon === 'info' && <Info size={24} color={iconColor} />}
        {icon === 'refresh' && <RefreshCw size={24} color={iconColor} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((notification) => (
          <TouchableOpacity key={notification.id} style={styles.notificationCard}>
            {renderIcon(notification.icon, notification.iconBg)}
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav
        activeTab="notifications"
        onHome={onHome}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  notificationTime: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default NotificationsScreen;
