import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://3cb8-2a02-2f09-3315-ed00-49cd-75b1-83fa-1bcc.ngrok-free.app';

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