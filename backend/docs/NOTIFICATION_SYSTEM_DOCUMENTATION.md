# YouDoc Notification System - Complete Guide

## What This System Does

The notification system sends **3 types of notifications** to users:
1. **Medication Reminders** - "Time to take your Aspirin at 8:00 AM"
2. **Health Tips** (Articles) - "New article: 5 Ways to Manage Stress"
3. **Sync Notifications** - "Apple Watch data synced successfully"

## How It Works (Simple Explanation)

### Backend (Django) - What We Built
The backend handles **ALL the smart stuff**:

1. **Stores notifications** in database
2. **Schedules when to send** notifications
3. **Sends push notifications** to phones
4. **Tracks what users want** (preferences)
5. **Connects to other apps** (medication, articles, health tracking)
6. **Manages device tokens** for push notifications

### Frontend (React Native) - What You Need to Add
The frontend just:
1. **Shows notifications** to users
2. **Registers device token** for push notifications
3. **Marks notifications as read**
4. **Updates user preferences**

## Backend Architecture (Simple)

### 1. Database Tables (Models)
```
notifications_notification
├── user_id (which user)
├── type (medication_reminder, health_tip, etc.)
├── title ("Time to take Aspirin")
├── message ("Take your 100mg Aspirin now")
├── is_read (true/false)
├── scheduled_for (when to send)
└── metadata (extra data like medication_id)

notifications_notificationpreference
├── user_id (which user)
├── notification_type (medication, health-tip, sync)
├── push_enabled (true/false)
└── email_enabled (true/false)

notifications_devicetoken
├── user_id (which user)
├── token (phone's push notification token)
├── device_type (ios/android/web)
└── is_active (true/false)
```

### 2. Services (Business Logic)
- **NotificationService**: Creates and sends notifications
- **PushNotificationService**: Handles device push notifications
- **MedicationReminderService**: Manages medication reminders
- **ArticleNotificationService**: Sends article notifications
- **SyncNotificationService**: Sends sync notifications

### 3. API Endpoints
```
GET    /api/notifications/              # Get user's notifications
POST   /api/notifications/{id}/read/    # Mark as read
POST   /api/notifications/register-device/  # Register device token for push
GET    /api/notifications/preferences/  # Get user preferences
PUT    /api/notifications/preferences/update/  # Update preferences
```

### 4. Automatic Triggers (Signals)
When something happens in other apps, notifications are sent automatically:
- **New medication added** → Schedule reminders
- **New article published** → Send to all users who want health tips
- **Health data synced** → Send sync complete notification

## React Native Integration

### 1. Install Required Packages
```bash
npm install expo-notifications
```

### 2. Request Permission & Register Device
```typescript
// In your app initialization
import * as Notifications from 'expo-notifications';

const registerForPushNotifications = async () => {
  // Request permission
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status === 'granted') {
    // Get device token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Send token to backend
    await fetch('/api/notifications/register-device/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        token: token,
        device_type: Platform.OS === 'ios' ? 'ios' : 'android'
      })
    });
  }
};
```

### 3. Handle Incoming Notifications
```typescript
// Listen for notifications
useEffect(() => {
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    // Show notification in app
    console.log('Received notification:', notification);
  });

  return () => subscription.remove();
}, []);
```

### 4. Fetch Notifications from Backend
```typescript
const fetchNotifications = async () => {
  const response = await fetch('/api/notifications/', {
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
  
  const data = await response.json();
  setNotifications(data.results);
};

const markAsRead = async (notificationId: string) => {
  await fetch(`/api/notifications/${notificationId}/read/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
};
```

### 5. Update Notification Preferences
```typescript
const updatePreferences = async (preferences: any) => {
  await fetch('/api/notifications/preferences/update/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({ preferences })
  });
};
```

## How Notifications Are Triggered

### 1. Medication Reminders
**When**: User adds medication with reminder times
**How**: Django signal automatically creates scheduled notifications
**Example**: User adds "Aspirin 8:00 AM" → System schedules daily 8:00 AM notifications

### 2. Health Tips (Articles)
**When**: Admin publishes new article
**How**: Django signal sends to all users who want health tips
**Example**: New article "Stress Management" → All users with health-tip preferences get notified

### 3. Sync Notifications
**When**: Health data sync completes
**How**: Django signal from health tracking app
**Example**: Apple Watch syncs → User gets "Apple Watch data synced successfully..."

## API Examples

### Get User Notifications
```bash
GET /api/notifications/
Authorization: Bearer <user_token>

