# Health Tracking API Documentation

## Overview
The Health Tracking API provides comprehensive functionality for managing health data, connected devices, health goals, and insights. This API supports integration with various health platforms and devices, real-time health data tracking, and personalized health insights.

## Base URL
```
https://youdoc.onrender.com/health-tracking
```

## Authentication
All endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. Get Current Health Data
**GET** `/data`

Get today's health data snapshot with all current metrics.

#### Success Response (200)
```json
{
  "id": "uuid-here",
  "date": "2024-01-17",
  "heartRate": 72.5,
  "steps": 8500,
  "distance": 6.2,
  "sleep": 7.5,
  "calories": 2100,
  "weight": 70.5,
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "device_type": "apple_health",
  "lastSync": "2024-01-17T14:30:00Z",
  "created_at": "2024-01-17T10:30:00Z",
  "updated_at": "2024-01-17T14:30:00Z"
}
```

---

### 2. Update Health Data
**POST** `/data/update`

Update health data for today. Supports partial updates.

#### Request Body
```json
{
  "heartRate": 75.0,
  "steps": 9000,
  "distance": 6.5,
  "sleep": 8.0,
  "calories": 2200,
  "weight": 70.2,
  "bloodPressure": {
    "systolic": 118,
    "diastolic": 78
  },
  "device_type": "manual"
}
```

#### Optional Fields
- `heartRate` (number): Heart rate in BPM
- `steps` (integer): Number of steps
- `distance` (number): Distance in kilometers
- `sleep` (number): Sleep duration in hours
- `calories` (integer): Calories burned
- `weight` (number): Weight in kilograms
- `bloodPressure` (object): Blood pressure with systolic and diastolic values
- `device_type` (string): Source of data ("manual", "apple_health", "google_fit", etc.)

#### Success Response (201)
```json
{
  "id": "uuid-here",
  "date": "2024-01-17",
  "heartRate": 75.0,
  "steps": 9000,
  "distance": 6.5,
  "sleep": 8.0,
  "calories": 2200,
  "weight": 70.2,
  "bloodPressure": {
    "systolic": 118,
    "diastolic": 78
  },
  "device_type": "manual",
  "lastSync": "2024-01-17T15:45:00Z",
  "created_at": "2024-01-17T10:30:00Z",
  "updated_at": "2024-01-17T15:45:00Z"
}
```

---

### 3. List Connected Devices
**GET** `/devices`

Get all connected health devices for the user.

#### Success Response (200)
```json
[
  {
    "id": "uuid-here",
    "name": "Apple Health",
    "type": "apple_health",
    "connected": true,
    "lastSync": "2024-01-17T14:30:00Z",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-17T14:30:00Z"
  },
  {
    "id": "uuid-here",
    "name": "Fitbit Charge 5",
    "type": "fitbit",
    "connected": false,
    "lastSync": null,
    "created_at": "2024-01-16T09:15:00Z",
    "updated_at": "2024-01-16T09:15:00Z"
  }
]
```

---

### 4. Add Connected Device
**POST** `/devices`

Add a new health device connection.

#### Request Body
```json
{
  "name": "Apple Health",
  "device_type": "apple_health",
  "device_id": "user_device_123",
  "access_token": "encrypted_token_here",
  "refresh_token": "encrypted_refresh_token_here"
}
```

#### Required Fields
- `name` (string): Device name
- `device_type` (string): Device type ("apple_health", "google_fit", "fitbit", "garmin", "samsung_health", "custom")

#### Optional Fields
- `device_id` (string): Device identifier
- `access_token` (string): OAuth access token
- `refresh_token` (string): OAuth refresh token

#### Success Response (201)
```json
{
  "id": "uuid-here",
  "name": "Apple Health",
  "type": "apple_health",
  "connected": false,
  "lastSync": null,
  "created_at": "2024-01-17T16:00:00Z",
  "updated_at": "2024-01-17T16:00:00Z"
}
```

---

### 5. Update Connected Device
**PUT/PATCH** `/devices/{device_id}`

Update device information.

#### Request Body (PATCH - partial update)
```json
{
  "name": "Updated Device Name",
  "access_token": "new_encrypted_token"
}
```

