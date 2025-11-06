# Notifications API Documentation

## Overview
The Notifications app provides a comprehensive notification system for the Youdoc health platform. It supports multiple notification types including medication reminders, health tips, sync notifications, and general notifications. The system includes push notifications, email notifications, SMS notifications, and user preference management.

## Base URL
```
/api/notifications/
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Models

### Notification
Core notification model for storing all user notifications.

**Fields:**
- `id` (UUID): Unique identifier
- `user` (ForeignKey): User who will receive this notification
- `type` (CharField): Type of notification (medication, health-tip, sync, general)
- `title` (CharField): Notification title
- `message` (TextField): Notification message content
- `is_read` (BooleanField): Whether the user has read this notification
- `status` (CharField): Delivery status (pending, sent, delivered, failed)
- `scheduled_for` (DateTimeField): When the notification should be sent (null for immediate)
- `sent_at` (DateTimeField): When the notification was actually sent
- `metadata` (JSONField): Additional data related to the notification
- `created_at` (DateTimeField): When the notification was created
- `updated_at` (DateTimeField): When the notification was last updated

### NotificationPreference
User notification preferences for different notification types.

**Fields:**
- `id` (UUID): Unique identifier
- `user` (ForeignKey): User these preferences belong to
- `notification_type` (CharField): Type of notification this preference applies to
- `push_enabled` (BooleanField): Whether push notifications are enabled
- `email_enabled` (BooleanField): Whether email notifications are enabled
- `sms_enabled` (BooleanField): Whether SMS notifications are enabled
- `created_at` (DateTimeField): When the preference was created
- `updated_at` (DateTimeField): When the preference was last updated

### DeviceToken
Store device tokens for push notifications.

**Fields:**
- `id` (UUID): Unique identifier
- `user` (ForeignKey): User this device belongs to
- `token` (CharField): Device token for push notifications
- `device_type` (CharField): Type of device (ios, android, web)
- `is_active` (BooleanField): Whether this device token is active
- `last_used` (DateTimeField): When this token was last used
- `created_at` (DateTimeField): When the token was registered

## API Endpoints

### 1. List Notifications
**GET** `/api/notifications/`

Get a paginated list of user's notifications with filtering options.

**Query Parameters:**
- `is_read` (boolean): Filter by read status
- `type` (string): Filter by notification type
- `date_from` (date): Filter notifications from this date
- `date_to` (date): Filter notifications to this date
- `page` (integer): Page number for pagination
- `page_size` (integer): Number of notifications per page (max 100)

**Response:**
```json
{
  "count": 25,
  "next": "http://api.example.com/notifications/?page=2",
  "previous": null,
  "results": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "type": "medication",
      "type_display": "Medication Reminder",
      "title": "Time to take your medication",
      "message": "Don't forget to take your morning medication",
      "is_read": false,
      "status": "delivered",
      "status_display": "Delivered",
      "scheduled_for": "2024-01-15T08:00:00Z",
      "sent_at": "2024-01-15T08:00:05Z",
      "metadata": {
        "medication_id": "456e7890-e89b-12d3-a456-426614174001",
        "medication_name": "Aspirin"
      },
      "created_at": "2024-01-15T07:55:00Z",
      "updated_at": "2024-01-15T08:00:05Z",
      "time_ago": "5 minutes ago"
    }
  ]
}
```

### 2. Create Notification
**POST** `/api/notifications/create/`

Create a new notification (admin/system use).

**Request Body:**
```json
{
  "type": "medication",
  "title": "Medication Reminder",
  "message": "Time to take your medication",
  "scheduled_for": "2024-01-15T08:00:00Z",
  "metadata": {
    "medication_id": "456e7890-e89b-12d3-a456-426614174001"
  }
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "medication",
  "type_display": "Medication Reminder",
  "title": "Medication Reminder",
  "message": "Time to take your medication",
  "is_read": false,
  "status": "pending",
  "status_display": "Pending",
  "scheduled_for": "2024-01-15T08:00:00Z",
  "sent_at": null,
  "metadata": {
    "medication_id": "456e7890-e89b-12d3-a456-426614174001"
  },
  "created_at": "2024-01-15T07:55:00Z",
  "updated_at": "2024-01-15T07:55:00Z",
  "time_ago": "Just now"
}
```

### 3. Get Notification Details
**GET** `/api/notifications/{id}/`

Get details of a specific notification.

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "medication",
  "type_display": "Medication Reminder",
  "title": "Time to take your medication",
  "message": "Don't forget to take your morning medication",
  "is_read": false,
  "status": "delivered",
  "status_display": "Delivered",
  "scheduled_for": "2024-01-15T08:00:00Z",
  "sent_at": "2024-01-15T08:00:05Z",
  "metadata": {
    "medication_id": "456e7890-e89b-12d3-a456-426614174001",
    "medication_name": "Aspirin"
  },
  "created_at": "2024-01-15T07:55:00Z",
  "updated_at": "2024-01-15T08:00:05Z",
  "time_ago": "5 minutes ago"
}
```

