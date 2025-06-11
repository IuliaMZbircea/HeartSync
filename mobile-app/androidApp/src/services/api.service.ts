import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://1234-2a02-2f09-3315-ed00-74a3-304e-8145-9ebf.ngrok-free.app';

class ApiService {
  async get<T>(endpoint: string): Promise<AxiosResponse<T>> {
    const token = await AsyncStorage.getItem('token');
    return axios.get(`${BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async post<T>(endpoint: string, data: any): Promise<AxiosResponse<T>> {
    const token = await AsyncStorage.getItem('token');
    return axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async put<T>(endpoint: string, data: any): Promise<AxiosResponse<T>> {
    const token = await AsyncStorage.getItem('token');
    return axios.put(`${BASE_URL}${endpoint}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}

export default new ApiService(); 