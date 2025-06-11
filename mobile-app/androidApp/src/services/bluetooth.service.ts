import BluetoothSerial from 'react-native-bluetooth-serial';
import axios from 'axios';

const API_URL = 'https://1234-2a02-2f09-3315-ed00-74a3-304e-8145-9ebf.ngrok-free.app';

// Debug flag - set to true to see detailed logs
const DEBUG = true;

class BluetoothService {
  private isConnected: boolean = false;
  private connectedDevice: any = null;
  private dataListener: any = null;
  private dataBuffer: string = '';

  private log(...args: any[]) {
    if (DEBUG) {
      console.log('[BluetoothService]', ...args);
    }
  }

  private logError(...args: any[]) {
    if (DEBUG) {
      console.error('[BluetoothService]', ...args);
    }
  }

  async initialize(): Promise<void> {
    try {
      await BluetoothSerial.requestEnable();
      const enabled = await BluetoothSerial.isEnabled();
      if (!enabled) {
        throw new Error('Bluetooth is not enabled');
      }
      this.log('Bluetooth initialized successfully');
    } catch (error) {
      this.logError('Error initializing Bluetooth:', error);
      throw error;
    }
  }

  async listDevices(): Promise<any[]> {
    try {
      const devices = await BluetoothSerial.list();
      this.log('Found devices:', devices);
      const rn42Devices = devices.filter(device => device.name?.includes('RN42'));
      this.log('RN42 devices:', rn42Devices);
      return rn42Devices;
    } catch (error) {
      this.logError('Error listing devices:', error);
      throw error;
    }
  }

  async connectToDevice(deviceId: string): Promise<void> {
    try {
      this.log('Connecting to device:', deviceId);
      await BluetoothSerial.connect(deviceId);
      this.isConnected = true;
      this.connectedDevice = deviceId;
      this.log('Connected to device');
      this.startListening();
    } catch (error) {
      this.logError('Connection error:', error);
      throw error;
    }
  }

  private startListening(): void {
    if (this.dataListener) {
      this.dataListener.remove();
    }

    this.dataBuffer = ''; // Reset buffer on new connection
    
    this.dataListener = BluetoothSerial.addListener('read', (data) => {
      this.log('Raw data received:', data);
      this.processIncomingData(data.data);
    });

    BluetoothSerial.withDelimiter('\r\n').then(() => {
      this.log('Delimiter set, ready for data');
    });
  }

  private processIncomingData(newData: string): void {
    this.dataBuffer += newData;
    
    // Split by delimiter and process each complete message
    const messages = this.dataBuffer.split('\r\n');
    
    // Keep the last incomplete message in the buffer
    this.dataBuffer = messages.pop() || '';
    
    // Process complete messages
    for (const message of messages) {
      if (message.trim()) {
        this.log('Processing complete message:', message);
        this.processData(message.trim());
      }
    }
  }

  private async processData(data: string): Promise<void> {
    try {
      this.log('Processing data:', data);
      const decodedData = this.decodeData(data);
      
      if (!decodedData) {
        this.logError('Failed to decode data:', data);
        return;
      }

      const { type, value, timestamp } = decodedData;
      const endpoint = `${API_URL}/custom-${type}`;
      const payload = {
        patient_id: 1,
        value,
        timestamp,
        source: 'RN42'
      };
      
      this.log('Sending to endpoint:', endpoint);
      this.log('Payload:', payload);

      try {
        const response = await axios.post(endpoint, payload, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        });
        
        this.log(`${type} data sent successfully:`, response.status);
        this.log('Response:', response.data);
      } catch (error: any) {
        this.logError(`Error sending ${type} data:`, error.message);
        if (error.response) {
          this.logError('Response error:', {
            status: error.response.status,
            data: error.response.data
          });
        } else if (error.request) {
          this.logError('No response received:', error.request);
        }
        throw error;
      }
    } catch (error) {
      this.logError('Error in processData:', error);
    }
  }

  private decodeData(data: string): { type: string; value: number; timestamp: string } | null {
    try {
      this.log('Decoding data:', data);
      
      // Expected format: "TYPE:VALUE"
      const [type, rawValue] = data.trim().split(':');
      
      if (!type || !rawValue) {
        this.logError('Invalid data format:', data);
        return null;
      }

      // Map the type to endpoint name
      const typeMap: { [key: string]: string } = {
        'PULSE': 'pulse',
        'TEMP': 'temperature',
        'HUM': 'humidity'
      };

      const mappedType = typeMap[type];
      if (!mappedType) {
        this.logError('Unknown data type:', type);
        return null;
      }

      const numericValue = parseFloat(rawValue);
      if (isNaN(numericValue)) {
        this.logError('Invalid numeric value:', rawValue);
        return null;
      }

      const result = {
        type: mappedType,
        value: numericValue,
        timestamp: new Date().toISOString()
      };

      this.log('Decoded data:', result);
      return result;
    } catch (error) {
      this.logError('Error decoding data:', error);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        if (this.dataListener) {
          this.dataListener.remove();
          this.dataListener = null;
        }

        await BluetoothSerial.disconnect();
        this.isConnected = false;
        this.connectedDevice = null;
        this.dataBuffer = '';
        this.log('Disconnected from device');
      } catch (error) {
        this.logError('Error disconnecting:', error);
        throw error;
      }
    }
  }

  isDeviceConnected(): boolean {
    return this.isConnected;
  }

  // Test method to verify data processing
  async testDataProcessing(testData: string): Promise<void> {
    this.log('Testing data processing with:', testData);
    await this.processData(testData);
  }
}

export default new BluetoothService(); 