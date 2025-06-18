import axios from 'axios';
import authService from './authService';
import { API_URL } from '../config';

const API_URL_LOCAL = 'https://d6b6-193-226-8-99.ngrok-free.app';

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

interface ChartData {
  labels: string[];
  values: number[];
  unit: string;
}

class MeasurementService {
  private lastPulseValue: number = 75; // Starting with a reasonable pulse value
  private maxPulseChange: number = 5; // Maximum change between consecutive readings
  private currentParameter: 'pulse' | 'temperature' | 'humidity' = 'pulse';

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
      const response = await axios.post(`${API_URL_LOCAL}/pulse`, measurement);
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
      const response = await axios.post(`${API_URL_LOCAL}/temperature`, measurement);
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
      const response = await axios.post(`${API_URL_LOCAL}/humidity`, measurement);
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
      const response = await axios.get(`${API_URL_LOCAL}/pulse`);
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

      const response = await axios.get(`${API_URL_LOCAL}/pulse`, {
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

      const response = await axios.get(`${API_URL_LOCAL}/pulse`, {
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
      await axios.post(`${API_URL_LOCAL}/temperature`, {
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
      await axios.post(`${API_URL_LOCAL}/humidity`, {
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
      await axios.post(`${API_URL_LOCAL}/pulse`, {
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
      await axios.post(`${API_URL_LOCAL}/ecg`, {
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

  private async fetchData(endpoint: string, timeRange: 'daily' | 'weekly' | 'monthly', selectedDate: Date) {
    try {
      console.log(`Fetching data from ${endpoint} for date:`, selectedDate.toISOString());
      const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Raw API response from ${endpoint}:`, data);
      return this.processHistoricalData(data, timeRange, selectedDate);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return null;
    }
  }

  private detectAnomalies(data: number[]): boolean {
    if (data.length < 2) return false;
    
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const stdDev = Math.sqrt(
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    );
    
    // Check if any value is more than 2 standard deviations from the mean
    return data.some(val => Math.abs(val - mean) > 2 * stdDev);
  }

  private determineOptimalInterval(data: { value: number; timestamp: Date }[]): number {
    if (data.length === 0) return 60; // Default to hourly if no data

    // Sort data by timestamp
    const sortedData = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Calculate time span in minutes
    const timeSpan = (sortedData[sortedData.length - 1].timestamp.getTime() - sortedData[0].timestamp.getTime()) / (1000 * 60);
    
    // Check for anomalies
    const hasAnomalies = this.detectAnomalies(data.map(d => d.value));
    
    // Determine optimal number of points to display
    let targetPoints: number;
    if (timeSpan <= 60) { // Less than 1 hour
      targetPoints = Math.min(8, data.length); // Max 8 points for short time spans
    } else if (timeSpan <= 240) { // Less than 4 hours
      targetPoints = Math.min(12, data.length); // Max 12 points for medium time spans
    } else { // Full day or more
      targetPoints = Math.min(24, data.length); // Max 24 points for full day
    }

    // If we have anomalies, increase the number of points
    if (hasAnomalies) {
      targetPoints = Math.min(targetPoints * 1.5, data.length);
    }

    // Calculate interval in minutes
    const interval = Math.ceil(timeSpan / targetPoints);
    
    // Round to nearest standard interval
    if (interval <= 5) return 5;
    if (interval <= 15) return 15;
    if (interval <= 30) return 30;
    return 60;
  }

  private aggregateData(data: { value: number; timestamp: Date }[]): ChartData {
    if (data.length === 0) {
      return { labels: [], values: [], unit: this.getUnitForParameter(this.currentParameter) };
    }

    const intervalMinutes = this.determineOptimalInterval(data);
    console.log(`Using ${intervalMinutes}-minute intervals for ${data.length} data points`);

    const intervals = new Map<string, { values: number[]; timestamp: Date }>();
    
    data.forEach(item => {
      const date = new Date(item.timestamp);
      // Round down to the nearest interval
      const roundedMinutes = Math.floor(date.getMinutes() / intervalMinutes) * intervalMinutes;
      const intervalDate = new Date(date);
      intervalDate.setMinutes(roundedMinutes, 0, 0);
      
      const key = intervalDate.toISOString();
      if (!intervals.has(key)) {
        intervals.set(key, { values: [], timestamp: intervalDate });
      }
      intervals.get(key)?.values.push(item.value);
    });

    // Sort intervals by time
    const sortedIntervals = Array.from(intervals.entries()).sort((a, b) => 
      a[1].timestamp.getTime() - b[1].timestamp.getTime()
    );

    const result: ChartData = {
      labels: [],
      values: [],
      unit: this.getUnitForParameter(this.currentParameter)
    };

    sortedIntervals.forEach(([_, { values, timestamp }]) => {
      result.labels.push(timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      result.values.push(
        Number((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1))
      );
    });

    return result;
  }

  private processHistoricalData(data: any[], timeRange: 'daily' | 'weekly' | 'monthly', selectedDate: Date): ChartData | null {
    if (!data || data.length === 0) {
      console.log('No data available for processing');
      return null;
    }

    // Determine which value field to use based on currentParameter
    let valueField: string = 'value';
    switch (this.currentParameter) {
      case 'pulse':
        valueField = 'pulse';
        break;
      case 'temperature':
        valueField = 'temperature';
        break;
      case 'humidity':
        valueField = 'humidity';
        break;
    }

    // Sort data by timestamp and validate dates
    const sortedData = [...data]
      .filter(item => {
        try {
          const rawDate = item.timestamp || item.created_at;
          if (!rawDate) return false;
          const date = new Date(rawDate);
          return !isNaN(date.getTime());
        } catch (e) {
          console.log('Invalid date found:', item.timestamp || item.created_at);
          return false;
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.timestamp || a.created_at);
        const dateB = new Date(b.timestamp || b.created_at);
        return dateA.getTime() - dateB.getTime();
      });

    if (sortedData.length === 0) {
      console.log('No valid data after date filtering');
      return null;
    }

    console.log('Sorted data:', sortedData);

    // Get the start and end date based on timeRange and selectedDate
    let startDate: Date;
    let endDate: Date;
    let hasEnoughData = true;

    try {
      switch (timeRange) {
        case 'daily':
          // For daily view, use the selectedDate's day
          startDate = new Date(selectedDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(selectedDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'weekly':
          // For weekly view, use the week containing selectedDate
          startDate = new Date(selectedDate);
          startDate.setDate(selectedDate.getDate() - selectedDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'monthly':
          // For monthly view, use the month containing selectedDate
          startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 0, 0, 0, 0);
          endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
          break;
      }
    } catch (e) {
      console.error('Error processing dates:', e);
      return null;
    }

    if (!hasEnoughData && timeRange !== 'daily') {
      return null;
    }

    // Filter data for the selected time range
    const filteredData = sortedData.filter(item => {
      try {
        const rawDate = item.timestamp || item.created_at;
        if (!rawDate) return false;
        const itemDate = new Date(rawDate);
        if (isNaN(itemDate.getTime())) return false;
        const isInRange = itemDate >= startDate && itemDate <= endDate;
        console.log('Checking item:', {
          timestamp: rawDate,
          value: item[valueField],
          isInRange,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        });
        return isInRange;
      } catch (e) {
        console.log('Error processing item date:', item.timestamp || item.created_at);
        return false;
      }
    });

    console.log('Filtered data count:', filteredData.length);
    console.log('Filtered data:', filteredData);

    if (filteredData.length === 0) {
      console.log('No data available after filtering');
      return null;
    }

    // For daily view, determine optimal interval based on data distribution
    if (timeRange === 'daily') {
      const timeSpan = endDate.getTime() - startDate.getTime();
      const hoursSpan = timeSpan / (1000 * 60 * 60);
      const dataPoints = filteredData.length;
      
      console.log('Data distribution:', {
        timeSpan,
        hoursSpan,
        dataPoints
      });

      // Determine optimal interval based on time span and data points
      let intervalMinutes: number;
      if (hoursSpan <= 1) {
        // Less than 1 hour of data: show every 5 minutes
        intervalMinutes = 5;
      } else if (hoursSpan <= 4) {
        // 1-4 hours of data: show every 15 minutes
        intervalMinutes = 15;
      } else if (hoursSpan <= 12) {
        // 4-12 hours of data: show every 30 minutes
        intervalMinutes = 30;
      } else {
        // More than 12 hours: show hourly
        intervalMinutes = 60;
      }

      console.log('Selected interval:', intervalMinutes, 'minutes');

      // Group data by intervals
      const groupedData = new Map<string, number[]>();
      filteredData.forEach(item => {
        try {
          const rawDate = item.timestamp || item.created_at;
          if (!rawDate) return;
          const date = new Date(rawDate);
          if (isNaN(date.getTime())) return;
          // Round to nearest interval
          const roundedMinutes = Math.floor(date.getMinutes() / intervalMinutes) * intervalMinutes;
          const roundedDate = new Date(date);
          roundedDate.setMinutes(roundedMinutes, 0, 0);
          const key = roundedDate.toISOString();

          if (!groupedData.has(key)) {
            groupedData.set(key, []);
          }
          groupedData.get(key)?.push(item[valueField]);
        } catch (e) {
          console.log('Error processing item for grouping:', item);
        }
      });

      console.log('Grouped data:', Object.fromEntries(groupedData));

      // Sort by time
      const sortedEntries = Array.from(groupedData.entries())
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());

      const result = {
        labels: sortedEntries.map(([key]) => 
          new Date(key).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        ),
        values: sortedEntries.map(([_, values]) => 
          Number((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1))
        ),
        unit: this.getUnitForParameter(this.currentParameter)
      };

      console.log('Final chart data:', result);
      return result;
    }

    // For weekly and monthly views, group data
    const groupedData = new Map<string, number[]>();
    
    filteredData.forEach(item => {
      const rawDate = item.timestamp || item.created_at;
      if (!rawDate) return;
      const date = new Date(rawDate);
      if (isNaN(date.getTime())) return;
      let key: string;

      if (timeRange === 'weekly') {
        // Group by day for weekly view
        key = date.toISOString().slice(0, 10); // YYYY-MM-DD
      } else {
        // Group by week for monthly view
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week
        key = weekStart.toISOString().slice(0, 10); // YYYY-MM-DD
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, []);
      }
      groupedData.get(key)?.push(item[valueField]);
    });

    // Calculate averages and create labels
    const labels: string[] = [];
    const values: number[] = [];

    groupedData.forEach((valuesArray, key) => {
      const average = valuesArray.reduce((sum, val) => sum + val, 0) / valuesArray.length;
      let label: string;

      if (timeRange === 'weekly') {
        // Format as Day of week
        label = new Date(key).toLocaleDateString([], { weekday: 'short' });
      } else {
        // Format as Week of month
        const weekDate = new Date(key);
        const weekNumber = Math.ceil((weekDate.getDate() + weekDate.getDay()) / 7);
        label = `Week ${weekNumber}`;
      }

      labels.push(label);
      values.push(Number(average.toFixed(1)));
    });

    return {
      labels,
      values,
      unit: this.getUnitForParameter(this.currentParameter)
    };
  }

  async getPulseHistory(timeRange: 'daily' | 'weekly' | 'monthly', selectedDate: Date) {
    this.currentParameter = 'pulse';
    return this.fetchData('/pulse', timeRange, selectedDate);
  }

  async getTemperatureHistory(timeRange: 'daily' | 'weekly' | 'monthly', selectedDate: Date) {
    this.currentParameter = 'temperature';
    return this.fetchData('/temperature', timeRange, selectedDate);
  }

  async getHumidityHistory(timeRange: 'daily' | 'weekly' | 'monthly', selectedDate: Date) {
    this.currentParameter = 'humidity';
    return this.fetchData('/humidity', timeRange, selectedDate);
  }

  private getUnitForParameter(parameter: 'pulse' | 'temperature' | 'humidity'): string {
    switch (parameter) {
      case 'pulse':
        return 'BPM';
      case 'temperature':
        return '°C';
      case 'humidity':
        return '%';
      default:
        return '';
    }
  }

  // Make generateRandomPulse public
  generateRandomPulse(): number {
    const maxChange = 2; // Maximum change in BPM
    const change = (Math.random() - 0.5) * 2 * maxChange; // Random change between -maxChange and +maxChange
    const newPulse = this.lastPulseValue + change;
    
    // Keep pulse within reasonable bounds (40-180 BPM)
    const boundedPulse = Math.max(40, Math.min(180, newPulse));
    this.lastPulseValue = boundedPulse;
    return boundedPulse;
  }

  async startEcgRecording(): Promise<void> {
    try {
      const response = await axios.post(`${API_URL}/ecg/start`, {
        patient_id: 1,
        duration: 30 // 30 seconds recording
      });
      console.log('ECG recording started:', response.data);
    } catch (error) {
      console.error('Failed to start ECG recording:', error);
      throw error;
    }
  }
}

export default new MeasurementService(); 