#### Success Response (200)
```json
{
  "id": "uuid-here",
  "name": "Updated Device Name",
  "type": "apple_health",
  "connected": true,
  "lastSync": "2024-01-17T16:30:00Z",
  "created_at": "2024-01-17T16:00:00Z",
  "updated_at": "2024-01-17T16:30:00Z"
}
```

---

### 6. Delete Connected Device
**DELETE** `/devices/{device_id}`

Remove a connected device.

#### Success Response (204)
```
No Content
```

---

### 7. Toggle Device Connection
**POST/DELETE** `/devices/{device_id}/connect`

Connect or disconnect a device.

#### Success Response (200) - Connected
```json
{
  "connected": true
}
```

#### Success Response (200) - Disconnected
```json
{
  "connected": false
}
```

---

### 8. Sync Health Data
**POST** `/devices/{device_id}/sync`

Trigger health data synchronization for a device.

#### Success Response (200)
```json
{
  "message": "Sync initiated",
  "sync_id": "uuid-here",
  "last_sync": "2024-01-17T16:45:00Z"
}
```

#### Error Response (400) - Device Not Connected
```json
{
  "error": "Device not connected"
}
```

---

### 9. List Health Goals
**GET** `/goals`

Get all active health goals for the user.

#### Success Response (200)
```json
[
  {
    "id": "uuid-here",
    "goal_type": "steps",
    "target_value": 10000,
    "unit": "steps",
    "is_active": true,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "created_at": "2024-01-01T10:30:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  },
  {
    "id": "uuid-here",
    "goal_type": "sleep",
    "target_value": 8.0,
    "unit": "hours",
    "is_active": true,
    "start_date": "2024-01-01",
    "end_date": null,
    "created_at": "2024-01-01T10:30:00Z",
    "updated_at": "2024-01-01T10:30:00Z"
  }
]
```

---

### 10. Create Health Goal
**POST** `/goals`

Create a new health goal.

