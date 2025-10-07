import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';

export interface HealthData {
  heartRate: number;
  steps: number;
  distance: number;
  sleep: number;
  calories: number;
  bloodPressure: { systolic: number; diastolic: number };
  weight: number;
  lastSync: Date | null;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'samsung_health';
  connected: boolean;
  lastSync: Date | null;
}

const HEALTH_DATA_KEY = '@health_data';
const CONNECTED_DEVICES_KEY = '@connected_devices';

export const [HealthTrackerProvider, useHealthTracker] = createContextHook(() => {
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

  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([
    {
      id: '1',
      name: Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit',
      type: Platform.OS === 'ios' ? 'apple_health' : 'google_fit',
      connected: false,
      lastSync: null,
    },
    {
      id: '2',
      name: 'Fitbit',
      type: 'fitbit',
      connected: false,
      lastSync: null,
    },
    {
      id: '3',
      name: 'Garmin',
      type: 'garmin',
      connected: false,
      lastSync: null,
    },
    {
      id: '4',
      name: 'Samsung Health',
      type: 'samsung_health',
      connected: false,
      lastSync: null,
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHealthData();
    loadConnectedDevices();
    setupPedometer();
  }, []);

  const setupPedometer = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    if (isAvailable && Platform.OS !== 'web') {
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        if (result) {
          updateHealthData({ 
            steps: result.steps,
            distance: (result.steps * 0.762) / 1000,
            calories: Math.round(result.steps * 0.04),
          });
        }
      } catch (error) {
        console.log('Pedometer error:', error);
      }

      const subscription = Pedometer.watchStepCount((result) => {
        updateHealthData({ 
          steps: result.steps,
          distance: (result.steps * 0.762) / 1000,
          calories: Math.round(result.steps * 0.04),
        });
      });

      return () => subscription && subscription.remove();
    }
  };

  const loadHealthData = async () => {
    try {
      const stored = await AsyncStorage.getItem(HEALTH_DATA_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHealthData({
          ...parsed,
          lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null,
        });
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConnectedDevices = async () => {
    try {
      const stored = await AsyncStorage.getItem(CONNECTED_DEVICES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConnectedDevices(
          parsed.map((device: ConnectedDevice) => ({
            ...device,
            lastSync: device.lastSync ? new Date(device.lastSync) : null,
          }))
        );
      }
    } catch (error) {
      console.error('Error loading connected devices:', error);
    }
  };

  const updateHealthData = async (data: Partial<HealthData>) => {
    const updated = { ...healthData, ...data, lastSync: new Date() };
    setHealthData(updated);
    try {
      await AsyncStorage.setItem(HEALTH_DATA_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  };

  const connectDevice = async (deviceId: string) => {
    const updated = connectedDevices.map((device) =>
      device.id === deviceId
        ? { ...device, connected: true, lastSync: new Date() }
        : device
    );
    setConnectedDevices(updated);
    try {
      await AsyncStorage.setItem(CONNECTED_DEVICES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving connected devices:', error);
    }

    if (Platform.OS === 'ios' && deviceId === '1') {
      simulateAppleHealthSync();
    } else if (Platform.OS === 'android' && deviceId === '1') {
      simulateGoogleFitSync();
    }
  };

  const disconnectDevice = async (deviceId: string) => {
    const updated = connectedDevices.map((device) =>
      device.id === deviceId
        ? { ...device, connected: false, lastSync: null }
        : device
    );
    setConnectedDevices(updated);
    try {
      await AsyncStorage.setItem(CONNECTED_DEVICES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving connected devices:', error);
    }
  };

  const syncHealthData = async () => {
    const connectedDevice = connectedDevices.find((d) => d.connected);
    if (!connectedDevice) {
      return;
    }

    if (Platform.OS === 'ios' && connectedDevice.type === 'apple_health') {
      await simulateAppleHealthSync();
    } else if (Platform.OS === 'android' && connectedDevice.type === 'google_fit') {
      await simulateGoogleFitSync();
    }

    const updated = connectedDevices.map((device) =>
      device.id === connectedDevice.id
        ? { ...device, lastSync: new Date() }
        : device
    );
    setConnectedDevices(updated);
    await AsyncStorage.setItem(CONNECTED_DEVICES_KEY, JSON.stringify(updated));
  };

  const simulateAppleHealthSync = async () => {
    await updateHealthData({
      heartRate: 68 + Math.floor(Math.random() * 20),
      sleep: 7 + Math.random() * 2,
      bloodPressure: {
        systolic: 115 + Math.floor(Math.random() * 15),
        diastolic: 75 + Math.floor(Math.random() * 15),
      },
      weight: 70 + Math.random() * 5,
    });
  };

  const simulateGoogleFitSync = async () => {
    await updateHealthData({
      heartRate: 70 + Math.floor(Math.random() * 20),
      sleep: 7 + Math.random() * 2,
      bloodPressure: {
        systolic: 115 + Math.floor(Math.random() * 15),
        diastolic: 75 + Math.floor(Math.random() * 15),
      },
      weight: 70 + Math.random() * 5,
    });
  };

  return {
    healthData,
    connectedDevices,
    isLoading,
    updateHealthData,
    connectDevice,
    disconnectDevice,
    syncHealthData,
  };
});
