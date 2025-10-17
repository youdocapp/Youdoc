# Health Tracking API Documentation

## Overview
The health tracking backend provides comprehensive APIs for managing health data, connected devices, goals, and insights. It's designed to work seamlessly with the existing frontend health tracking system.

## 🏗️ Architecture

### **Frontend Responsibility (90%)**
- Device integration (Apple Health, Google Fit, Fitbit, etc.)
- OAuth flows and authentication
- Real-time sensor data collection
- Data synchronization with health platforms

### **Backend Responsibility (10%)**
- Data storage and persistence
- Historical data and trends
- Health insights and analytics
- Cross-device synchronization
- Goal tracking and progress

## 📊 Data Models

### HealthDataSnapshot
Daily snapshot of all health metrics (matches frontend `HealthData` interface):
```typescript
interface HealthDataSnapshot {
  id: string;
  date: string;
  heartRate: number;
  steps: number;
  distance: number;
  sleep: number;
  calories: number;
  weight: number;
  bloodPressure: { systolic: number; diastolic: number };
  device_type: string;
  lastSync: string;
}
```

### ConnectedDevice
User's connected health devices (matches frontend `ConnectedDevice` interface):
```typescript
interface ConnectedDevice {
  id: string;
  name: string;
  type: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'samsung_health' | 'custom';
  connected: boolean;
  lastSync: string;
}
```

### HealthMetric
Individual metric readings for historical tracking:
```typescript
interface HealthMetric {
  id: string;
  metric_type: string;
  value: number;
  unit: string;
  device_type: string;
  timestamp: string;
}
```

### HealthGoal
User's health goals and targets:
```typescript
interface HealthGoal {
  id: string;
  goal_type: string;
  target_value: number;
  unit: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
}
```

### HealthInsight
Generated insights and recommendations:
```typescript
interface HealthInsight {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  metric_type?: string;
  value?: number;
  is_read: boolean;
  created_at: string;
}
```

## 🔌 API Endpoints

### Health Data Management

#### Get Current Health Data
```
GET /api/health-tracking/data/
```
**Response:**
```json
{
  "id": "uuid",
  "date": "2024-01-15",
  "heartRate": 72,
  "steps": 8500,
  "distance": 6.2,
  "sleep": 7.5,
  "calories": 2100,
  "weight": 70,
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "device_type": "apple_health",
  "lastSync": "2024-01-15T10:30:00Z"
}
```

#### Update Health Data
```
POST /api/health-tracking/data/update/
```
**Request Body:**
```json
{
  "heartRate": 72,
  "steps": 8500,
  "distance": 6.2,
  "sleep": 7.5,
  "calories": 2100,
  "weight": 70,
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "device_type": "apple_health"
}
```

#### Get Health Trends
```
GET /api/health-tracking/trends/?metric=heartRate&days=30
```
**Response:**
```json
[
  {
    "date": "2024-01-01",
    "value": 70,
    "metric_type": "heartRate"
  },
  {
    "date": "2024-01-02",
    "value": 72,
    "metric_type": "heartRate"
  }
]
```

### Connected Devices Management

#### List Connected Devices
```
GET /api/health-tracking/devices/
```
**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Apple Health",
    "type": "apple_health",
    "connected": true,
    "lastSync": "2024-01-15T10:30:00Z"
  }
]
```

#### Create Connected Device
```
POST /api/health-tracking/devices/
```
**Request Body:**
```json
{
  "name": "Apple Health",
  "device_type": "apple_health"
}
```

#### Toggle Device Connection
```
POST /api/health-tracking/devices/{device_id}/toggle/
DELETE /api/health-tracking/devices/{device_id}/toggle/
```

#### Sync Health Data
```
POST /api/health-tracking/devices/{device_id}/sync/
```
**Response:**
```json
{
  "message": "Sync initiated",
  "sync_id": "uuid",
  "last_sync": "2024-01-15T10:30:00Z"
}
```

### Health Goals Management

#### List Health Goals
```
GET /api/health-tracking/goals/
```
**Response:**
```json
[
  {
    "id": "uuid",
    "goal_type": "steps",
    "target_value": 10000,
    "unit": "steps",
    "is_active": true,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
  }
]
```

#### Create Health Goal
```
POST /api/health-tracking/goals/
```
**Request Body:**
```json
{
  "goal_type": "steps",
  "target_value": 10000,
  "unit": "steps",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}