### 4. Update Notification
**PUT/PATCH** `/api/notifications/{id}/`

Update a notification (mainly for marking as read).

**Request Body:**
```json
{
  "is_read": true
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "medication",
  "type_display": "Medication Reminder",
  "title": "Time to take your medication",
  "message": "Don't forget to take your morning medication",
  "is_read": true,
  "status": "delivered",
  "status_display": "Delivered",
  "scheduled_for": "2024-01-15T08:00:00Z",
  "sent_at": "2024-01-15T08:00:05Z",
  "metadata": {
    "medication_id": "456e7890-e89b-12d3-a456-426614174001",
    "medication_name": "Aspirin"
  },
  "created_at": "2024-01-15T07:55:00Z",
  "updated_at": "2024-01-15T08:00:05Z",
  "time_ago": "5 minutes ago"
}
```

### 5. Delete Notification
**DELETE** `/api/notifications/{id}/`

Delete a specific notification.

**Response:**
```json
{
  "message": "Notification deleted successfully"
}
```

### 6. Get Notification Statistics
**GET** `/api/notifications/stats/`

Get notification statistics for the user.

**Response:**
```json
{
  "total_notifications": 25,
  "unread_notifications": 5,
  "notifications_by_type": {
    "medication": 10,
    "health-tip": 8,
    "sync": 5,
    "general": 2
  },
  "recent_notifications": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "type": "medication",
      "type_display": "Medication Reminder",
      "title": "Time to take your medication",
      "message": "Don't forget to take your morning medication",
      "is_read": false,
      "status": "delivered",
      "status_display": "Delivered",
      "scheduled_for": "2024-01-15T08:00:00Z",
      "sent_at": "2024-01-15T08:00:05Z",
      "metadata": {
        "medication_id": "456e7890-e89b-12d3-a456-426614174001"
      },
      "created_at": "2024-01-15T07:55:00Z",
      "updated_at": "2024-01-15T08:00:05Z",
      "time_ago": "5 minutes ago"
    }
  ]
}
```

### 7. Mark Notification as Read
**POST** `/api/notifications/{notification_id}/read/`

Mark a specific notification as read.

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

### 8. Mark All Notifications as Read
**POST** `/api/notifications/mark-all-read/`

Mark all notifications as read for the user.

**Response:**
```json
{
  "message": "Marked 5 notifications as read"
}
```

### 9. Bulk Notification Actions
**POST** `/api/notifications/bulk-action/`

Perform bulk actions on notifications.

**Request Body:**
```json
{
  "notification_ids": [
    "123e4567-e89b-12d3-a456-426614174000",
    "456e7890-e89b-12d3-a456-426614174001"
  ],
  "action": "mark_read"
}
```

**Available Actions:**
- `mark_read`: Mark selected notifications as read
- `mark_unread`: Mark selected notifications as unread
- `delete`: Delete selected notifications

**Response:**
```json
{
  "message": "Marked 2 notifications as read"
}
```

### 10. List Notification Preferences
**GET** `/api/notifications/preferences/`

Get user's notification preferences.

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "notification_type": "medication",
    "notification_type_display": "Medication Reminder",
    "push_enabled": true,
    "email_enabled": false,
    "sms_enabled": false,
    "created_at": "2024-01-15T07:55:00Z",
    "updated_at": "2024-01-15T07:55:00Z"
  },
  {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "notification_type": "health-tip",
    "notification_type_display": "Health Tip",
    "push_enabled": true,
    "email_enabled": true,
    "sms_enabled": false,
    "created_at": "2024-01-15T07:55:00Z",
    "updated_at": "2024-01-15T07:55:00Z"
  }
]
```

### 11. Create Notification Preference
**POST** `/api/notifications/preferences/`

Create a new notification preference.

**Request Body:**
```json
{
  "notification_type": "medication",
  "push_enabled": true,
  "email_enabled": false,
  "sms_enabled": false
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "notification_type": "medication",
  "notification_type_display": "Medication Reminder",
  "push_enabled": true,
  "email_enabled": false,
  "sms_enabled": false,
  "created_at": "2024-01-15T07:55:00Z",
  "updated_at": "2024-01-15T07:55:00Z"
}
```

### 12. Update Notification Preferences (Bulk)
**PUT** `/api/notifications/preferences/update/`

Bulk update notification preferences.

**Request Body:**
```json
{
  "preferences": [
    {
      "notification_type": "medication",
      "push_enabled": true,
      "email_enabled": false,
      "sms_enabled": false
    },
    {
      "notification_type": "health-tip",
      "push_enabled": true,
      "email_enabled": true,
      "sms_enabled": false
    }
  ]
}
```

**Response:**
```json
{
  "message": "Updated 2 notification preferences"
}
```

### 13. Get Notification Preference Details
**GET** `/api/notifications/preferences/{id}/`

Get details of a specific notification preference.

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "notification_type": "medication",
  "notification_type_display": "Medication Reminder",
  "push_enabled": true,
  "email_enabled": false,
  "sms_enabled": false,
  "created_at": "2024-01-15T07:55:00Z",
  "updated_at": "2024-01-15T07:55:00Z"
}
```

