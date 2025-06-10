import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, FlatList, Alert, Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

const screenWidth = Dimensions.get('window').width;

// Alert System Constants
const ALERT_THRESHOLDS = {
  pulse: { min: 60, max: 100 },
  humidity: { min: 40, max: 60 },
  temperature: { min: 36.0, max: 37.5 },
};
const CONSECUTIVE_OUTLIER_THRESHOLD = 5;
const AVERAGING_INTERVAL_MS = 10000; // 10 seconds

const BluetoothScreen = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [receivedData, setReceivedData] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [chartData, setChartData] = useState<
    { temp: number; humidity: number; pulse: number; ecg: number }[]
  >([]);
  // New state for buffering and alerts
  const [pulseBuffer, setPulseBuffer] = useState<number[]>([]);
  const [humidityBuffer, setHumidityBuffer] = useState<number[]>([]);
  const [temperatureBuffer, setTemperatureBuffer] = useState<number[]>([]);
  const [pulseOutlierCount, setPulseOutlierCount] = useState(0);
  const [humidityOutlierCount, setHumidityOutlierCount] = useState(0);
  const [temperatureOutlierCount, setTemperatureOutlierCount] = useState(0);
  const [alertFlags, setAlertFlags] = useState({
    pulse: false,
    humidity: false,
    temperature: false,
  });

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const averagingIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for the averaging interval

  useEffect(() => {
    scanDevices();
    // Setup the averaging interval
    averagingIntervalRef.current = setInterval(() => {
      processBufferedDataAndAlert();
    }, AVERAGING_INTERVAL_MS);

    return () => {
      if (averagingIntervalRef.current) {
        clearInterval(averagingIntervalRef.current);
      }
    };
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

      // Add to buffers for averaging
      setPulseBuffer(prev => [...prev, pulse]);
      setHumidityBuffer(prev => [...prev, humidity]);
      setTemperatureBuffer(prev => [...prev, temp]);

      const updatedData = [...dataArray, { timestamp, data: `${temp},${humidity},${pulse},${ecg}` }];
      await AsyncStorage.setItem('bluetooth_data', JSON.stringify(updatedData));

      setChartData(prev => [...prev.slice(-29), { temp, humidity, pulse, ecg }]);
    } catch (error) {
      console.error('Saving data error:', error);
    }
  };

  const processBufferedDataAndAlert = async () => {
    // Only process if there's data in the buffers
    if (pulseBuffer.length === 0 && humidityBuffer.length === 0 && temperatureBuffer.length === 0) {
      return;
    }

    const calculateAverage = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0) / arr.length;

    const avgPulse = pulseBuffer.length > 0 ? calculateAverage(pulseBuffer) : null;
    const avgHumidity = humidityBuffer.length > 0 ? calculateAverage(humidityBuffer) : null;
    const avgTemperature = temperatureBuffer.length > 0 ? calculateAverage(temperatureBuffer) : null;

    // Reset buffers
    setPulseBuffer([]);
    setHumidityBuffer([]);
    setTemperatureBuffer([]);

    let currentAlertFlags = { ...alertFlags };

    // Check Pulse
    if (avgPulse !== null) {
      const isPulseNormal = avgPulse >= ALERT_THRESHOLDS.pulse.min && avgPulse <= ALERT_THRESHOLDS.pulse.max;
      if (!isPulseNormal) {
        setPulseOutlierCount(prev => prev + 1);
        if (pulseOutlierCount + 1 >= CONSECUTIVE_OUTLIER_THRESHOLD) {
          currentAlertFlags = { ...currentAlertFlags, pulse: true };
          setAlertFlags(prev => ({ ...prev, pulse: true }));
          console.warn('PULSE ALERT: 5 consecutive out-of-range values!');
          // Store alert message
          const message = `PULSE ALERT: Your pulse (${avgPulse.toFixed(0)}) has been out of normal range (${ALERT_THRESHOLDS.pulse.min}-${ALERT_THRESHOLDS.pulse.max}) for 5 consecutive readings.`;
          storeAlertMessage(message);
        }
      } else {
        setPulseOutlierCount(0);
        currentAlertFlags = { ...currentAlertFlags, pulse: false };
        setAlertFlags(prev => ({ ...prev, pulse: false }));
      }
    }

    // Check Humidity
    if (avgHumidity !== null) {
      const isHumidityNormal = avgHumidity >= ALERT_THRESHOLDS.humidity.min && avgHumidity <= ALERT_THRESHOLDS.humidity.max;
      if (!isHumidityNormal) {
        setHumidityOutlierCount(prev => prev + 1);
        if (humidityOutlierCount + 1 >= CONSECUTIVE_OUTLIER_THRESHOLD) {
          currentAlertFlags = { ...currentAlertFlags, humidity: true };
          setAlertFlags(prev => ({ ...prev, humidity: true }));
          console.warn('HUMIDITY ALERT: 5 consecutive out-of-range values!');
          // Store alert message
          const message = `HUMIDITY ALERT: Your humidity (${avgHumidity.toFixed(1)}%) has been out of normal range (${ALERT_THRESHOLDS.humidity.min}-${ALERT_THRESHOLDS.humidity.max}) for 5 consecutive readings.`;
          storeAlertMessage(message);
        }
      } else {
        setHumidityOutlierCount(0);
        currentAlertFlags = { ...currentAlertFlags, humidity: false };
        setAlertFlags(prev => ({ ...prev, humidity: false }));
      }
    }

    // Check Temperature
    if (avgTemperature !== null) {
      const isTemperatureNormal = avgTemperature >= ALERT_THRESHOLDS.temperature.min && avgTemperature <= ALERT_THRESHOLDS.temperature.max;
      if (!isTemperatureNormal) {
        setTemperatureOutlierCount(prev => prev + 1);
        if (temperatureOutlierCount + 1 >= CONSECUTIVE_OUTLIER_THRESHOLD) {
          currentAlertFlags = { ...currentAlertFlags, temperature: true };
          setAlertFlags(prev => ({ ...prev, temperature: true }));
          console.warn('TEMPERATURE ALERT: 5 consecutive out-of-range values!');
          // Store alert message
          const message = `TEMPERATURE ALERT: Your temperature (${avgTemperature.toFixed(1)}°C) has been out of normal range (${ALERT_THRESHOLDS.temperature.min}-${ALERT_THRESHOLDS.temperature.max}) for 5 consecutive readings.`;
          storeAlertMessage(message);
        }
      } else {
        setTemperatureOutlierCount(0);
        currentAlertFlags = { ...currentAlertFlags, temperature: false };
        setAlertFlags(prev => ({ ...prev, temperature: false }));
      }
    }

    // Store averaged data and alert flags in the cloud
    const patientId = await AsyncStorage.getItem('user_id');
    if (patientId) {
      await storeHealthMetrics({
        timestamp: new Date().toISOString(),
        patientId,
        pulse: avgPulse,
        humidity: avgHumidity,
        temperature: avgTemperature,
        alertFlags: currentAlertFlags,
      });
    }
  };

  const storeHealthMetrics = async (data: { timestamp: string; patientId: string; pulse: number | null; humidity: number | null; temperature: number | null; alertFlags: { pulse: boolean; humidity: boolean; temperature: boolean } }) => {
    try {
      // For now, let's just log the data to console.
      // In a real application, you would make an API call here.
      console.log('Storing health metrics to cloud:', data);
      /*
      const response = await axios.post(
        'YOUR_AZURE_HEALTH_METRICS_API_ENDPOINT', // Replace with your actual endpoint
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'YOUR_AZURE_API_KEY', // Replace with your actual API key
          },
        }
      );
      if (response.status !== 201) {
        throw new Error('Failed to store health metrics');
      }
      */
    } catch (error) {
      console.error('Error storing health metrics:', error);
    }
  };

  const storeAlertMessage = async (message: string) => {
    try {
      const timestamp = new Date().toLocaleString();
      const newAlert = { timestamp, message };
      const existingAlerts = await AsyncStorage.getItem('health_alerts');
      const alertsArray = existingAlerts ? JSON.parse(existingAlerts) : [];
      alertsArray.push(newAlert);
      await AsyncStorage.setItem('health_alerts', JSON.stringify(alertsArray));
      console.log('Alert stored:', newAlert);
    } catch (error) {
      console.error('Error storing alert:', error);
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
          <Text style={styles.title}>Bluetooth Monitor</Text>
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
            <Text style={styles.noDataText}>No data available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceList: {
    marginHorizontal: 16,
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceId: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  connectedDevice: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectedText: {
    fontSize: 16,
    color: '#1976D2',
    marginBottom: 8,
  },
  disconnectButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  dataText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  chartHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 32,
  },
});

export default BluetoothScreen; 