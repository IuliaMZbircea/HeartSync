declare module 'react-native-bluetooth-serial' {
  interface BluetoothDevice {
    id: string;
    name: string;
    address: string;
  }

  interface BluetoothSerial {
    requestEnable(): unknown;
    addListener(arg0: string, arg1: (data: any) => void): any;
    withDelimiter(arg0: string): unknown;
    isEnabled(): Promise<boolean>;
    enable(): Promise<boolean>;
    disable(): Promise<boolean>;
    list(): Promise<BluetoothDevice[]>;
    connect(id: string): Promise<boolean>;
    disconnect(): Promise<boolean>;
    on(event: 'read', callback: (data: string) => void): { remove: () => void };
  }

  const BluetoothSerial: BluetoothSerial;
  export default BluetoothSerial;
} 