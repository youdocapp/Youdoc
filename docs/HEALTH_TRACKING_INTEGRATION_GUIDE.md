# Health Tracking Integration Guide

## 🎯 Quick Start for Frontend Team

This guide shows how to integrate the health tracking backend with your existing frontend code.

## 📋 Current vs New Implementation

### **Current Frontend (Mock Data)**
```typescript
// contexts/HealthTrackerContext.tsx
const [healthData, setHealthData] = useState<HealthData>({
  heartRate: 72,
  steps: 0,
  distance: 0,
  sleep: 7.5,
  calories: 0,
  bloodPressure: { systolic: 120, diastolic: 80 },
  weight: 70,
  lastSync: null,
});
```

### **New Implementation (Real API)**
```typescript
// contexts/HealthTrackerContext.tsx
const [healthData, setHealthData] = useState<HealthData>({
  heartRate: 0,
  steps: 0,
  distance: 0,
  sleep: 0,
  calories: 0,
  bloodPressure: { systolic: 0, diastolic: 0 },
  weight: 0,
  lastSync: null,
});

// Load data from API
useEffect(() => {
  loadHealthDataFromAPI();
}, []);

const loadHealthDataFromAPI = async () => {
  try {
    const response = await fetch('/api/health-tracking/data/', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await response.json();
    setHealthData(data);
  } catch (error) {
    console.error('Failed to load health data:', error);
  }
};
```

## 🔄 Step-by-Step Integration

### **Step 1: Update HealthTrackerContext**

Replace the mock data loading with API calls:

```typescript
// contexts/HealthTrackerContext.tsx
export const [HealthTrackerProvider, useHealthTracker] = createContextHook(() => {
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 0,
    steps: 0,
    distance: 0,
    sleep: 0,
    calories: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    weight: 0,
    lastSync: null,
  });

  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load health data from API
  const loadHealthData = async () => {
    try {
      const response = await fetch('/api/health-tracking/data/', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      setHealthData(data);
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  // Load connected devices from API
  const loadConnectedDevices = async () => {
    try {
      const response = await fetch('/api/health-tracking/devices/', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const devices = await response.json();
      setConnectedDevices(devices);
    } catch (error) {
      console.error('Error loading connected devices:', error);
    }
  };

  // Update health data via API
  const updateHealthData = async (data: Partial<HealthData>) => {
    try {
      const response = await fetch('/api/health-tracking/data/update/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        setHealthData(updatedData);
      }
    } catch (error) {
      console.error('Error updating health data:', error);
    }
  };

  // Connect device via API
  const connectDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/health-tracking/devices/${deviceId}/toggle/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (response.ok) {
        // Update local state
        const updated = connectedDevices.map((device) =>
          device.id === deviceId
            ? { ...device, connected: true, lastSync: new Date() }
            : device
        );
        setConnectedDevices(updated);
        
        // Trigger real device sync
        await syncHealthData(deviceId);
      }
    } catch (error) {
      console.error('Error connecting device:', error);
    }
  };

  // Sync health data from device
  const syncHealthData = async (deviceId: string) => {
    try {
      // Call device-specific sync logic
      if (Platform.OS === 'ios') {
        await syncFromAppleHealth();
      } else if (Platform.OS === 'android') {
        await syncFromGoogleFit();
      }
      
      // Update sync status
      await fetch(`/api/health-tracking/devices/${deviceId}/sync/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    } catch (error) {
      console.error('Error syncing health data:', error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([
        loadHealthData(),
        loadConnectedDevices()
      ]);
      setIsLoading(false);
    };
    
    initializeData();
  }, []);

  return {
    healthData,
    connectedDevices,
    isLoading,
    updateHealthData,
    connectDevice,
    disconnectDevice: (deviceId: string) => connectDevice(deviceId), // Toggle off
    syncHealthData,
    addCustomDevice
  };
});
```

### **Step 2: Add Device Integration Libraries**

Install the required libraries:

```bash
# For iOS - Apple Health
npm install react-native-health

# For Android - Google Fit
npm install react-native-google-fit

# Cross-platform sensors
npx expo install expo-sensors
```

### **Step 3: Implement Real Device Sync**

```typescript
// utils/deviceSync.ts
import { HealthKit } from 'react-native-health';
import { GoogleFit } from 'react-native-google-fit';

export const syncFromAppleHealth = async () => {
  try {
    // Request permissions
    const permissions = await HealthKit.requestPermissions({
      read: ['heartRate', 'steps', 'sleepAnalysis', 'bloodPressure'],
      write: []
    });

    if (permissions.heartRate) {
      // Get heart rate data
      const heartRate = await HealthKit.getHeartRateSamples({
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endDate: new Date()
      });

      // Get steps data
      const steps = await HealthKit.getStepCount({
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endDate: new Date()
      });

      // Send to backend
      await updateHealthData({
        heartRate: heartRate[0]?.value || 0,
        steps: steps || 0,
        device_type: 'apple_health'
      });
    }
  } catch (error) {
    console.error('Apple Health sync error:', error);
  }
};