#### Request Body
```json
{
  "goal_type": "steps",
  "target_value": 10000,
  "unit": "steps",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

#### Required Fields
- `goal_type` (string): Goal type ("steps", "distance", "calories", "sleep", "weight", "heartRate")
- `target_value` (number): Target value to achieve
- `unit` (string): Unit of measurement

#### Optional Fields
- `start_date` (string): Start date (default: today)
- `end_date` (string): End date (optional)

#### Success Response (201)
```json
{
  "id": "uuid-here",
  "goal_type": "steps",
  "target_value": 10000,
  "unit": "steps",
  "is_active": true,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "created_at": "2024-01-17T16:00:00Z",
  "updated_at": "2024-01-17T16:00:00Z"
}
```

---

### 11. Update Health Goal
**PUT/PATCH** `/goals/{goal_id}`

Update an existing health goal.

#### Request Body (PATCH - partial update)
```json
{
  "target_value": 12000,
  "is_active": false
}
```

#### Success Response (200)
```json
{
  "id": "uuid-here",
  "goal_type": "steps",
  "target_value": 12000,
  "unit": "steps",
  "is_active": false,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "created_at": "2024-01-17T16:00:00Z",
  "updated_at": "2024-01-17T16:30:00Z"
}
```

---

### 12. Delete Health Goal
**DELETE** `/goals/{goal_id}`

Permanently delete a health goal.

#### Success Response (204)
```
No Content
```

---

### 13. Get Health Trends
**GET** `/trends`

Get health trends over time for a specific metric.

#### Query Parameters
- `metric` (string): Metric type ("heartRate", "steps", "distance", "sleep", "calories", "weight")
- `days` (integer): Number of days to analyze (default: 30)

#### Example Request
```
GET /health-tracking/trends?metric=steps&days=7
```

#### Success Response (200)
```json
[
  {
    "date": "2024-01-11",
    "value": 8500,
    "metric_type": "steps"
  },
  {
    "date": "2024-01-12",
    "value": 9200,
    "metric_type": "steps"
  },
  {
    "date": "2024-01-13",
    "value": 7800,
    "metric_type": "steps"
  }
]
```

---

### 14. Get Health Insights
**GET** `/insights`

Get health insights and recommendations.

#### Success Response (200)
```json
{
  "total_insights": 15,
  "unread_insights": 3,
  "recent_insights": [
    {
      "id": "uuid-here",
      "insight_type": "trend",
      "title": "Steps Trend Analysis",
      "description": "Your daily steps have increased by 15% over the past week. Great job!",
      "metric_type": "steps",
      "value": 9200,
      "is_read": false,
      "created_at": "2024-01-17T10:30:00Z"
    },
    {
      "id": "uuid-here",
      "insight_type": "recommendation",
      "title": "Sleep Quality Improvement",
      "description": "Consider maintaining a consistent sleep schedule to improve your sleep quality.",
      "metric_type": "sleep",
      "value": 7.5,
      "is_read": true,
      "created_at": "2024-01-16T14:20:00Z"
    }
  ]
}
```

---

### 15. Mark Insight as Read
**POST** `/insights/{insight_id}/read`

Mark a health insight as read.

#### Success Response (200)
```json
{
  "message": "Insight marked as read"
}
```

---

### 16. Get Goal Progress
**GET** `/goals/progress`

Get progress towards all active health goals.

#### Success Response (200)
```json
[
  {
    "goal": {
      "id": "uuid-here",
      "goal_type": "steps",
      "target_value": 10000,
      "unit": "steps",
      "is_active": true,
      "start_date": "2024-01-01",
      "end_date": "2024-12-31",
      "created_at": "2024-01-01T10:30:00Z",
      "updated_at": "2024-01-01T10:30:00Z"
    },
    "current_value": 8500,
    "progress_percentage": 85.0,
    "days_remaining": 348,
    "is_on_track": true
  },
  {
    "goal": {
      "id": "uuid-here",
      "goal_type": "sleep",
      "target_value": 8.0,
      "unit": "hours",
      "is_active": true,
      "start_date": "2024-01-01",
      "end_date": null,
      "created_at": "2024-01-01T10:30:00Z",
      "updated_at": "2024-01-01T10:30:00Z"
    },
    "current_value": 7.5,
    "progress_percentage": 93.75,
    "days_remaining": null,
    "is_on_track": true
  }
]
```

---

### 17. Get Sync History
**GET** `/sync-history`

Get synchronization history for connected devices.

#### Query Parameters
- `device_id` (string): Filter by specific device ID

#### Success Response (200)
```json
[
  {
    "id": "uuid-here",
    "device_name": "Apple Health",
    "status": "success",
    "metrics_synced": 5,
    "error_message": "",
    "sync_duration": 2.5,
    "started_at": "2024-01-17T16:45:00Z",
    "completed_at": "2024-01-17T16:45:02Z"
  },
  {
    "id": "uuid-here",
    "device_name": "Fitbit Charge 5",
    "status": "failed",
    "metrics_synced": 0,
    "error_message": "Authentication token expired",
    "sync_duration": 1.2,
    "started_at": "2024-01-17T15:30:00Z",
    "completed_at": "2024-01-17T15:30:01Z"
  }
]
```

---

## Device Types

### Supported Device Types
- `apple_health`: Apple Health app integration
- `google_fit`: Google Fit integration
- `fitbit`: Fitbit devices and app
- `garmin`: Garmin devices and app
- `samsung_health`: Samsung Health app
- `custom`: Custom device integration

### Goal Types
- `steps`: Daily step count
- `distance`: Daily distance traveled
- `calories`: Daily calories burned
- `sleep`: Sleep duration
- `weight`: Weight target
- `heartRate`: Heart rate zone

### Insight Types
- `trend`: Trend analysis
- `goal_progress`: Goal progress updates
- `recommendation`: Health recommendations
- `alert`: Health alerts
- `achievement`: Achievement notifications

---

## React Native Integration

### 1. Health Tracking Service
```javascript
// services/healthTrackingService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://youdoc.onrender.com/health-tracking';

