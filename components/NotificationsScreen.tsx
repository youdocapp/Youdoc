import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Pill, Info, RefreshCw } from 'lucide-react-native';
import BottomNav from './ui/BottomNav';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();
  
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.card,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    notificationCard: {
      backgroundColor: colors.background,
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
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.text,
      flex: 1,
    },
    notificationTime: {
      fontSize: 13,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    notificationMessage: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
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

export default NotificationsScreen;
