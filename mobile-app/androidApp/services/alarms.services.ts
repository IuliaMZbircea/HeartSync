import axios from 'axios';
import { Platform } from 'react-native';

// Use ngrok URL for all platforms
const API_URL = 'https://bfa6-46-97-168-171.ngrok-free.app/custom-alarms';

console.log('Current platform:', Platform.OS);
console.log('Using API URL:', API_URL);

// Configure axios defaults
axios.defaults.timeout = 5000; // 5 seconds timeout
axios.defaults.headers.common['Accept'] = 'application/json';

export interface Alarm {
  id: number;
  patientId: number;
  type: string;
  parameter: string;
  conditionType: string;
  threshold: number;
  message: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  afterActivity: any;
}

const AlertService = {
  getAlarms: async (): Promise<Alarm[]> => {
    try {
      console.log('Attempting to fetch alarms from:', API_URL);
      const response = await axios.get(API_URL, {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Alarms data:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('Error fetching alarms:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          code: error.code
        });
        if (error.code === 'ECONNABORTED') {
          throw new Error('Connection timed out. Please check your network connection.');
        } else if (error.response?.status === 404) {
          throw new Error('Alarms endpoint not found. Please check the API URL.');
        } else if (error.response?.status === 401) {
          throw new Error('Unauthorized. Please check your authentication.');
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
  }
};

export default AlertService;
