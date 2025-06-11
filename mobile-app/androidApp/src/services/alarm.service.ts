import axios from 'axios';
import { ReactNode } from 'react';
import { Alert } from 'react-native';

// Replace 192.168.1.x with your actual IP address
const API_URL = 'https://1234-2a02-2f09-3315-ed00-74a3-304e-8145-9ebf.ngrok-free.app';

export interface Alarm {
  id?: number;
  patientId: number;
  parameter: string;
  conditionType: string;
  threshold: number;
  duration: number;
  afterActivity: boolean;
  message: string;
  isActive: boolean;
}

const AlertService = {


  error: (message: string | undefined) => {
    // Alert nativ
    Alert.alert('Oops! ❌', message);

    // Sau toast eroare (opțional)
    // Toast.show({
    //   type: 'error',
    //   text1: 'Oops! ❌',
    //   text2: message,
    //   position: 'top',
    //   visibilityTime: 2000,
    //   autoHide: true,
    // });
  },

getAlarms: async (): Promise<Alarm[]> => {
    try {
      console.log('Fetching alarms from:', API_URL);
      const response = await axios.get(API_URL);
      console.log('Alarms response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching alarms:', error);
      if (axios.isAxiosError(error)) {
        console.error('Details:', error.message, error.response?.data);
        if (error.response?.status === 404) {
          Alert.alert('Error', 'Alarms endpoint not found. Please check the API URL.');
        } else if (error.response?.status === 401) {
          Alert.alert('Error', 'Unauthorized. Please check your authentication.');
        } else {
          Alert.alert('Error', 'Failed to fetch alarms. Please try again later.');
        }
      }
      throw error;
    }
  
  },

  getAlarmById: async (id: number): Promise<Alarm> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching alarm ${id}:`, error);
      throw error;
    }
  },

  createAlarm: async (alarmData: Omit<Alarm, 'id'>): Promise<Alarm> => {
    try {
      const response = await axios.post(API_URL, alarmData);
      return response.data;
    } catch (error) {
      console.error('Error creating alarm:', error);
      throw error;
    }
  },

  updateAlarm: async (id: number, updatedData: Partial<Alarm>): Promise<Alarm> => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating alarm ${id}:`, error);
      throw error;
    }
  },

  deleteAlarm: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting alarm ${id}:`, error);
      throw error;
    }
  },

  async createTestAlarm() {
    try {
      const testAlarm: Omit<Alarm, 'id'> = {
        patientId: 1,
        parameter: 'pulse',
        conditionType: 'above',
        threshold: 100,
        duration: 300,
        afterActivity: false,
        message: 'High pulse rate detected',
        isActive: true
      };

      const response = await axios.post(`${API_URL}/custom-alarms`, testAlarm);
      console.log('Test alarm created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create test alarm:', error.response?.data || error.message);
      throw error;
    }
  },

  async getAllAlarms(): Promise<Alarm[]> {
    try {
      const response = await axios.get<Alarm[]>(`${API_URL}/custom-alarms`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching alarms:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default AlertService;