export const syncFromGoogleFit = async () => {
  try {
    // Initialize Google Fit
    await GoogleFit.initialize();

    // Get step count
    const steps = await GoogleFit.getDailySteps({
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date()
    });

    // Send to backend
    await updateHealthData({
      steps: steps || 0,
      device_type: 'google_fit'
    });
  } catch (error) {
    console.error('Google Fit sync error:', error);
  }
};
```

### **Step 4: Update Dashboard Component**

```typescript
// components/DashboardScreen.tsx
const DashboardScreen: React.FC<DashboardScreenProps> = ({ ... }) => {
  const { healthData, isLoading } = useHealthTracker();

  // Show loading state while fetching data
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Health metrics display */}
      <View style={styles.healthTrackerContainer}>
        <View style={styles.trackerCardLarge}>
          <Text style={styles.trackerLabel}>Heart Rate</Text>
          <Text style={styles.trackerValue}>
            {healthData.heartRate}
            <Text style={styles.trackerUnit}> bpm</Text>
          </Text>
        </View>
        
        <View style={styles.trackerCardSmall}>
          <Text style={styles.trackerLabel}>Steps</Text>
          <Text style={styles.trackerValue}>
            {healthData.steps.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};
```

### **Step 5: Update Connected Devices Screen**

```typescript
// components/ConnectedDevicesScreen.tsx
const ConnectedDevicesScreen: React.FC<ConnectedDevicesScreenProps> = ({ onBack }) => {
  const { connectedDevices, connectDevice, disconnectDevice, syncHealthData } = useHealthTracker();

  const handleToggleDevice = async (deviceId: string, connected: boolean) => {
    if (connected) {
      await disconnectDevice(deviceId);
    } else {
      await connectDevice(deviceId);
    }
  };

  const handleSyncDevice = async (deviceId: string) => {
    await syncHealthData(deviceId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {connectedDevices.map((device) => (
        <View key={device.id} style={styles.deviceCard}>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.lastSync}>
              Last sync: {formatLastSync(device.lastSync)}
            </Text>
          </View>
          
          <View style={styles.deviceActions}>
            <TouchableOpacity
              style={[styles.syncButton, !device.connected && styles.disabledButton]}
              onPress={() => handleSyncDevice(device.id)}
              disabled={!device.connected}
            >
              <Text style={styles.syncButtonText}>Sync</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.toggleButton, device.connected && styles.connectedButton]}
              onPress={() => handleToggleDevice(device.id, device.connected)}
            >
              <Text style={styles.toggleButtonText}>
                {device.connected ? 'Disconnect' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </SafeAreaView>
  );
};
```

## 🔧 Error Handling

Add proper error handling for API calls:

```typescript
const handleApiError = (error: any, operation: string) => {
  console.error(`${operation} failed:`, error);
  
  // Show user-friendly error message
  Alert.alert(
    'Error',
    `Failed to ${operation}. Please try again.`,
    [{ text: 'OK' }]
  );
};

// Use in API calls
const loadHealthData = async () => {
  try {
    const response = await fetch('/api/health-tracking/data/', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    setHealthData(data);
  } catch (error) {
    handleApiError(error, 'load health data');
  }
};
```

## 📱 Testing

### **Test API Integration**
```typescript
// Test the API endpoints
const testHealthTrackingAPI = async () => {
  try {
    // Test get health data
    const healthData = await fetch('/api/health-tracking/data/', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Health data:', await healthData.json());

    // Test update health data
    const updateResponse = await fetch('/api/health-tracking/data/update/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        heartRate: 75,
        steps: 5000,
        device_type: 'manual'
      })
    });
    console.log('Update response:', await updateResponse.json());

    // Test get devices
    const devices = await fetch('/api/health-tracking/devices/', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('Devices:', await devices.json());
  } catch (error) {
    console.error('API test failed:', error);
  }
};
```

## 🚀 Deployment Checklist

- [ ] Install device integration libraries
- [ ] Update HealthTrackerContext with API calls
- [ ] Implement real device sync functions
- [ ] Add error handling for API failures
- [ ] Test with real devices (iPhone/Android)
- [ ] Add loading states for API calls
- [ ] Implement offline support with local caching
- [ ] Test cross-device synchronization

## 📞 Support

If you encounter any issues during integration:

1. Check the API documentation for endpoint details
2. Verify authentication tokens are valid
3. Test API endpoints with curl or Postman
4. Check device permissions for health data access
5. Review error logs for specific error messages

The backend is designed to be a drop-in replacement for your existing mock data system, so the integration should be straightforward!
