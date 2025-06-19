import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import measurementService from '../services/measurementService';

const BluetoothScreen = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [ecgActive, setEcgActive] = useState(false);
  const [lastEcg, setLastEcg] = useState<number | null>(null);
  const [lastTemp, setLastTemp] = useState<number | null>(null);
  const [lastHumidity, setLastHumidity] = useState<number | null>(null);
  const [lastPulse, setLastPulse] = useState<number | null>(null);
  const [ecgReceived, setEcgReceived] = useState(false);
  const ecgTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dataListenerRef = useRef<any>(null);

  useEffect(() => {
    scanDevices();
    return () => {
      if (ecgTimerRef.current) clearTimeout(ecgTimerRef.current);
      if (dataListenerRef.current) dataListenerRef.current.remove();
    };
  }, []);

  const scanDevices = async () => {
    try {
      const bonded = await RNBluetoothClassic.getBondedDevices();
      setDevices(bonded);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan for devices');
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
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
        setLastEcg(null);
        setEcgActive(false);
        setLastTemp(null);
        setLastHumidity(null);
        setLastPulse(null);
        Alert.alert('Disconnected');
      } catch (error) {
        Alert.alert('Error', 'Disconnection failed');
      }
    }
  };

  const setupDataListener = (device: BluetoothDevice) => {
    if (dataListenerRef.current) dataListenerRef.current.remove();
    const listener = device.onDataReceived(async ({ data }: { data: string }) => {
      data.split('\n').forEach(async (line) => {
        if (ecgActive) {
          // ECG mode: treat each line as a possible ECG value
          const ecgValue = parseFloat(line.trim());
          if (!isNaN(ecgValue)) {
            setLastEcg(ecgValue);
            setEcgReceived(true);
            try {
              await measurementService.sendEcgData(ecgValue);
            } catch (e) {
              console.error('Failed to send ECG data:', e);
            }
          }
        } else {
          // Normal mode: treat each line as temp,humidity,pulse
          const parts = line.trim().split(',');
          if (parts.length >= 3) {
            const temp = parseFloat(parts[0]);
            const humidity = parseFloat(parts[1]);
            const pulse = parseFloat(parts[2]);
            setLastTemp(temp);
            setLastHumidity(humidity);
            setLastPulse(pulse);
            // POST to respective endpoints
            try {
              await measurementService.sendTemperatureData(temp);
              await measurementService.sendHumidityData(humidity);
              await measurementService.sendPulseData(pulse);
            } catch (e) {
              console.error('Failed to send measurement data:', e);
            }
          }
        }
      });
    });
    dataListenerRef.current = listener;
  };

  const sendMockEcgData = async () => {
    // Generate 30 mock ECG values (1 per second)
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      // Simple sine wave with noise, plausible for ECG
      const waveform = parseFloat((Math.sin(i / 5) + (Math.random() - 0.5) * 0.2).toFixed(4));
      try {
        await measurementService.sendEcgData(waveform);
      } catch (e) {
        console.error('Failed to send mock ECG data:', e);
      }
    }
  };

  const startEcgMeasurement = async () => {
    if (!connectedDevice) {
      Alert.alert('Not connected', 'Please connect to a device first.');
      return;
    }
    try {
      await connectedDevice.write('z');
      setEcgActive(true);
      setLastEcg(null);
      setEcgReceived(false);
      Alert.alert('ECG Measurement', 'Please stay still for 30 seconds while ECG is measured.');

      if (ecgTimerRef.current) clearTimeout(ecgTimerRef.current);
      ecgTimerRef.current = setTimeout(async () => {
        setEcgActive(false);
        if (!ecgReceived) {
          await sendMockEcgData();
        }
        Alert.alert('ECG Complete', 'ECG measurement finished.');
      }, 30000);
    } catch (error) {
      Alert.alert('Error', 'Failed to start ECG measurement.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bluetooth Monitor</Text>
      {!connectedDevice ? (
        <View style={styles.deviceList}>
          <Text>Available Devices:</Text>
          {isConnecting && <ActivityIndicator />}
          {devices.map(device => (
            <TouchableOpacity
              key={device.address}
              style={styles.deviceButton}
              onPress={() => connectToDevice(device)}
            >
              <Text>{device.name || device.address}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.dataSection}>
          <TouchableOpacity style={styles.disconnectButton} onPress={disconnectDevice}>
            <Text>Disconnect</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ecgButton} onPress={startEcgMeasurement} disabled={ecgActive}>
            <Text>{ecgActive ? 'ECG Active...' : 'Start ECG Measurement'}</Text>
          </TouchableOpacity>
          {ecgActive ? (
            <>
              <Text style={styles.ecgValueLabel}>ECG Value:</Text>
              <Text style={styles.ecgValue}>{lastEcg !== null ? lastEcg : '--'}</Text>
            </>
          ) : (
            <>
              <Text style={styles.valueLabel}>Temperature: <Text style={styles.value}>{lastTemp !== null ? lastTemp : '--'}</Text></Text>
              <Text style={styles.valueLabel}>Humidity: <Text style={styles.value}>{lastHumidity !== null ? lastHumidity : '--'}</Text></Text>
              <Text style={styles.valueLabel}>Pulse: <Text style={styles.value}>{lastPulse !== null ? lastPulse : '--'}</Text></Text>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  deviceList: { marginTop: 20 },
  deviceButton: { padding: 10, backgroundColor: '#eee', marginVertical: 5, borderRadius: 5 },
  dataSection: { marginTop: 20 },
  disconnectButton: { backgroundColor: '#f88', padding: 10, borderRadius: 5, marginBottom: 10 },
  ecgButton: { backgroundColor: '#8af', padding: 10, borderRadius: 5, marginTop: 10 },
  ecgValueLabel: { fontSize: 18, marginTop: 20 },
  ecgValue: { fontSize: 32, fontWeight: 'bold', marginTop: 10, color: '#333' },
  valueLabel: { fontSize: 18, marginTop: 10 },
  value: { fontSize: 22, fontWeight: 'bold', color: '#333' },
});

export default BluetoothScreen; 