```

#### Get Goal Progress
```
GET /api/health-tracking/goals/progress/
```
**Response:**
```json
[
  {
    "goal": {
      "id": "uuid",
      "goal_type": "steps",
      "target_value": 10000,
      "unit": "steps"
    },
    "current_value": 8500,
    "progress_percentage": 85.0,
    "days_remaining": 45,
    "is_on_track": true
  }
]
```

### Health Insights

#### Get Health Insights
```
GET /api/health-tracking/insights/
```
**Response:**
```json
{
  "total_insights": 5,
  "unread_insights": 2,
  "recent_insights": [
    {
      "id": "uuid",
      "insight_type": "trend",
      "title": "Heart Rate Trend",
      "description": "Your heart rate has been stable over the past week",
      "is_read": false,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Mark Insight as Read
```
POST /api/health-tracking/insights/{insight_id}/read/
```

### Sync History

#### Get Sync History
```
GET /api/health-tracking/sync-history/?device_id={device_id}
```
**Response:**
```json
[
  {
    "id": "uuid",
    "device_name": "Apple Health",
    "status": "success",
    "metrics_synced": 7,
    "sync_duration": 2.5,
    "started_at": "2024-01-15T10:30:00Z",
    "completed_at": "2024-01-15T10:30:02Z"
  }
]
```

## 🔄 Frontend Integration Process

### 1. **Device Connection Flow**
```typescript
// Frontend connects to Apple Health
const connectAppleHealth = async () => {
  // 1. Request HealthKit permissions
  const permissions = await HealthKit.requestPermissions({
    read: ['heartRate', 'steps', 'sleepAnalysis'],
    write: []
  });
  
  // 2. Create device record in backend
  const device = await fetch('/api/health-tracking/devices/', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      name: 'Apple Health',
      device_type: 'apple_health'
    })
  });
  
  // 3. Toggle connection
  await fetch(`/api/health-tracking/devices/${device.id}/toggle/`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
};
```

### 2. **Data Synchronization Flow**
```typescript
// Frontend syncs health data
const syncHealthData = async () => {
  // 1. Get data from device APIs
  const healthData = await HealthKit.getHealthData({
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    endDate: new Date()
  });
  
  // 2. Normalize data format
  const normalizedData = {
    heartRate: healthData.heartRate,
    steps: healthData.steps,
    distance: healthData.distance,
    sleep: healthData.sleep,
    calories: healthData.calories,
    weight: healthData.weight,
    bloodPressure: healthData.bloodPressure,
    device_type: 'apple_health'
  };
  
  // 3. Send to backend
  await fetch('/api/health-tracking/data/update/', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(normalizedData)
  });
  
  // 4. Update device last sync
  await fetch(`/api/health-tracking/devices/${deviceId}/sync/`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
};
```

### 3. **Dashboard Data Loading**
```typescript
// Frontend loads dashboard data
const loadDashboardData = async () => {
  // 1. Get current health data
  const healthData = await fetch('/api/health-tracking/data/', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  
  // 2. Get connected devices
  const devices = await fetch('/api/health-tracking/devices/', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  
  // 3. Get goal progress
  const goals = await fetch('/api/health-tracking/goals/progress/', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  
  // 4. Update UI
  setHealthData(healthData);
  setConnectedDevices(devices);
  setGoalProgress(goals);
};
```

## 📱 Device Integration Libraries

### iOS - Apple Health
```bash
npm install react-native-health
```
```typescript
import { HealthKit } from 'react-native-health';

// Request permissions
const permissions = await HealthKit.requestPermissions({
  read: ['heartRate', 'steps', 'sleepAnalysis', 'bloodPressure'],
  write: []
});

// Get health data
const heartRate = await HealthKit.getHeartRateSamples({
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  endDate: new Date()
});
```

### Android - Google Fit
```bash
npm install react-native-google-fit
```
```typescript
import { GoogleFit } from 'react-native-google-fit';

// Initialize
await GoogleFit.initialize();

// Get step count
const steps = await GoogleFit.getDailySteps({
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  endDate: new Date()
});
```

### Cross-Platform - Expo Sensors
```bash
npx expo install expo-sensors
```
```typescript
import { Pedometer } from 'expo-sensors';

// Get step count
const { steps } = await Pedometer.getStepCountAsync(
  new Date(Date.now() - 24 * 60 * 60 * 1000),
  new Date()
);
```

## 🔐 Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 📊 Data Analytics Features

### Health Trends
- Daily, weekly, monthly trends
- Metric-specific filtering
- Historical data visualization
- Trend analysis and insights

### Goal Tracking
- Progress monitoring
- Achievement tracking
- Goal recommendations
- Performance analytics

### Health Insights
- Automated health recommendations
- Trend-based insights
- Goal progress notifications
- Health alerts and warnings

## 🚀 Getting Started

### 1. **Database Setup**
```bash
python manage.py makemigrations health_tracking
python manage.py migrate
```

### 2. **Test the API**
```bash
# Get health data
curl -H "Authorization: Bearer <token>" \
     http://localhost:8000/api/health-tracking/data/

# Update health data
curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"heartRate": 72, "steps": 8500}' \
     http://localhost:8000/api/health-tracking/data/update/
```

### 3. **Frontend Integration**
Replace the existing mock data in `HealthTrackerContext.tsx` with API calls to the backend endpoints.

## 🔧 Error Handling

### Common Error Responses
```json
// 400 Bad Request
{
  "error": "Invalid metric type"
}

// 401 Unauthorized
{
  "detail": "Authentication credentials were not provided."
}

// 404 Not Found
{
  "error": "Device not found"
}

// 500 Internal Server Error
{
  "error": "Internal server error"
}
```

## 📈 Performance Considerations

- **Data Pagination**: Use pagination for large datasets
- **Caching**: Implement caching for frequently accessed data
- **Batch Updates**: Send multiple metrics in single request
- **Background Sync**: Use background tasks for data synchronization
- **Rate Limiting**: Implement rate limiting for API calls

## 🔒 Security & Privacy

- **Data Encryption**: All health data is encrypted at rest
- **HIPAA Compliance**: Follows HIPAA guidelines for health data
- **Access Control**: User-specific data access
- **Audit Logging**: All data access is logged
- **Data Retention**: Configurable data retention policies

## 📝 Migration from Mock Data

### Current Frontend State
- Uses `AsyncStorage` for local data
- Simulated device connections
- Mock health metrics

### Migration Steps
1. **Replace data sources** with API calls
2. **Implement real device integration**
3. **Add error handling** for API failures
4. **Implement offline support** with local caching
5. **Add loading states** for API calls

The backend is designed to be a drop-in replacement for the existing mock data system, requiring minimal frontend changes.