### 14. Update Notification Preference
**PUT/PATCH** `/api/notifications/preferences/{id}/`

Update a specific notification preference.

**Request Body:**
```json
{
  "push_enabled": true,
  "email_enabled": true,
  "sms_enabled": false
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "notification_type": "medication",
  "notification_type_display": "Medication Reminder",
  "push_enabled": true,
  "email_enabled": true,
  "sms_enabled": false,
  "created_at": "2024-01-15T07:55:00Z",
  "updated_at": "2024-01-15T08:00:00Z"
}
```

### 15. Delete Notification Preference
**DELETE** `/api/notifications/preferences/{id}/`

Delete a specific notification preference.

**Response:**
```json
{
  "message": "Notification preference deleted successfully"
}
```

### 16. List Device Tokens
**GET** `/api/notifications/device-tokens/`

Get user's registered device tokens.

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    "token_masked": "abc123def4...vwx234yz",
    "device_type": "ios",
    "device_type_display": "iOS",
    "is_active": true,
    "last_used": "2024-01-15T08:00:00Z",
    "created_at": "2024-01-15T07:55:00Z"
  }
]
```

### 17. Register Device Token
**POST** `/api/notifications/register-device/`

Register a device token for push notifications.

**Request Body:**
```json
{
  "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "device_type": "ios"
}
```

**Response:**
```json
{
  "message": "Device token registered successfully"
}
```

### 18. Get Device Token Details
**GET** `/api/notifications/device-tokens/{id}/`

Get details of a specific device token.

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "token_masked": "abc123def4...vwx234yz",
  "device_type": "ios",
  "device_type_display": "iOS",
  "is_active": true,
  "last_used": "2024-01-15T08:00:00Z",
  "created_at": "2024-01-15T07:55:00Z"
}
```

### 19. Update Device Token
**PUT/PATCH** `/api/notifications/device-tokens/{id}/`

Update a device token.

**Request Body:**
```json
{
  "is_active": false
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "token_masked": "abc123def4...vwx234yz",
  "device_type": "ios",
  "device_type_display": "iOS",
  "is_active": false,
  "last_used": "2024-01-15T08:00:00Z",
  "created_at": "2024-01-15T07:55:00Z"
}
```

### 20. Delete Device Token
**DELETE** `/api/notifications/device-tokens/{id}/`

Delete a device token.

**Response:**
```json
{
  "message": "Device token deleted successfully"
}
```

### 21. List Notification Templates
**GET** `/api/notifications/templates/`