Response:
{
  "count": 5,
  "results": [
    {
      "id": "uuid-123",
      "type": "medication",
      "title": "Medication Reminder",
      "message": "Time to take Aspirin (8:00 AM)",
      "is_read": false,
      "created_at": "2024-01-15T08:00:00Z"
    }
  ]
}
```

### Register Device for Push Notifications
```bash
POST /api/notifications/register-device/
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "token": "ExponentPushToken[abc123]",
  "device_type": "ios"
}
```

### Update Notification Preferences
```bash
PUT /api/notifications/preferences/update/
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "preferences": [
    {
      "notification_type": "medication",
      "push_enabled": true,
      "email_enabled": false
    },
    {
      "notification_type": "health-tip",
      "push_enabled": true,
      "email_enabled": false
    },
    {
      "notification_type": "sync",
      "push_enabled": true,
      "email_enabled": false
    }
  ]
}
```

## Frontend Components You Need to Update

### 1. NotificationsScreen.tsx
Replace the mock data with real API calls:
```typescript
// Replace this mock data:
const NOTIFICATIONS: Notification[] = [...]

// With this:
const [notifications, setNotifications] = useState([]);

useEffect(() => {
  fetchNotifications();
}, []);

const fetchNotifications = async () => {
  const response = await fetch('/api/notifications/');
  const data = await response.json();
  setNotifications(data.results);
};
```

### 2. SettingsScreen.tsx
Connect the toggles to the backend:
```typescript
const updateMedicationReminders = async (enabled: boolean) => {
  await updatePreferences([{
    notification_type: 'medication',
    push_enabled: enabled
  }]);
};
```

### 3. AddMedicationScreen.tsx
When user adds medication, the backend automatically creates reminders (no frontend changes needed).

## Testing the System

### 1. Test Endpoints (for development)
```bash
# Send test medication reminder
POST /api/notifications/test/medication-reminder/
Authorization: Bearer <user_token>

# Send test health tip
POST /api/notifications/test/health-tip/
Authorization: Bearer <user_token>

# Send test sync notification
POST /api/notifications/test/sync-notification/
Authorization: Bearer <user_token>
```

### 2. Django Admin
- Go to `/admin/`
- Check "Notifications" section
- View all notifications, preferences, device tokens

## What Happens When User Does Something

### User Adds Medication
1. User fills out medication form in React Native
2. Frontend sends data to `/api/medications/`
3. Backend creates medication record
4. Django signal triggers automatically
5. System creates scheduled reminder notifications
6. At reminder time, push notification sent to user's phone

### User Reads Notification
1. User taps notification in React Native app
2. Frontend calls `/api/notifications/{id}/read/`
3. Backend marks notification as read
4. Frontend updates UI to show as read

### User Changes Preferences
1. User toggles setting in React Native
2. Frontend calls `/api/notifications/preferences/update/`
3. Backend updates user preferences
4. Future notifications respect new preferences

## Summary

**Backend does**: Smart scheduling, sending, storing, preferences, device token management
**Frontend does**: Display, user interaction, device token registration

The system is **fully automatic** - once set up, notifications work without manual intervention. Users get medication reminders, health tips, and sync notifications automatically based on their preferences and app usage.

### Key Features:
- ✅ **3 notification types**: medication, health-tip (articles), sync
- ✅ **Push notifications** via device tokens
- ✅ **Email notifications** (optional)
- ✅ **User preferences** for each notification type
- ✅ **Automatic triggers** from existing apps
- ✅ **Complete notification history** preserved
- ✅ **No SMS** (removed as not needed for health app)