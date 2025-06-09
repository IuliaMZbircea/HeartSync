import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  FlatList,
  View,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  ScrollView,
} from 'react-native';

import RNBluetoothClassic, { BluetoothDevice, BluetoothEventSubscription } from 'react-native-bluetooth-classic';

export default function App() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [receivedData, setReceivedData] = useState<string>('');
  const dataSubscription = useRef<BluetoothEventSubscription | null>(null);

  useEffect(() => {
    requestPermissions();

    return () => {
      dataSubscription.current?.remove();
    };
  }, []);

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        if (
          granted['android.permission.BLUETOOTH_SCAN'] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.BLUETOOTH_CONNECT'] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.ACCESS_FINE_LOCATION'] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          ToastAndroid.show('Bluetooth permissions are required', ToastAndroid.LONG);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  async function scanDevices() {
    try {
      const bonded = await RNBluetoothClassic.getBondedDevices();
      setDevices(bonded);
      ToastAndroid.show(`Found ${bonded.length} paired devices`, ToastAndroid.SHORT);
    } catch (error) {
      console.warn(error);
    }
  }

  async function connectToDevice(device: BluetoothDevice) {
    try {
      const connected = await device.connect();
      if (connected) {
        setConnectedDevice(device);
        ToastAndroid.show(`Connected to ${device.name}`, ToastAndroid.SHORT);

        // Listen for incoming data
        dataSubscription.current = device.onDataReceived((event) => {
          setReceivedData(prev => prev + event.data);
        });
        
      } else {
        ToastAndroid.show('Failed to connect', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  async function disconnect() {
    if (connectedDevice) {
      try {
        await connectedDevice.disconnect();
        ToastAndroid.show(`Disconnected from ${connectedDevice.name}`, ToastAndroid.SHORT);
        setConnectedDevice(null);
        setReceivedData('');
        dataSubscription.current?.remove();
      } catch (error) {
        console.warn(error);
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      {!connectedDevice && (
        <>
          <Button title="Scan Paired Bluetooth Devices" onPress={scanDevices} />
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text>{item.name || item.id}</Text>
                <Button title="Connect" onPress={() => connectToDevice(item)} />
              </View>
            )}
          />
        </>
      )}

      {connectedDevice && (
        <>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
            Connected to: {connectedDevice.name}
          </Text>
          <Button title="Disconnect" onPress={disconnect} />
          <ScrollView
            style={{ marginTop: 20, flex: 1, backgroundColor: '#eee', padding: 10 }}
          >
            <Text>{receivedData || 'Waiting for data...'}</Text>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
