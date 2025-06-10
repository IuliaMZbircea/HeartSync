import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to generate a more realistic ECG waveform
const generateECGWaveform = () => {
  const samples = 200; // Increased sampling for smoother curve
  const data = [];
  
  // Generate baseline
  for (let i = 0; i < samples; i++) {
    // Baseline with slight variation
    let value = 450 + Math.sin(i * 0.1) * 2;
    
    // Add P wave
    if (i > 20 && i < 35) {
      value += Math.sin((i - 20) * 0.5) * 15;
    }
    
    // Add QRS complex
    if (i > 40 && i < 60) {
      if (i === 45) value = 350; // Q wave
      if (i === 50) value = 50;  // R wave peak
      if (i === 55) value = 400; // S wave
    }
    
    // Add T wave
    if (i > 70 && i < 90) {
      value += Math.sin((i - 70) * 0.3) * 20;
    }
    
    // Add some natural variation
    value += (Math.random() - 0.5) * 2;
    
    data.push(Math.round(value));
  }
  
  return data;
};

// Mock data for historical records
const MOCK_HISTORICAL_DATA = {
  daily: {
    heartRate: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{ data: [72, 68, 75, 82, 78, 70] }],
    },
    bloodPressure: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{ data: [120, 118, 122, 125, 121, 119] }],
    },
    oxygenSaturation: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{ data: [98, 97, 99, 98, 98, 97] }],
    },
    temperature: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{ data: [36.5, 36.3, 36.6, 36.8, 36.7, 36.4] }],
    },
    ecg: {
      status: 'Normal',
      lastRecording: '10:30 AM',
      details: 'Regular sinus rhythm, no abnormalities detected',
    },
  },
  weekly: {
    heartRate: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [75, 72, 78, 74, 76, 73, 70] }],
    },
    bloodPressure: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [122, 120, 123, 121, 119, 118, 120] }],
    },
    oxygenSaturation: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [98, 97, 99, 98, 97, 98, 98] }],
    },
    temperature: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [36.6, 36.5, 36.7, 36.4, 36.3, 36.5, 36.4] }],
    },
    ecg: {
      status: 'Normal',
      lastRecording: 'Yesterday',
      details: 'Regular sinus rhythm, no abnormalities detected',
    },
  },
  monthly: {
    heartRate: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{ data: [74, 76, 73, 75] }],
    },
    bloodPressure: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{ data: [121, 119, 122, 120] }],
    },
    oxygenSaturation: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{ data: [98, 97, 98, 98] }],
    },
    temperature: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{ data: [36.5, 36.6, 36.4, 36.5] }],
    },
    ecg: {
      status: 'Normal',
      lastRecording: 'Last Week',
      details: 'Regular sinus rhythm, no abnormalities detected',
    },
  },
};

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 48; // Accounting for container padding and margins

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForLabels: {
    fontSize: 12,
  },
  propsForBackgroundLines: {
    stroke: 'rgba(0, 0, 0, 0.1)',
    strokeWidth: 1,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
  },
};

const DataHistoryScreen = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [alerts, setAlerts] = useState<{ timestamp: string; message: string }[]>([]);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const existingAlerts = await AsyncStorage.getItem('health_alerts');
        if (existingAlerts) {
          setAlerts(JSON.parse(existingAlerts));
        }
      } catch (error) {
        console.error('Error loading alerts:', error);
      }
    };
    loadAlerts();
  }, []);

  const renderECGStatus = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>ECG Status</Text>
        <Text style={styles.chartUnit}>Last Recording: {MOCK_HISTORICAL_DATA[timeRange].ecg.lastRecording}</Text>
      </View>
      <View style={styles.ecgStatusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
        <Text style={styles.ecgStatusText}>{MOCK_HISTORICAL_DATA[timeRange].ecg.status}</Text>
        <Text style={styles.ecgDetailsText}>{MOCK_HISTORICAL_DATA[timeRange].ecg.details}</Text>
      </View>
    </View>
  );

  const renderChart = (title: string, data: any, unit: string) => (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{title}</Text>
        <Text style={styles.chartUnit}>{unit}</Text>
      </View>
      <LineChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots
        withInnerLines
        withOuterLines
        withVerticalLines
        withHorizontalLines
        withVerticalLabels
        withHorizontalLabels
        segments={4}
        fromZero={false}
        yAxisInterval={1}
        yAxisSuffix={unit}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Data History</Text>
        <View style={styles.timeRangeSelector}>
          <TouchableOpacity
            style={[styles.timeButton, timeRange === 'daily' && styles.activeTimeButton]}
            onPress={() => setTimeRange('daily')}
          >
            <Text style={[styles.timeButtonText, timeRange === 'daily' && styles.activeTimeButtonText]}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeButton, timeRange === 'weekly' && styles.activeTimeButton]}
            onPress={() => setTimeRange('weekly')}
          >
            <Text style={[styles.timeButtonText, timeRange === 'weekly' && styles.activeTimeButtonText]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeButton, timeRange === 'monthly' && styles.activeTimeButton]}
            onPress={() => setTimeRange('monthly')}
          >
            <Text style={[styles.timeButtonText, timeRange === 'monthly' && styles.activeTimeButtonText]}>Monthly</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderChart('Heart Rate', MOCK_HISTORICAL_DATA[timeRange].heartRate, 'bpm')}
        {renderChart('Blood Pressure', MOCK_HISTORICAL_DATA[timeRange].bloodPressure, 'mmHg')}
        {renderChart('Oxygen Saturation', MOCK_HISTORICAL_DATA[timeRange].oxygenSaturation, '% ')}
        {renderChart('Temperature', MOCK_HISTORICAL_DATA[timeRange].temperature, '°C')}

        {renderECGStatus()}

        <View style={styles.alertsSection}>
          <Text style={styles.alertsSectionTitle}>Health Alerts</Text>
          {alerts.length === 0 ? (
            <Text style={styles.noAlertsText}>No health alerts recorded.</Text>
          ) : (
            alerts.map((alert, index) => (
              <View key={index} style={styles.alertItem}>
                <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTimeButton: {
    backgroundColor: '#2196F3',
  },
  timeButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  activeTimeButtonText: {
    color: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartUnit: {
    fontSize: 14,
    color: '#666',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  ecgStatusContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  ecgStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ecgDetailsText: {
    fontSize: 14,
    color: '#666',
  },
  alertsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  alertsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noAlertsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  alertItem: {
    backgroundColor: '#ffe0b2', // Light orange for alerts
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#ff9800', // Darker orange
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});

export default DataHistoryScreen; 