Get available notification templates (admin/system use).

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "medication_reminder",
    "notification_type": "medication",
    "notification_type_display": "Medication Reminder",
    "title_template": "Time to take {medication_name}",
    "message_template": "Don't forget to take your {medication_name} at {time}",
    "is_active": true,
    "created_at": "2024-01-15T07:55:00Z",
    "updated_at": "2024-01-15T07:55:00Z"
  }
]
```

## Test Endpoints (Development Only)

### 22. Test Medication Reminder
**POST** `/api/notifications/test/medication-reminder/`

Send a test medication reminder notification.

**Response:**
```json
{
  "message": "Test medication reminder sent",
  "notification_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### 23. Test Health Tip
**POST** `/api/notifications/test/health-tip/`

Send a test health tip notification.

**Response:**
```json
{
  "message": "Test health tip sent",
  "notification_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### 24. Test Sync Notification
**POST** `/api/notifications/test/sync-notification/`

Send a test sync notification.

**Response:**
```json
{
  "message": "Test sync notification sent",
  "notification_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

## React Native Integration

### 1. Setup Push Notifications

```javascript
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

// Configure push notifications
PushNotification.configure({
  onRegister: function (token) {
    // Register device token with backend
    registerDeviceToken(token.token);
  },
  onNotification: function (notification) {
    // Handle notification received
    handleNotificationReceived(notification);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});
```

### 2. Register Device Token

```javascript
const registerDeviceToken = async (token) => {
  try {
    const response = await fetch('/api/notifications/register-device/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        token: token,
        device_type: Platform.OS, // 'ios' or 'android'
      }),
    });

    if (response.ok) {
      console.log('Device token registered successfully');
    }
  } catch (error) {
    console.error('Error registering device token:', error);
  }
};
```

### 3. Fetch Notifications

```javascript
const fetchNotifications = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`/api/notifications/?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.results;
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

// Usage examples
const unreadNotifications = await fetchNotifications({ is_read: false });
const medicationNotifications = await fetchNotifications({ type: 'medication' });
```

### 4. Mark Notification as Read

```javascript
const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(`/api/notifications/${notificationId}/read/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      console.log('Notification marked as read');
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};
```

### 5. Update Notification Preferences

```javascript
const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await fetch('/api/notifications/preferences/update/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({ preferences }),
    });

    if (response.ok) {
      console.log('Notification preferences updated');
    }
  } catch (error) {
    console.error('Error updating notification preferences:', error);
  }
};

// Usage example
await updateNotificationPreferences([
  {
    notification_type: 'medication',
    push_enabled: true,
    email_enabled: false,
    sms_enabled: false,
  },
  {
    notification_type: 'health-tip',
    push_enabled: true,
    email_enabled: true,
    sms_enabled: false,
  },
]);
```

### 6. Handle Notification Received

```javascript
const handleNotificationReceived = (notification) => {
  // Update local state
  setNotifications(prev => [notification, ...prev]);
  
  // Show in-app notification
  showInAppNotification(notification);
  
  // Navigate to relevant screen if needed
  if (notification.data?.medication_id) {
    navigateToMedication(notification.data.medication_id);
  }
};
```

### 7. Notification Statistics

```javascript
const fetchNotificationStats = async () => {
  try {
    const response = await fetch('/api/notifications/stats/', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      const stats = await response.json();
      return stats;
    }
  } catch (error) {
    console.error('Error fetching notification stats:', error);
  }
};
```

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Invalid notification type. Must be one of: ['medication', 'health-tip', 'sync', 'general']"
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication credentials were not provided."
}
```

**404 Not Found:**
```json
{
  "error": "Notification not found or already read"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to send notification"
}
```

## Notification Types

### Medication Reminders
- **Type:** `medication`
- **Purpose:** Remind users to take their medications
- **Metadata:** Contains `medication_id` and `medication_name`
- **Scheduling:** Can be scheduled for specific times

### Health Tips
- **Type:** `health-tip`
- **Purpose:** Share health-related tips and articles
- **Metadata:** Contains `article_id` and `article_title`
- **Scheduling:** Usually sent immediately

### Sync Notifications
- **Type:** `sync`
- **Purpose:** Notify users when health data sync completes
- **Metadata:** Contains `device_name` and `metrics_count`
- **Scheduling:** Usually sent immediately

### General Notifications
- **Type:** `general`
- **Purpose:** General platform notifications
- **Metadata:** Varies based on notification content
- **Scheduling:** Can be scheduled or sent immediately

## Best Practices

### 1. Notification Frequency
- Avoid sending too many notifications
- Respect user preferences
- Use appropriate notification types

### 2. Content Guidelines
- Keep titles concise and clear
- Use actionable language
- Include relevant context in metadata

### 3. User Experience
- Allow users to control notification preferences
- Provide clear opt-out options
- Use appropriate notification channels

### 4. Performance
- Implement pagination for notification lists
- Use efficient filtering and sorting
- Cache notification preferences

### 5. Security
- Validate all input data
- Implement proper authentication
- Log notification delivery attempts

## Testing

### Development Testing
Use the test endpoints to verify notification functionality:

```javascript
// Test medication reminder
await fetch('/api/notifications/test/medication-reminder/', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${userToken}` },
});

// Test health tip
await fetch('/api/notifications/test/health-tip/', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${userToken}` },
});

// Test sync notification
await fetch('/api/notifications/test/sync-notification/', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${userToken}` },
});
```

### Production Considerations
- Implement proper push notification services (FCM/APNS)
- Set up email notification services
- Configure SMS notification services
- Monitor notification delivery rates
- Implement retry mechanisms for failed deliveries
