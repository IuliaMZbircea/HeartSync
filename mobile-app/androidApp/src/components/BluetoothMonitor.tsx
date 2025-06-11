import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import bluetoothService from '../services/bluetooth.service';

interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
}

const BluetoothMonitor: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          setError('Bluetooth permissions are required');
          return false;
        }
        return true;
      } catch (err) {
        console.error('Permission request error:', err);
        setError('Error requesting permissions');
        return false;
      }
    }
    return true;
  };

  const initialize = async () => {
    try {
      setError(null);
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      await bluetoothService.initialize();
      scanForDevices();
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Error initializing Bluetooth');
    }
  };

  const scanForDevices = async () => {
    try {
      setIsScanning(true);
      setError(null);
      const foundDevices = await bluetoothService.listDevices();
      setDevices(foundDevices);
    } catch (err) {
      console.error('Scanning error:', err);
      setError('Error scanning for devices');
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      setError(null);
      await bluetoothService.connectToDevice(deviceId);
      setIsConnected(true);
    } catch (err) {
      console.error('Connection error:', err);
      setError('Error connecting to device');
    }
  };

  const disconnect = async () => {
    try {
      await bluetoothService.disconnect();
      setIsConnected(false);
    } catch (err) {
      console.error('Disconnect error:', err);
      setError('Error disconnecting from device');
    }
  };

  useEffect(() => {
    initialize();

    return () => {
      disconnect();
    };
  }, []);

  const renderDevice = ({ item }: { item: BluetoothDevice }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item.id)}
      disabled={isConnected}
    >
      <Icon name="bluetooth" size={20} color="#2196F3" />
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="bluetooth"
          size={24}
          color={isConnected ? '#2196F3' : '#757575'}
        />
        <Text style={styles.title}>RN42 Sensor</Text>
      </View>

      <View style={styles.status}>
        <Text style={[
          styles.statusText,
          { color: isConnected ? '#4CAF50' : '#757575' }
        ]}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Icon name="error" size={16} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!isConnected && (
        <>
          <TouchableOpacity
            style={[styles.button, { marginBottom: 16 }]}
            onPress={scanForDevices}
            disabled={isScanning}
          >
            <Text style={styles.buttonText}>
              {isScanning ? 'Scanning...' : 'Scan for Devices'}
            </Text>
          </TouchableOpacity>

          <FlatList
            data={devices}
            renderItem={renderDevice}
            keyExtractor={(item) => item.id}
            style={styles.deviceList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {isScanning ? 'Scanning...' : 'No RN42 devices found'}
              </Text>
            }
          />
        </>
      )}

      {isConnected && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#F44336' }]}
          onPress={disconnect}
        >
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
    color: '#212121',
  },
  status: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#F44336',
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  deviceList: {
    maxHeight: 200,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  deviceInfo: {
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  deviceAddress: {
    fontSize: 14,
    color: '#757575',
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 14,
  },
});

export default BluetoothMonitor; 