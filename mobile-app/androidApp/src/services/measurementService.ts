import axios from 'axios';
import authService from './authService';

const API_URL = 'https://1234-2a02-2f09-3315-ed00-74a3-304e-8145-9ebf.ngrok-free.app';

// Thresholds for normal ranges
const NORMAL_RANGES = {
  pulse: { min: 60, max: 100 },
  temperature: { min: 36.0, max: 37.5 },
  humidity: { min: 40, max: 60 }
};

// Counter for consecutive out-of-range values
const outOfRangeCounter = {
  pulse: 0,
  temperature: 0,
  humidity: 0
};

interface Measurement {
  patient_id: number;
  value: number;
  timestamp: string;
}

class MeasurementService {
  private lastPulseValue: number = 75; // Starting with a reasonable pulse value
  private maxPulseChange: number = 5; // Maximum change between consecutive readings

  private checkRange(value: number, type: 'pulse' | 'temperature' | 'humidity'): boolean {
    const range = NORMAL_RANGES[type];
    const isNormal = value >= range.min && value <= range.max;
    
    if (!isNormal) {
      outOfRangeCounter[type]++;
    } else {
      outOfRangeCounter[type] = 0;
    }

    return outOfRangeCounter[type] >= 5;
  }

  async sendPulse(value: number) {
    const measurement: Measurement = {
      patient_id: 1,
      value: value,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post(`${API_URL}/pulse`, measurement);
      return response.data;
    } catch (error: any) {
      console.error('Error sending pulse data:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendTemperature(value: number) {
    const measurement: Measurement = {
      patient_id: 1,
      value: value,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post(`${API_URL}/temperature`, measurement);
      return response.data;
    } catch (error: any) {
      console.error('Error sending temperature data:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendHumidity(value: number) {
    const measurement: Measurement = {
      patient_id: 1,
      value: value,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post(`${API_URL}/humidity`, measurement);
      return response.data;
    } catch (error: any) {
      console.error('Error sending humidity data:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generate a more realistic pulse value that changes gradually
  generateRealisticPulseValue(): number {
    // Generate a random change within our maxPulseChange limit
    const change = (Math.random() * 2 - 1) * this.maxPulseChange;
    
    // Calculate new value
    let newValue = this.lastPulseValue + change;
    
    // Keep the pulse within realistic bounds (60-100 bpm for resting heart rate)
    if (newValue < 60) newValue = 60 + Math.random() * 5;
    if (newValue > 100) newValue = 100 - Math.random() * 5;
    
    // Store this value for next time
    this.lastPulseValue = newValue;
    
    // Return rounded value
    return Math.round(newValue);
  }

  async getPulseData() {
    try {
      const response = await axios.get(`${API_URL}/pulse`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get pulse data:', error.response?.data || error.message);
      throw error;
    }
  }

  async verifyApiAccess() {
    try {
      const token = await authService.getToken();
      if (!token) {
        return { success: false, message: 'No authentication token found' };
      }

      const response = await axios.get(`${API_URL}/pulse`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to verify API access'
      };
    }
  }

  async testApiAccess() {
    try {
      const token = await authService.getToken();
      console.log('Using token:', token);

      const response = await axios.get(`${API_URL}/pulse`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Access successful:', response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('API Access failed:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        error: error.message
      });
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  }

  async sendTemperatureData(value: number): Promise<void> {
    try {
      const send_alarm = this.checkRange(value, 'temperature');
      await axios.post(`${API_URL}/temperature`, {
        patient_id: 1,
        temperature: value,
        send_alarm
      });
      console.log('Temperature data sent successfully:', { value, send_alarm });
    } catch (error) {
      console.error('Failed to send temperature data:', error);
      throw error;
    }
  }

  async sendHumidityData(value: number): Promise<void> {
    try {
      const send_alarm = this.checkRange(value, 'humidity');
      await axios.post(`${API_URL}/humidity`, {
        patient_id: 1,
        humidity: value,
        send_alarm
      });
      console.log('Humidity data sent successfully:', { value, send_alarm });
    } catch (error) {
      console.error('Failed to send humidity data:', error);
      throw error;
    }
  }

  async sendPulseData(value: number): Promise<void> {
    try {
      const send_alarm = this.checkRange(value, 'pulse');
      await axios.post(`${API_URL}/pulse`, {
        patient_id: 1,
        pulse: value,
        send_alarm
      });
      console.log('Pulse data sent successfully:', { value, send_alarm });
    } catch (error) {
      console.error('Failed to send pulse data:', error);
      throw error;
    }
  }

  async sendEcgData(value: number): Promise<void> {
    try {
      await axios.post(`${API_URL}/ecg`, {
        patient_id: 1,
        ecg: value
      });
      console.log('ECG data sent successfully:', value);
    } catch (error) {
      console.error('Failed to send ECG data:', error);
      throw error;
    }
  }

  // Helper method to send all measurements at once
  async sendAllMeasurements(temp: number, humidity: number, pulse: number, ecg: number): Promise<void> {
    try {
      await Promise.all([
        this.sendTemperatureData(temp),
        this.sendHumidityData(humidity),
        this.sendPulseData(pulse),
        this.sendEcgData(ecg)
      ]);
      console.log('All measurements sent successfully');
    } catch (error) {
      console.error('Failed to send some measurements:', error);
      throw error;
    }
  }

  // Reset counters (can be called when disconnecting or resetting the monitoring)
  resetCounters(): void {
    outOfRangeCounter.pulse = 0;
    outOfRangeCounter.temperature = 0;
    outOfRangeCounter.humidity = 0;
  }
}

export default new MeasurementService(); 