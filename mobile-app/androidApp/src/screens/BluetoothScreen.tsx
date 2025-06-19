import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
import measurementService from '../services/measurementService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Animated } from 'react-native';

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
  const [ecgTimeLeft, setEcgTimeLeft] = useState(30);
  const ecgTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dataListenerRef = useRef<any>(null);
  const ecgIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const ecgActiveRef = useRef(ecgActive);
  const [ecgValues, setEcgValues] = useState<number[]>([]);
  const [ecgResult, setEcgResult] = useState<string | null>(null);
  const [progress, setProgress] = useState(new Animated.Value(1));

  useEffect(() => {
    scanDevices();
    // If already connected, set up listener
    if (connectedDevice) {
      setupDataListener(connectedDevice);
    }
    return () => {
      if (ecgTimerRef.current) clearTimeout(ecgTimerRef.current);
      if (dataListenerRef.current) dataListenerRef.current.remove();
      if (ecgIntervalRef.current) clearInterval(ecgIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    ecgActiveRef.current = ecgActive;
  }, [ecgActive]);

  useEffect(() => {
      if (ecgActive) {
      setEcgResult(null);
      setEcgTimeLeft(30);
      Animated.timing(progress, {
        toValue: 0,
        duration: 30000,
        useNativeDriver: false,
      }).start();
      } else {
      setEcgTimeLeft(30);
      progress.setValue(1);
    }
  }, [ecgActive]);

  // Whenever connectedDevice changes, set up the listener
  useEffect(() => {
    if (connectedDevice) {
      console.log('Setting up data listener for device:', connectedDevice.name || connectedDevice.address);
      setupDataListener(connectedDevice);
    }
  }, [connectedDevice]);

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
      console.log('Bluetooth data event:', data, 'ecgActive:', ecgActiveRef.current);
      data.split('\n').forEach(async (line) => {
        if (ecgActiveRef.current) {
          // ECG mode: ONLY process ECG values, ignore other data
          const trimmed = line.trim();
          if (isValidNumber(trimmed)) {
            const ecgValue = parseFloat(trimmed);
            setLastEcg(ecgValue);
            setEcgReceived(true);
            setEcgValues(prev => [...prev, ecgValue]);
            console.log('Posting ECG value:', ecgValue);
            measurementService.sendEcgData(ecgValue).catch(e => console.error('Failed to send ECG data:', e));
          }
        } else {
          // Normal mode: ONLY process temp,humidity,pulse, ignore other data
          const parts = line.trim().split(',');
          if (parts.length >= 3 && isValidNumber(parts[0]) && isValidNumber(parts[1]) && isValidNumber(parts[2])) {
            const temp = parseFloat(parts[0]);
            const humidity = parseFloat(parts[1]);
            const pulse = parseFloat(parts[2]);
            setLastTemp(temp);
            setLastHumidity(humidity);
            setLastPulse(pulse);
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
        // Analyze ECG after measurement
        const result = analyzeEcg(ecgValues);
        setEcgResult(result);
        if (result === 'good') {
          Alert.alert('ECG Result', 'ECG is good.');
        } else if (result === 'bad') {
          Alert.alert('ECG Result', 'ECG is bad. Please consult a doctor.');
        } else {
          Alert.alert('ECG Result', 'Insufficient ECG data.');
        }
        setEcgValues([]);
            Alert.alert('ECG Complete', 'ECG measurement finished.');
      }, 30000);
    } catch (error) {
      Alert.alert('Error', 'Failed to start ECG measurement.');
    }
  };

  const analyzeEcg = (values: number[]) => {
    if (values.length < 10) return 'Insufficient data';
    // Example: mean close to 0, stddev in plausible range
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stddev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
    // Typical ECG: mean ~0, stddev between 0.1 and 1.5 (arbitrary for demo)
    if (Math.abs(mean) < 0.2 && stddev > 0.1 && stddev < 1.5) {
      return 'good';
    } else {
      return 'bad';
    }
  };

  // Helper to check if a string is a valid number
  const isValidNumber = (str: string) => {
    if (!str) return false;
    return /^-?\d*\.?\d+$/.test(str.trim());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Ionicons name="bluetooth" size={28} color="#007AFF" style={{ marginRight: 8 }} />
          <Text style={styles.title}>Bluetooth Monitor</Text>
        </View>
      {!connectedDevice ? (
        <View style={styles.deviceListCard}>
          <Text style={styles.deviceListTitle}>Available Devices:</Text>
          {isConnecting && <ActivityIndicator />}
          {devices.map(device => (
        <TouchableOpacity
              key={device.address}
              style={styles.deviceButton}
              onPress={() => connectToDevice(device)}
            >
              <Text style={styles.deviceButtonText}>{device.name || device.address}</Text>
            </TouchableOpacity>
          ))}
          </View>
      ) : (
        <View style={[styles.dataSectionCard, ecgActive && styles.ecgModeBg]}> 
          <TouchableOpacity style={styles.disconnectButton} onPress={disconnectDevice}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ecgButton, ecgActive && styles.ecgButtonDisabled]} onPress={startEcgMeasurement} disabled={ecgActive}>
            <Ionicons name="pulse-outline" size={18} color="#fff" />
            <Text style={styles.ecgButtonText}>{ecgActive ? 'ECG Active...' : 'Start ECG Measurement'}</Text>
          </TouchableOpacity>
          {ecgActive ? (
            <>
              <Text style={styles.ecgMessage}>ECG measurement in progress. Please stay still.</Text>
              <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
              </View>
              <Text style={styles.ecgTimer}>Time left: {ecgTimeLeft}s</Text>
              <Text style={styles.ecgValueLabel}>ECG Value:</Text>
              <Text style={styles.ecgValue}>{lastEcg !== null ? lastEcg : '--'}</Text>
              {ecgResult && (
                <Text style={[styles.ecgResult, ecgResult === 'good' ? styles.ecgGood : styles.ecgBad]}>
                  {ecgResult === 'good' ? 'ECG is good.' : ecgResult === 'bad' ? 'ECG is bad. Please consult a doctor.' : 'Insufficient ECG data.'}
                </Text>
              )}
            </>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, backgroundColor: '#f6f8fa' },
  headerBar: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0', elevation: 2 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  deviceListCard: { margin: 24, padding: 20, backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  deviceListTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  deviceButton: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#e3eaff', marginVertical: 6, borderRadius: 8, justifyContent: 'center' },
  deviceButtonText: { fontSize: 16, color: '#007AFF', fontWeight: '500' },
  dataSectionCard: { margin: 24, padding: 24, backgroundColor: '#fff', borderRadius: 18, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, alignItems: 'center' },
  ecgModeBg: { backgroundColor: '#eaf6ff' },
  disconnectButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f44', padding: 10, borderRadius: 8, marginBottom: 12, alignSelf: 'stretch', justifyContent: 'center' },
  disconnectButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  ecgButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginTop: 4, marginBottom: 18, alignSelf: 'stretch', justifyContent: 'center' },
  ecgButtonDisabled: { backgroundColor: '#b0c4de' },
  ecgButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  ecgMessage: { fontSize: 16, color: '#555', marginTop: 10, textAlign: 'center' },
  progressBarContainer: { width: '100%', height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, marginTop: 16, marginBottom: 8, overflow: 'hidden' },
  progressBar: { height: 10, backgroundColor: '#007AFF', borderRadius: 5 },
  ecgTimer: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginTop: 6, textAlign: 'center' },
  ecgValueLabel: { fontSize: 18, marginTop: 18 },
  ecgValue: { fontSize: 36, fontWeight: 'bold', marginTop: 8, color: '#333', textAlign: 'center' },
  ecgResult: { fontSize: 18, fontWeight: 'bold', marginTop: 18, textAlign: 'center' },
  ecgGood: { color: '#1db954' },
  ecgBad: { color: '#e53935' },
  valueLabel: { fontSize: 18, marginTop: 10 },
  value: { fontSize: 22, fontWeight: 'bold', color: '#333' },
});

export default BluetoothScreen; 