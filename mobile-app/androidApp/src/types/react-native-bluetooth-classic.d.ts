declare module 'react-native-bluetooth-classic' {
  export interface BluetoothDevice {
    id: string;
    name: string;
    address: string;
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
    isConnected(): Promise<boolean>;
    onDataReceived(callback: (data: { data: string }) => void): void;
  }

  export interface BluetoothModule {
    isEnabled(): Promise<boolean>;
    enable(): Promise<boolean>;
    disable(): Promise<boolean>;
    getBondedDevices(): Promise<BluetoothDevice[]>;
  }

  const RNBluetoothClassic: BluetoothModule;
  export default RNBluetoothClassic;
} 