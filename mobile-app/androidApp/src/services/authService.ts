import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://1234-2a02-2f09-3315-ed00-74a3-304e-8145-9ebf.ngrok-free.app';

// Default token for patient ID 1
const DEFAULT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MTAzMjY4MDAsImV4cCI6MTcxMDkzMTYwMCwicm9sZXMiOlsiUk9MRV9QQVRJRU5UIl0sInVzZXJuYW1lIjoicGF0aWVudEBleGFtcGxlLmNvbSJ9.XyZ123...'; // Replace with your actual token

class AuthService {
  constructor() {
    this.initializeDefaultToken();
  }

  private async initializeDefaultToken() {
    try {
      await AsyncStorage.clear(); // Clear any old tokens
      await this.setToken(DEFAULT_TOKEN);
    } catch (error) {
      console.error('Failed to initialize token:', error);
    }
  }

  async login(email: string = 'patient@example.com', password: string = 'password123') {
    try {
      const response = await axios.post(`${API_URL}/login_check`, {
        username: email,
        password: password
      });

      if (response.data.token) {
        await this.setToken(response.data.token);
        console.log('Login successful, token stored');
        return response.data;
      }
      throw new Error('No token received');
    } catch (error) {
      console.error('Login failed:', error);
      // Don't fallback to default token on login failure
      throw error;
    }
  }

  async logout() {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  private async setToken(token: string) {
    await AsyncStorage.setItem('token', token);
  }

  async getToken() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No token found, attempting login...');
        await this.login();
        return await AsyncStorage.getItem('token');
      }
      return token;
    } catch (error) {
      console.error('Failed to get token:', error);
      throw error;
    }
  }
}

export default new AuthService(); 