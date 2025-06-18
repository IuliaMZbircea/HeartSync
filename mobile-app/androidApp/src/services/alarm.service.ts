import axios from 'axios';
import { ReactNode } from 'react';
import { Alert } from 'react-native';

// API URL for thresholds
const API_URL = 'https://d6b6-193-226-8-99.ngrok-free.app/thresholds';

export interface Alarm {
  id?: number;
  patient_id: number;
  parameter: string;
  minValue: number;
  maxValue: number;
  durationMinutes: number;
  message: string;
  isActive: boolean;
  createdAt?: string;
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
      const response = await axios.get<Alarm[]>(API_URL);
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
      const response = await axios.get<Alarm>(`${API_URL}${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching alarm ${id}:`, error);
      throw error;
    }
  },

  createAlarm: async (alarmData: Omit<Alarm, 'id' | 'createdAt'>): Promise<Alarm> => {
    try {
      const response = await axios.post<Alarm>(API_URL, alarmData);
      return response.data;
    } catch (error) {
      console.error('Error creating alarm:', error);
      throw error;
    }
  },

  updateAlarm: async (id: number, updatedData: Partial<Alarm>): Promise<Alarm> => {
    try {
      const response = await axios.put<Alarm>(`${API_URL}${id}/`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating alarm ${id}:`, error);
      throw error;
    }
  },

  deleteAlarm: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}${id}/`);
    } catch (error) {
      console.error(`Error deleting alarm ${id}:`, error);
      throw error;
    }
  },

  async createTestAlarm() {
    try {
      const testAlarm: Omit<Alarm, 'id' | 'createdAt'> = {
        patient_id: 1,
        parameter: 'pulse',
        minValue: 50,
        maxValue: 100,
        durationMinutes: 2,
        message: 'Pulse out of safe range for over 2 minutes',
        isActive: true
      };

      const response = await axios.post<Alarm>(API_URL, testAlarm);
      console.log('Test alarm created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create test alarm:', error.response?.data || error.message);
      throw error;
    }
  },

  async getAllAlarms(): Promise<Alarm[]> {
    try {
      const response = await axios.get<Alarm[]>(API_URL);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching alarms:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default AlertService;
