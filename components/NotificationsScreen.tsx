import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { ChevronLeft, Pill, Info, RefreshCw, CheckCircle2, Trash2 } from 'lucide-react-native';
import BottomNav from './ui/BottomNav';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Notification as ApiNotification } from '@/lib/api/notifications';

interface NotificationsScreenProps {
  onBack: () => void;
  onHome?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
}

// Mock data for when not authenticated or API fails
const MOCK_NOTIFICATIONS: ApiNotification[] = [
  {
    id: '1',
    type: 'medication',
    type_display: 'Medication Reminder',
    title: 'Medication Reminder',
    message: 'Time to take Aspirin (08:00)',
    is_read: false,
    status: 'delivered',
    status_display: 'Delivered',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    time_ago: 'Just now',
  },
  {
    id: '2',
    type: 'medication',
    type_display: 'Medication Reminder',
    title: 'Medication Reminder',
    message: 'Time to take Vitamin D (09:00)',
    is_read: false,
    status: 'delivered',
    status_display: 'Delivered',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    time_ago: '1h ago',
  },
  {
    id: '3',
    type: 'health-tip',
    type_display: 'Health Tip',
    title: 'New Health Tip',
    message: '5 Ways to Manage Stress Daily',
    is_read: true,
    status: 'delivered',
    status_display: 'Delivered',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    time_ago: '2h ago',
  },
  {
    id: '4',
    type: 'sync',
    type_display: 'Sync Notification',
    title: 'Sync Complete',
    message: 'Apple Watch data synced successfully',
    is_read: true,
    status: 'delivered',
    status_display: 'Delivered',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    time_ago: 'Yesterday',
  },
  {
    id: '5',
    type: 'general',
    type_display: 'General',
    title: 'Welcome to YouDoc!',
    message: 'Get started by adding your medications and health records',
    is_read: false,
    status: 'delivered',
    status_display: 'Delivered',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    time_ago: '2 days ago',
  },
];

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ 
  onBack,
  onHome,
  onNotifications,
  onProfile 
}) => {
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();
  const { 
    notifications, 
    isLoading, 
    error,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    refetch
  } = useNotifications();
  
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Use API notifications if authenticated, otherwise use mock data
  const displayNotifications = isAuthenticated ? notifications : MOCK_NOTIFICATIONS;
  const displayLoading = isAuthenticated && isLoading;
  const displayError = isAuthenticated && error;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Error refreshing notifications:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    if (!isAuthenticated) {
      Alert.alert('Info', 'Please log in to mark notifications as read');
      return;
    }
    const result = await markNotificationRead(id);
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    if (!isAuthenticated) {
      Alert.alert('Info', 'Please log in to mark all notifications as read');
      return;
    }
    const result = await markAllNotificationsRead();
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to mark all notifications as read');
    } else {
      Alert.alert('Success', 'All notifications marked as read');
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      Alert.alert('Info', 'Please log in to delete notifications');
      return;
    }
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteNotification(id);
            if (!result.success) {
              Alert.alert('Error', result.error || 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const formatTime = (notification: ApiNotification): string => {
    if (notification.time_ago) {
      return notification.time_ago;
    }
    if (notification.created_at) {
      const date = new Date(notification.created_at);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    }
    return 'Unknown';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return { icon: Pill, color: '#F59E0B', bg: '#E0E7FF' };
      case 'health-tip':
        return { icon: Info, color: '#10B981', bg: '#D1FAE5' };
      case 'sync':
        return { icon: RefreshCw, color: '#4F7FFF', bg: '#E0E7FF' };
      default:
        return { icon: Info, color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const renderIcon = (notification: ApiNotification) => {
    const { icon: Icon, color, bg } = getNotificationIcon(notification.type);
    
    return (
      <View style={[styles.notificationIcon, { backgroundColor: bg }]}>
        <Icon size={24} color={color} />
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
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
    errorText: {
      fontSize: 14,
      color: '#EF4444',
      textAlign: 'center',
      marginTop: 8,
    },
    notificationActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    unreadIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#4F7FFF',
      marginRight: 8,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    markAllReadButton: {
      padding: 4,
    },
    markAllReadText: {
      fontSize: 14,
      color: colors.primary || '#4F7FFF',
      fontWeight: '500',
    },
  });

  if (displayLoading && displayNotifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary || '#4F7FFF'} />
          <Text style={styles.emptyStateText}>Loading notifications...</Text>
        </View>
        <BottomNav
          activeTab="notifications"
          onHome={onHome}
          onNotifications={onNotifications}
          onProfile={onProfile}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {isAuthenticated && displayNotifications.some(n => !n.is_read) && (
            <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllReadButton}>
              <Text style={styles.markAllReadText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        <View style={{ width: 24 }} />
        </View>
      </View>

      {displayError && (
        <View style={{ padding: 16, backgroundColor: '#FEE2E2', marginHorizontal: 20, marginTop: 12, borderRadius: 8 }}>
          <Text style={styles.errorText}>
            {error?.message || 'Failed to load notifications. Using mock data.'}
          </Text>
        </View>
      )}

      {!isAuthenticated && (
        <View style={{ padding: 16, backgroundColor: '#FEF3C7', marginHorizontal: 20, marginTop: 12, borderRadius: 8 }}>
          <Text style={[styles.emptyStateText, { color: '#92400E' }]}>
            Showing mock data. Log in to see your real notifications.
          </Text>
        </View>
      )}

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingBottom: 120 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {displayNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Info size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No notifications yet</Text>
            <Text style={[styles.emptyStateText, { marginTop: 8, fontSize: 14 }]}>
              You'll see medication reminders, health tips, and sync updates here
            </Text>
          </View>
        ) : (
          displayNotifications.map((notification) => (
            <TouchableOpacity 
              key={notification.id} 
              style={[
                styles.notificationCard,
                !notification.is_read && { borderLeftWidth: 4, borderLeftColor: '#4F7FFF' }
              ]}
              onPress={() => {
                if (!notification.is_read && isAuthenticated) {
                  handleMarkRead(notification.id);
                }
                setExpandedId(expandedId === notification.id ? null : notification.id);
              }}
            >
              {renderIcon(notification)}
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {!notification.is_read && <View style={styles.unreadIndicator} />}
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                  </View>
                  <Text style={styles.notificationTime}>{formatTime(notification)}</Text>
                </View>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                {expandedId === notification.id && isAuthenticated && (
                  <View style={styles.notificationActions}>
                    {!notification.is_read && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleMarkRead(notification.id)}
                      >
                        <CheckCircle2 size={18} color={colors.primary || '#4F7FFF'} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDelete(notification.id)}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          </TouchableOpacity>
          ))
        )}
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