class HealthTrackingService {
  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getHealthData() {
    const response = await fetch(`${API_BASE_URL}/data`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async updateHealthData(healthData) {
    const response = await fetch(`${API_BASE_URL}/data/update`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(healthData),
    });
    return response.json();
  }

  async getConnectedDevices() {
    const response = await fetch(`${API_BASE_URL}/devices`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async addConnectedDevice(deviceData) {
    const response = await fetch(`${API_BASE_URL}/devices`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(deviceData),
    });
    return response.json();
  }

  async updateConnectedDevice(deviceId, deviceData) {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(deviceData),
    });
    return response.json();
  }

  async deleteConnectedDevice(deviceId) {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.status === 204;
  }

  async toggleDeviceConnection(deviceId) {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/connect`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async disconnectDevice(deviceId) {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/connect`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async syncHealthData(deviceId) {
    const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/sync`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async getHealthGoals() {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async createHealthGoal(goalData) {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(goalData),
    });
    return response.json();
  }

  async updateHealthGoal(goalId, goalData) {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(goalData),
    });
    return response.json();
  }

  async deleteHealthGoal(goalId) {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return response.status === 204;
  }

  async getHealthTrends(metric, days = 30) {
    const response = await fetch(`${API_BASE_URL}/trends?metric=${metric}&days=${days}`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async getHealthInsights() {
    const response = await fetch(`${API_BASE_URL}/insights`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async markInsightRead(insightId) {
    const response = await fetch(`${API_BASE_URL}/insights/${insightId}/read`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async getGoalProgress() {
    const response = await fetch(`${API_BASE_URL}/goals/progress`, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }

  async getSyncHistory(deviceId = null) {
    const url = deviceId 
      ? `${API_BASE_URL}/sync-history/?device_id=${deviceId}`
      : `${API_BASE_URL}/sync-history/`;
    const response = await fetch(url, {
      headers: await this.getAuthHeaders(),
    });
    return response.json();
  }
}

export default new HealthTrackingService();
```

### 2. Health Tracking Context
```javascript
// context/HealthTrackingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import HealthTrackingService from '../services/healthTrackingService';

const HealthTrackingContext = createContext();

export const useHealthTracking = () => {
  const context = useContext(HealthTrackingContext);
  if (!context) {
    throw new Error('useHealthTracking must be used within a HealthTrackingProvider');
  }
  return context;
};

export const HealthTrackingProvider = ({ children }) => {
  const [healthData, setHealthData] = useState(null);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [healthGoals, setHealthGoals] = useState([]);
  const [healthInsights, setHealthInsights] = useState(null);
  const [goalProgress, setGoalProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHealthData = async () => {
    setIsLoading(true);
    try {
      const data = await HealthTrackingService.getHealthData();
      setHealthData(data);
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConnectedDevices = async () => {
    try {
      const data = await HealthTrackingService.getConnectedDevices();
      setConnectedDevices(data);
    } catch (error) {
      console.error('Failed to load connected devices:', error);
    }
  };

  const loadHealthGoals = async () => {
    try {
      const data = await HealthTrackingService.getHealthGoals();
      setHealthGoals(data);
    } catch (error) {
      console.error('Failed to load health goals:', error);
    }
  };

  const loadHealthInsights = async () => {
    try {
      const data = await HealthTrackingService.getHealthInsights();
      setHealthInsights(data);
    } catch (error) {
      console.error('Failed to load health insights:', error);
    }
  };

  const loadGoalProgress = async () => {
    try {
      const data = await HealthTrackingService.getGoalProgress();
      setGoalProgress(data);
    } catch (error) {
      console.error('Failed to load goal progress:', error);
    }
  };

  const updateHealthData = async (healthData) => {
    try {
      const response = await HealthTrackingService.updateHealthData(healthData);
      setHealthData(response);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addConnectedDevice = async (deviceData) => {
    try {
      const response = await HealthTrackingService.addConnectedDevice(deviceData);
      setConnectedDevices(prev => [response, ...prev]);
      return { success: true, device: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateConnectedDevice = async (deviceId, deviceData) => {
    try {
      const response = await HealthTrackingService.updateConnectedDevice(deviceId, deviceData);
      setConnectedDevices(prev => 
        prev.map(device => device.id === deviceId ? response : device)
      );
      return { success: true, device: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteConnectedDevice = async (deviceId) => {
    try {
      await HealthTrackingService.deleteConnectedDevice(deviceId);
      setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleDeviceConnection = async (deviceId) => {
    try {
      const response = await HealthTrackingService.toggleDeviceConnection(deviceId);
      setConnectedDevices(prev => 
        prev.map(device => 
          device.id === deviceId 
            ? { ...device, connected: response.connected, lastSync: response.lastSync }
            : device
        )
      );
      return { success: true, connected: response.connected };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const syncHealthData = async (deviceId) => {
    try {
      const response = await HealthTrackingService.syncHealthData(deviceId);
      await loadHealthData(); // Refresh health data after sync
      return { success: true, syncId: response.sync_id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const createHealthGoal = async (goalData) => {
    try {
      const response = await HealthTrackingService.createHealthGoal(goalData);
      setHealthGoals(prev => [response, ...prev]);
      return { success: true, goal: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateHealthGoal = async (goalId, goalData) => {
    try {
      const response = await HealthTrackingService.updateHealthGoal(goalId, goalData);
      setHealthGoals(prev => 
        prev.map(goal => goal.id === goalId ? response : goal)
      );
      return { success: true, goal: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteHealthGoal = async (goalId) => {
    try {
      await HealthTrackingService.deleteHealthGoal(goalId);
      setHealthGoals(prev => prev.filter(goal => goal.id !== goalId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const markInsightRead = async (insightId) => {
    try {
      await HealthTrackingService.markInsightRead(insightId);
      await loadHealthInsights(); // Refresh insights
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getHealthTrends = async (metric, days = 30) => {
    try {
      return await HealthTrackingService.getHealthTrends(metric, days);
    } catch (error) {
      console.error('Failed to load health trends:', error);
      return [];
    }
  };

  useEffect(() => {
    loadHealthData();
    loadConnectedDevices();
    loadHealthGoals();
    loadHealthInsights();
    loadGoalProgress();
  }, []);

  const value = {
    healthData,
    connectedDevices,
    healthGoals,
    healthInsights,
    goalProgress,
    isLoading,
    loadHealthData,
    loadConnectedDevices,
    loadHealthGoals,
    loadHealthInsights,
    loadGoalProgress,
    updateHealthData,
    addConnectedDevice,
    updateConnectedDevice,
    deleteConnectedDevice,
    toggleDeviceConnection,
    syncHealthData,
    createHealthGoal,
    updateHealthGoal,
    deleteHealthGoal,
    markInsightRead,
    getHealthTrends,
  };

  return (
    <HealthTrackingContext.Provider value={value}>
      {children}
    </HealthTrackingContext.Provider>
  );
};
```

### 3. Health Dashboard Component
```javascript
// components/HealthDashboard.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useHealthTracking } from '../context/HealthTrackingContext';

const HealthDashboard = () => {
  const { 
    healthData, 
    healthGoals, 
    goalProgress, 
    healthInsights,
    updateHealthData,
    syncHealthData,
    connectedDevices 
  } = useHealthTracking();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateHealthData = async (field, value) => {
    setIsUpdating(true);
    const result = await updateHealthData({ [field]: value });
    if (!result.success) {
      Alert.alert('Error', result.error);
    }
    setIsUpdating(false);
  };

  const handleSyncDevice = async (deviceId) => {
    const result = await syncHealthData(deviceId);
    if (result.success) {
      Alert.alert('Success', 'Health data synced successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const renderHealthMetric = (label, value, unit, field) => (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>
        {value ? `${value} ${unit}` : 'Not recorded'}
      </Text>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => {
          // Show input dialog for updating
          Alert.prompt(
            `Update ${label}`,
            `Enter new ${label.toLowerCase()}:`,
            (text) => {
              if (text) {
                handleUpdateHealthData(field, parseFloat(text));
              }
            }
          );
        }}
      >
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGoalProgress = (progress) => (
    <View key={progress.goal.id} style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalTitle}>
          {progress.goal.goal_type.charAt(0).toUpperCase() + progress.goal.goal_type.slice(1)}
        </Text>
        <Text style={styles.goalTarget}>
          Target: {progress.goal.target_value} {progress.goal.unit}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(progress.progress_percentage, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {progress.progress_percentage.toFixed(1)}%
        </Text>
      </View>
      
      <Text style={styles.currentValue}>
        Current: {progress.current_value} {progress.goal.unit}
      </Text>
      
      {progress.days_remaining && (
        <Text style={styles.daysRemaining}>
          {progress.days_remaining} days remaining
        </Text>
      )}
      
      <View style={[
        styles.statusBadge,
        progress.is_on_track ? styles.onTrackBadge : styles.offTrackBadge
      ]}>
        <Text style={[
          styles.statusText,
          progress.is_on_track ? styles.onTrackText : styles.offTrackText
        ]}>
          {progress.is_on_track ? 'On Track' : 'Needs Attention'}
        </Text>
      </View>
    </View>
  );

  const renderInsight = (insight) => (
    <View key={insight.id} style={[
      styles.insightCard,
      !insight.is_read && styles.unreadInsight
    ]}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        {!insight.is_read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.insightDescription}>{insight.description}</Text>
      <Text style={styles.insightType}>
        {insight.insight_type.charAt(0).toUpperCase() + insight.insight_type.slice(1)}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Health Data</Text>
      
      {healthData && (
        <View style={styles.metricsGrid}>
          {renderHealthMetric('Heart Rate', healthData.heartRate, 'BPM', 'heartRate')}
          {renderHealthMetric('Steps', healthData.steps, 'steps', 'steps')}
          {renderHealthMetric('Distance', healthData.distance, 'km', 'distance')}
          {renderHealthMetric('Sleep', healthData.sleep, 'hours', 'sleep')}
          {renderHealthMetric('Calories', healthData.calories, 'kcal', 'calories')}
          {renderHealthMetric('Weight', healthData.weight, 'kg', 'weight')}
        </View>
      )}

      <Text style={styles.sectionTitle}>Connected Devices</Text>
      <View style={styles.devicesList}>
        {connectedDevices.map(device => (
          <View key={device.id} style={styles.deviceCard}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceType}>{device.type}</Text>
              <Text style={[
                styles.deviceStatus,
                device.connected ? styles.connectedStatus : styles.disconnectedStatus
              ]}>
                {device.connected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
            {device.connected && (
              <TouchableOpacity
                style={styles.syncButton}
                onPress={() => handleSyncDevice(device.id)}
              >
                <Text style={styles.syncButtonText}>Sync</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Goal Progress</Text>
      {goalProgress.map(renderGoalProgress)}

      <Text style={styles.sectionTitle}>Health Insights</Text>
      {healthInsights?.recent_insights.map(renderInsight)}
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  devicesList: {
    marginBottom: 24,
  },
  deviceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  connectedStatus: {
    color: '#4CAF50',
  },
  disconnectedStatus: {
    color: '#f44336',
  },
  syncButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  goalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  goalTarget: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  currentValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  daysRemaining: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  onTrackBadge: {
    backgroundColor: '#e8f5e8',
  },
  offTrackBadge: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  onTrackText: {
    color: '#4CAF50',
  },
  offTrackText: {
    color: '#f44336',
  },
  insightCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadInsight: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  insightType: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
  },
};

export default HealthDashboard;
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": true,
  "message": "Validation failed",
  "details": {
    "target_value": ["This field is required"],
    "goal_type": ["Invalid goal type"]
  }
}
```

#### 404 Not Found
```json
{
  "error": true,
  "message": "Device not found"
}
```

#### 400 Bad Request - Device Not Connected
```json
{
  "error": "Device not connected"
}
```

---

## Security Notes

1. **User Isolation**: Users can only access their own health data
2. **Data Validation**: All input is validated on the server
3. **JWT Authentication**: Required for all operations
4. **HTTPS Only**: All API calls must use HTTPS in production
5. **Sensitive Data**: Health data is highly sensitive and requires encryption
6. **Device Tokens**: OAuth tokens are encrypted and stored securely
7. **Data Retention**: Consider data retention policies for health data

---

## Testing

Use the following test data for development:

```json
{
  "heartRate": 75.0,
  "steps": 8500,
  "distance": 6.2,
  "sleep": 7.5,
  "calories": 2100,
  "weight": 70.5,
  "device_type": "manual"
}
```

**Note**: Replace with actual test data in your development environment.
