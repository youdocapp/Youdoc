import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import {
  Smartphone,
  Watch,
  Activity,
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Plus,
  Bluetooth,
  X,
} from 'lucide-react-native';
import { useHealthTracker } from '@/contexts/HealthTrackerContext';
import { useTheme } from '@/contexts/ThemeContext';

interface ConnectedDevicesScreenProps {
  onBack?: () => void;
}

const ConnectedDevicesScreen: React.FC<ConnectedDevicesScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { connectedDevices, connectDevice, disconnectDevice, syncHealthData, syncWithPlatform, isLoading, addCustomDevice } =
    useHealthTracker();
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<{ id: string; name: string }[]>([]);

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

  const handleAddDevice = () => {
    setShowAddDeviceModal(true);
  };

  // BLE Manager instance
  const [manager] = useState(() => new BleManager());
  
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if ((Platform.Version as number) >= 31) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true; // iOS handles permissions automatically via Info.plist
  };

  const handleScanBluetooth = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Bluetooth scanning is not available on web. Please use the mobile app.');
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Bluetooth permissions are required to scan for devices.');
      return;
    }
    
    setIsScanning(true);
    setAvailableDevices([]); // Clear previous list

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (check only if we are scanning)
        console.log('BLE Scan Error:', error);
        // Don't alert immediately as it might be transient or user cancelled
        return;
      }

      if (device && device.name) {
        setAvailableDevices((prevDevices) => {
          if (!prevDevices.find((d) => d.id === device.id)) {
            return [...prevDevices, { id: device.id, name: device.name || 'Unknown Device' }];
          }
          return prevDevices;
        });
      }
    });
    
    // Stop scanning after 10 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  const handleConnectBluetoothDevice = (device: { id: string; name: string }) => {
    addCustomDevice(device.name);
    setShowAddDeviceModal(false);
    setAvailableDevices([]);
    setDeviceName('');
    Alert.alert('Success', `${device.name} has been added to your devices.`);
  };

  const handleManualAdd = () => {
    if (!deviceName.trim()) {
      Alert.alert('Error', 'Please enter a device name');
      return;
    }
    addCustomDevice(deviceName.trim());
    setShowAddDeviceModal(false);
    setDeviceName('');
    setAvailableDevices([]);
    Alert.alert('Success', `${deviceName} has been added to your devices.`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    topHeader: {
      backgroundColor: colors.card,
      paddingTop: 60,
      paddingBottom: 16,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topHeaderTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      padding: 20,
      paddingTop: 16,
      backgroundColor: colors.card,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
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
    addDeviceSubtext: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    modalBody: {
      padding: 20,
    },
    scanButton: {
      backgroundColor: '#4F7FFF',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 12,
      gap: 8,
      marginBottom: 16,
    },
    scanButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    scanningContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 12,
    },
    scanningText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    devicesListContainer: {
      marginBottom: 16,
    },
    devicesListTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    availableDeviceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 8,
      gap: 12,
    },
    availableDeviceName: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      fontWeight: '500',
    },
    connectText: {
      fontSize: 14,
      color: '#4F7FFF',
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: 16,
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
      marginBottom: 16,
    },
    addButton: {
      backgroundColor: '#4F7FFF',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    deviceCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.text,
    },
    deviceStatus: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    lastSync: {
      fontSize: 12,
      color: colors.textSecondary,
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
      color: colors.text,
      marginBottom: 12,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F7FFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color={colors.text} />
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
          <TouchableOpacity style={styles.syncButton} onPress={() => syncWithPlatform()}>
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.syncButtonText}>Sync All Devices</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.devicesSection}>
          <TouchableOpacity style={styles.addDeviceButton} onPress={handleAddDevice}>
            <View style={styles.addDeviceIcon}>
              <Plus size={24} color="#4F7FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addDeviceText}>Add New Device</Text>
              <Text style={styles.addDeviceSubtext}>Connect via Bluetooth or manually</Text>
            </View>
          </TouchableOpacity>

          {Array.isArray(connectedDevices) && connectedDevices.map((device) => (
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
                   <Text style={styles.lastSync}>Last sync: {formatLastSync(device.lastSync ? new Date(device.lastSync) : null)}</Text>
                )}
              </View>
              <Switch
                value={device.connected}
                onValueChange={(val) => handleToggleDevice(device.id, val)}
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

      <Modal
        visible={showAddDeviceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddDeviceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Device</Text>
              <TouchableOpacity onPress={() => {
                setShowAddDeviceModal(false);
                setAvailableDevices([]);
                setDeviceName('');
              }}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TouchableOpacity 
                style={styles.scanButton} 
                onPress={handleScanBluetooth}
                disabled={isScanning}
              >
                <Bluetooth size={20} color="#FFFFFF" />
                <Text style={styles.scanButtonText}>
                  {isScanning ? 'Scanning...' : 'Scan for Bluetooth Devices'}
                </Text>
              </TouchableOpacity>

              {isScanning && (
                <View style={styles.scanningContainer}>
                  <ActivityIndicator size="small" color="#4F7FFF" />
                  <Text style={styles.scanningText}>Searching for nearby devices...</Text>
                </View>
              )}

              {availableDevices.length > 0 && (
                <View style={styles.devicesListContainer}>
                  <Text style={styles.devicesListTitle}>Available Devices</Text>
                  {availableDevices.map((device) => (
                    <TouchableOpacity
                      key={device.id}
                      style={styles.availableDeviceItem}
                      onPress={() => handleConnectBluetoothDevice(device)}
                    >
                      <Bluetooth size={20} color="#4F7FFF" />
                      <Text style={styles.availableDeviceName}>{device.name}</Text>
                      <Text style={styles.connectText}>Connect</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <Text style={styles.inputLabel}>Add Device Manually</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter device name"
                value={deviceName}
                onChangeText={setDeviceName}
                placeholderTextColor={colors.textSecondary}
              />

              <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleManualAdd}
              >
                <Text style={styles.addButtonText}>Add Device</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ConnectedDevicesScreen;
