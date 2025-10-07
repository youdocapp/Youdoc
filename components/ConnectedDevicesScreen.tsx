import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from 'react-native';
import {
  Smartphone,
  Watch,
  Activity,
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Plus,
} from 'lucide-react-native';
import { useHealthTracker } from '@/contexts/HealthTrackerContext';

interface ConnectedDevicesScreenProps {
  onBack?: () => void;
}

const ConnectedDevicesScreen: React.FC<ConnectedDevicesScreenProps> = ({ onBack }) => {
  const { connectedDevices, connectDevice, disconnectDevice, syncHealthData, isLoading, addCustomDevice } =
    useHealthTracker();

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'apple_health':
      case 'google_fit':
        return <Smartphone size={32} color="#4F7FFF" />;
      case 'fitbit':
      case 'garmin':
        return <Watch size={32} color="#4F7FFF" />;
      case 'samsung_health':
        return <Activity size={32} color="#4F7FFF" />;
      default:
        return <Activity size={32} color="#4F7FFF" />;
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never synced';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleToggleDevice = (deviceId: string, connected: boolean) => {
    if (connected) {
      disconnectDevice(deviceId);
    } else {
      connectDevice(deviceId);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F7FFF" />
        </View>
      </SafeAreaView>
    );
  }

  const handleAddDevice = () => {
    const deviceName = `Custom Device ${connectedDevices.length + 1}`;
    addCustomDevice(deviceName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
        )}
        <Text style={styles.topHeaderTitle}>Connected Devices</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>
            Sync your health data from various devices and apps
          </Text>
        </View>

        <View style={styles.syncSection}>
          <TouchableOpacity style={styles.syncButton} onPress={syncHealthData}>
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.syncButtonText}>Sync All Devices</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.devicesSection}>
          <TouchableOpacity style={styles.addDeviceButton} onPress={handleAddDevice}>
            <View style={styles.addDeviceIcon}>
              <Plus size={24} color="#4F7FFF" />
            </View>
            <Text style={styles.addDeviceText}>Add New Device</Text>
          </TouchableOpacity>

          {connectedDevices.map((device) => (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceIcon}>{getDeviceIcon(device.type)}</View>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceHeader}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  {device.connected ? (
                    <CheckCircle size={20} color="#10B981" />
                  ) : (
                    <XCircle size={20} color="#9CA3AF" />
                  )}
                </View>
                <Text style={styles.deviceStatus}>
                  {device.connected ? 'Connected' : 'Not connected'}
                </Text>
                {device.connected && (
                  <Text style={styles.lastSync}>Last sync: {formatLastSync(device.lastSync)}</Text>
                )}
              </View>
              <Switch
                value={device.connected}
                onValueChange={() => handleToggleDevice(device.id, device.connected)}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={device.connected ? '#4F7FFF' : '#F3F4F6'}
              />
            </View>
          ))}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>About Health Data Sync</Text>
            <Text style={styles.infoText}>
              Connect your health devices and apps to automatically sync your health data. This
              includes steps, heart rate, sleep, calories, and more.
            </Text>
            <Text style={styles.infoText}>
              Your data is encrypted and stored securely. You can disconnect any device at any time.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  syncSection: {
    padding: 20,
  },
  syncButton: {
    backgroundColor: '#4F7FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  devicesSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  addDeviceButton: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4F7FFF',
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  addDeviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  addDeviceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F7FFF',
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  deviceStatus: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  lastSync: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  infoSection: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default ConnectedDevicesScreen;
