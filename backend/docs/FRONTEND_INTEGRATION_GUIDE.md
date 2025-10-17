# React Native Frontend Integration Guide

## Quick Setup Checklist

### 1. Install Dependencies
```bash
npm install expo-notifications
```

### 2. Update Your Existing Components

#### NotificationsScreen.tsx
Replace mock data with real API calls:

```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Your auth context

const NotificationsScreen = ({ onBack, onHome, onNotifications, onProfile }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setNotifications(data.results);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Rest of your existing component code...
  // Replace NOTIFICATIONS.map with notifications.map
  // Add onPress to mark as read: onPress={() => markAsRead(notification.id)}
};
```

#### SettingsScreen.tsx
Connect notification toggles to backend:

```typescript
import { useAuth } from '@/contexts/AuthContext';

const SettingsScreen = ({ onBack, onProfile, onPrivacy, onHelp, onAbout, onSubscription, onConnectedDevices, onSignOut, onDeleteAccount }) => {
  const { token } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  const updatePreferences = async (preferences) => {
    try {
      await fetch('/api/notifications/preferences/update/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ preferences })
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const handleMedicationRemindersChange = async (value) => {
    setMedicationReminders(value);
    await updatePreferences([{
      notification_type: 'medication_reminder',
      push_enabled: value
    }]);
  };

  const handlePushNotificationsChange = async (value) => {
    setPushNotifications(value);
    // Update all notification types
    const allTypes = ['medication_reminder', 'health_tip', 'sync_complete', 'general'];
    await updatePreferences(
      allTypes.map(type => ({
        notification_type: type,
        push_enabled: value
      }))
    );
  };

  // Rest of your existing component code...
  // Update Switch onValueChange handlers to use the new functions
};
```

### 3. Add Push Notification Setup

Create a new file `lib/notifications.ts`:

```typescript
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export const setupPushNotifications = async () => {
  // Request permission
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status === 'granted') {
    // Get device token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Register with backend (you'll need to call this with user token)
    return token;
  }
  
  return null;
};

export const registerDeviceWithBackend = async (deviceToken: string, userToken: string) => {
  try {
    await fetch('/api/notifications/register-device/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        token: deviceToken,
        device_type: Platform.OS === 'ios' ? 'ios' : 'android'
      })
    });
  } catch (error) {
    console.error('Error registering device:', error);
  }
};
```

### 4. Initialize in Your App

In your main app file (e.g., `app/_layout.tsx`):

```typescript
import { useEffect } from 'react';
import { setupPushNotifications, registerDeviceWithBackend } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';

export default function AppLayout() {
  const { user, token } = useAuth();

  useEffect(() => {
    const initializeNotifications = async () => {
      if (user && token) {
        const deviceToken = await setupPushNotifications();
        if (deviceToken) {
          await registerDeviceWithBackend(deviceToken, token);
        }
      }
    };

    initializeNotifications();
  }, [user, token]);

  // Rest of your app code...
}
```

## That's It!

Your notification system is now connected. Here's what happens:

1. **User adds medication** → Backend automatically creates reminders
2. **New articles published** → Users get health tip notifications  
3. **Health data syncs** → Users get sync notifications
4. **User changes settings** → Preferences saved to backend
5. **User opens app** → Notifications fetched from backend
6. **User taps notification** → Marked as read in backend

The system works automatically once set up!
