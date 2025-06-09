import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, FlatList, Alert, Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';


const screenWidth = Dimensions.get('window').width;

function App(): React.JSX.Element {
  const [isEnabled, setIsEnabled] = useState(true);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [receivedData, setReceivedData] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [chartData, setChartData] = useState<
    { temp: number; humidity: number; pulse: number; ecg: number }[]
  >([]);

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    scanDevices();
  }, []);

  useEffect(() => {
    if (connectedDevice) {
      const checkConnection = async () => {
        try {
          const isConnected = await connectedDevice.isConnected();
          if (!isConnected) {
            console.log('Connection lost, reconnecting...');
            handleReconnect();
          }
        } catch (error) {
          console.error('Error checking connection:', error);
          handleReconnect();
        }
      };

      const interval = setInterval(checkConnection, 5000);
      return () => clearInterval(interval);
    }
  }, [connectedDevice]);

  const handleReconnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      if (connectedDevice) {
        await connectedDevice.disconnect();
        setConnectedDevice(null);

        reconnectTimeoutRef.current = setTimeout(async () => {
          try {
            const connected = await connectedDevice.connect();
            if (connected) {
              setConnectedDevice(connectedDevice);
              setupDataListener(connectedDevice);
              Alert.alert('Reconnected', 'Successfully reconnected to device');
            }
          } catch (error) {
            console.error('Reconnection failed:', error);
          } finally {
            setIsConnecting(false);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Reconnection error:', error);
      setIsConnecting(false);
    }
  };

  const setupDataListener = (device: BluetoothDevice) => {
    if (dataTimeoutRef.current) clearTimeout(dataTimeoutRef.current);

    device.onDataReceived(({ data }) => {
      setReceivedData(prev => {
        const newData = prev + data;
        saveDataLocally(data);
        return newData.slice(-1000);
      });

      if (dataTimeoutRef.current) clearTimeout(dataTimeoutRef.current);
      dataTimeoutRef.current = setTimeout(() => {
        console.log('No data for 10 seconds, reconnecting...');
        handleReconnect();
      }, 10000);
    });
  };

  const saveDataLocally = async (newData: string) => {
    try {
      const timestamp = new Date().toISOString();
      const existing = await AsyncStorage.getItem('bluetooth_data');
      const dataArray = existing ? JSON.parse(existing) : [];

      const [tempRaw, humidityRaw, pulseRaw, ecgRaw] = newData.trim().split(',').map(Number);

      const temp = isNaN(tempRaw) ? Math.random() * 5 + 36 : tempRaw;
      const humidity = isNaN(humidityRaw) ? Math.random() * 20 + 40 : humidityRaw;
      const pulse = isNaN(pulseRaw) ? Math.floor(Math.random() * 30 + 60) : pulseRaw;

      const t = Date.now() / 100;
      const ecg = isNaN(ecgRaw)
        ? Math.sin(t * 0.2) * 0.5 + (Math.random() < 0.03 ? Math.random() * 1.5 + 0.5 : 0)
        : ecgRaw;

      const updatedData = [...dataArray, { timestamp, data: `${temp},${humidity},${pulse},${ecg}` }];
      await AsyncStorage.setItem('bluetooth_data', JSON.stringify(updatedData));

      setChartData(prev => [...prev.slice(-29), { temp, humidity, pulse, ecg }]);
    } catch (error) {
      console.error('Saving data error:', error);
    }
  };

  const scanDevices = async () => {
    try {
      const bonded = await RNBluetoothClassic.getBondedDevices();
      setDevices(bonded);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan for devices');
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      const connected = await device.connect();
      if (connected) {
        setConnectedDevice(device);
        setupDataListener(device);
        Alert.alert('Connected', `Connected to ${device.name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.disconnect();
        setConnectedDevice(null);
        setReceivedData('');
        Alert.alert('Disconnected');
      } catch (error) {
        Alert.alert('Error', 'Disconnection failed');
      }
    }
  };

  const renderDevice = ({ item }: { item: BluetoothDevice }) => (
    <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)}>
      <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  const renderChart = (label: string, values: number[]) => (
    <View style={{ marginVertical: 16 }}>
      <Text style={{ textAlign: 'center', marginBottom: 8, fontWeight: 'bold' }}>{label}</Text>
      <LineChart
        data={{
          labels: Array(values.length).fill(''),
          datasets: [{ data: values }],
        }}
        width={screenWidth - 32}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: () => '#999',
          strokeWidth: 2,
        }}
        bezier
        style={{ borderRadius: 8, marginHorizontal: 16 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>Bluetooth Arduino Monitor</Text>
        </View>

        <TouchableOpacity
          style={[styles.scanButton, isConnecting && styles.buttonDisabled]}
          onPress={scanDevices}
          disabled={isConnecting}>
          <Text style={styles.buttonText}>{isConnecting ? 'Connecting...' : 'Scan for Devices'}</Text>
        </TouchableOpacity>

        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={item => item.id}
          style={styles.deviceList}
        />

        {connectedDevice && (
          <View style={styles.connectedDevice}>
            <Text style={styles.connectedText}>Connected to: {connectedDevice.name}</Text>
            <TouchableOpacity style={styles.disconnectButton} onPress={disconnectDevice}>
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        )}

        {receivedData ? (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Received Data:</Text>
            <Text style={styles.dataText}>{receivedData}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#795548', marginHorizontal: 20 }]}
          onPress={async () => {
            const saved = await AsyncStorage.getItem('bluetooth_data');
            const parsed = saved ? JSON.parse(saved) : [];
            Alert.alert('Saved Data', JSON.stringify(parsed, null, 2));
          }}>
          <Text style={styles.buttonText}>View Saved Data</Text>
        </TouchableOpacity>

        <View style={{ marginBottom: 40 }}>
          <Text style={styles.chartHeader}>Live Charts</Text>
          {chartData.length > 0 ? (
            <>
              {renderChart('Temperature (°C)', chartData.map(d => d.temp))}
              {renderChart('Humidity (%)', chartData.map(d => d.humidity))}
              {renderChart('Pulse (BPM)', chartData.map(d => d.pulse))}
              {renderChart('ECG (mV)', chartData.map(d => d.ecg))}
            </>
          ) : (
            <Text style={{ textAlign: 'center', color: '#888' }}>No parsed data yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  button: { padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  scanButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', margin: 20 },
  deviceList: { marginHorizontal: 20 },
  deviceItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  deviceName: { fontSize: 16, fontWeight: '600' },
  deviceId: { fontSize: 14, color: '#666' },
  connectedDevice: { padding: 15, backgroundColor: '#E8F5E9', borderRadius: 8, margin: 20 },
  connectedText: { fontSize: 16, color: '#2E7D32', marginBottom: 10 },
  disconnectButton: { backgroundColor: '#F44336', padding: 10, borderRadius: 8, alignItems: 'center' },
  dataContainer: { margin: 20, padding: 15, backgroundColor: '#F5F5F5', borderRadius: 8 },
  dataTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  dataText: { fontSize: 14, color: '#333' },
  chartHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 30, textAlign: 'center' },
});

export default App;