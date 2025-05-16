import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const HEADER_BG = '#E8EAF6';
const screenWidth = Dimensions.get('window').width;

// Thresholds for abnormal values
const THRESHOLDS = {
  heart_rate: {
    low: 60,
    high: 100,
  },
  blood_pressure: {
    systolic: {
      low: 90,
      high: 130,
    },
    diastolic: {
      low: 60,
      high: 85,
    },
  },
  oxygen_saturation: {
    low: 95,
    high: 100,
  },
  temperature: {
    low: 36.1,
    high: 37.2,
  },
  humidity: {
    low: 30,
    high: 60,
  },
  qt_interval: {
    low: 350,
    high: 450,
  },
  pr_interval: {
    low: 120,
    high: 200,
  },
};

// Function to check if a value is abnormal
const isAbnormal = (type, value) => {
  switch (type) {
    case 'heart_rate':
      return value < THRESHOLDS.heart_rate.low || value > THRESHOLDS.heart_rate.high;
    case 'blood_pressure':
      const [systolic, diastolic] = value.split('/').map(Number);
      return systolic < THRESHOLDS.blood_pressure.systolic.low || 
             systolic > THRESHOLDS.blood_pressure.systolic.high ||
             diastolic < THRESHOLDS.blood_pressure.diastolic.low || 
             diastolic > THRESHOLDS.blood_pressure.diastolic.high;
    case 'oxygen_saturation':
      return value < THRESHOLDS.oxygen_saturation.low || value > THRESHOLDS.oxygen_saturation.high;
    case 'temperature':
      return value < THRESHOLDS.temperature.low || value > THRESHOLDS.temperature.high;
    case 'humidity':
      return value < THRESHOLDS.humidity.low || value > THRESHOLDS.humidity.high;
    case 'qt_interval':
      return value < THRESHOLDS.qt_interval.low || value > THRESHOLDS.qt_interval.high;
    case 'pr_interval':
      return value < THRESHOLDS.pr_interval.low || value > THRESHOLDS.pr_interval.high;
    default:
      return false;
  }
};

// Mock historical data (in a real app, this would come from a database)
const generateHistoricalData = (date = new Date()) => {
  const data = [];
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  // Generate 24 hours of data
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(startOfDay.getTime() + i * 3600000);
    
    // Generate some abnormal values at specific times
    const isAbnormalHour = i === 3 || i === 8 || i === 15 || i === 20;
    
    const heartRate = isAbnormalHour && i % 2 === 0 ? 
      Math.floor(Math.random() * 20) + 110 : // Abnormal high: 110-130
      Math.floor(Math.random() * 20) + 70;   // Normal: 70-90

    const bloodPressure = isAbnormalHour && i % 3 === 0 ?
      `${Math.floor(Math.random() * 20) + 140}/${Math.floor(Math.random() * 10) + 90}` : // Abnormal high
      `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 10) + 70}`;  // Normal

    const oxygenSaturation = isAbnormalHour && i % 4 === 0 ?
      Math.floor(Math.random() * 3) + 92 : // Abnormal low: 92-94
      Math.floor(Math.random() * 3) + 97;  // Normal: 97-100

    const temperature = isAbnormalHour && i % 5 === 0 ?
      (Math.random() * 0.8) + 37.3 : // Abnormal high: 37.3-38.1
      (Math.random() * 0.5) + 36.5;  // Normal: 36.5-37.0

    data.push({
      timestamp,
      ecg: {
        heart_rate: heartRate,
        qt_interval: Math.floor(Math.random() * 50) + 375,
        pr_interval: Math.floor(Math.random() * 30) + 150,
      },
      pulse: {
        blood_pressure: bloodPressure,
        oxygen_saturation: oxygenSaturation,
      },
      temperature: temperature,
      humidity: Math.floor(Math.random() * 10) + 45,
    });
  }
  return data;
};

const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date) => {
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const HistoryScreen = ({ navigation }) => {
  const [historicalData, setHistoricalData] = useState(generateHistoricalData());
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('heart_rate');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [abnormalPoints, setAbnormalPoints] = useState([]);

  // Calculate abnormal points whenever historicalData or selectedMetric changes
  useEffect(() => {
    const newAbnormalPoints = [];
    historicalData.forEach((d, index) => {
      switch (selectedMetric) {
        case 'heart_rate':
          if (isAbnormal('heart_rate', d.ecg.heart_rate)) {
            newAbnormalPoints.push(index);
          }
          break;
        case 'blood_pressure':
          if (isAbnormal('blood_pressure', d.pulse.blood_pressure)) {
            newAbnormalPoints.push(index);
          }
          break;
        case 'oxygen_saturation':
          if (isAbnormal('oxygen_saturation', d.pulse.oxygen_saturation)) {
            newAbnormalPoints.push(index);
          }
          break;
        case 'temperature':
          if (isAbnormal('temperature', d.temperature)) {
            newAbnormalPoints.push(index);
          }
          break;
        case 'humidity':
          if (isAbnormal('humidity', d.humidity)) {
            newAbnormalPoints.push(index);
          }
          break;
        case 'qt_interval':
          if (isAbnormal('qt_interval', d.ecg.qt_interval)) {
            newAbnormalPoints.push(index);
          }
          break;
        case 'pr_interval':
          if (isAbnormal('pr_interval', d.ecg.pr_interval)) {
            newAbnormalPoints.push(index);
          }
          break;
      }
    });
    setAbnormalPoints(newAbnormalPoints);
  }, [historicalData, selectedMetric]);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch the latest historical data
    setTimeout(() => {
      setHistoricalData(generateHistoricalData(selectedDate));
      setRefreshing(false);
    }, 1000);
  };

  const getChartData = (metric) => {
    const labels = historicalData.map((d, index) => 
      index % 3 === 0 ? formatTime(d.timestamp) : ''
    );
    let data = [];
    let color = '#3B4B75';
    let title = '';

    switch (metric) {
      case 'heart_rate':
        data = historicalData.map(d => d.ecg.heart_rate);
        title = 'Heart Rate (bpm)';
        break;
      case 'blood_pressure':
        data = historicalData.map(d => parseInt(d.pulse.blood_pressure.split('/')[0]));
        title = 'Systolic Blood Pressure (mmHg)';
        break;
      case 'oxygen_saturation':
        data = historicalData.map(d => d.pulse.oxygen_saturation);
        title = 'Oxygen Saturation (%)';
        break;
      case 'temperature':
        data = historicalData.map(d => d.temperature);
        title = 'Body Temperature (°C)';
        break;
      case 'humidity':
        data = historicalData.map(d => d.humidity);
        title = 'Environmental Humidity (%)';
        break;
      case 'qt_interval':
        data = historicalData.map(d => d.ecg.qt_interval);
        title = 'QT Interval (ms)';
        break;
      case 'pr_interval':
        data = historicalData.map(d => d.ecg.pr_interval);
        title = 'PR Interval (ms)';
        break;
    }

    return {
      labels,
      datasets: [{
        data,
        color: () => color,
      }],
      title,
    };
  };

  const navigateDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
    setHistoricalData(generateHistoricalData(newDate));
  };

  const renderDateSelector = () => {
    return (
      <View style={styles.dateSelector}>
        <TouchableOpacity
          onPress={() => navigateDate(-1)}
          style={styles.dateButton}
        >
          <Ionicons name="chevron-back" size={24} color="#3B4B75" />
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {formatDate(selectedDate)}
        </Text>
        <TouchableOpacity
          onPress={() => navigateDate(1)}
          style={styles.dateButton}
        >
          <Ionicons name="chevron-forward" size={24} color="#3B4B75" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMetricSelector = () => {
    const metrics = [
      { id: 'heart_rate', label: 'Heart Rate', icon: 'pulse' },
      { id: 'blood_pressure', label: 'Blood Pressure', icon: 'water' },
      { id: 'oxygen_saturation', label: 'O2 Saturation', icon: 'fitness' },
      { id: 'temperature', label: 'Temperature', icon: 'thermometer' },
      { id: 'humidity', label: 'Humidity', icon: 'water-outline' },
      { id: 'qt_interval', label: 'QT Interval', icon: 'heart' },
      { id: 'pr_interval', label: 'PR Interval', icon: 'heart' },
    ];

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.metricSelector}
      >
        {metrics.map(metric => (
          <TouchableOpacity
            key={metric.id}
            style={[
              styles.metricButton,
              selectedMetric === metric.id && styles.selectedMetricButton,
            ]}
            onPress={() => setSelectedMetric(metric.id)}
          >
            <Ionicons 
              name={metric.icon} 
              size={20} 
              color={selectedMetric === metric.id ? '#fff' : '#3B4B75'} 
            />
            <Text style={[
              styles.metricButtonText,
              selectedMetric === metric.id && styles.selectedMetricButtonText,
            ]}>
              {metric.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderLatestReadings = () => {
    const latest = historicalData[historicalData.length - 1];
    return (
      <View style={styles.latestReadings}>
        <Text style={styles.latestReadingsTitle}>Latest Readings</Text>
        <View style={styles.readingsGrid}>
          <View style={styles.readingItem}>
            <Ionicons name="pulse" size={24} color="#3B4B75" />
            <Text style={styles.readingValue}>{latest.ecg.heart_rate} bpm</Text>
            <Text style={styles.readingLabel}>Heart Rate</Text>
          </View>
          <View style={styles.readingItem}>
            <Ionicons name="water" size={24} color="#3B4B75" />
            <Text style={styles.readingValue}>{latest.pulse.blood_pressure}</Text>
            <Text style={styles.readingLabel}>Blood Pressure</Text>
          </View>
          <View style={styles.readingItem}>
            <Ionicons name="fitness" size={24} color="#3B4B75" />
            <Text style={styles.readingValue}>{latest.pulse.oxygen_saturation}%</Text>
            <Text style={styles.readingLabel}>O2 Saturation</Text>
          </View>
          <View style={styles.readingItem}>
            <Ionicons name="thermometer" size={24} color="#3B4B75" />
            <Text style={styles.readingValue}>{latest.temperature.toFixed(1)}°C</Text>
            <Text style={styles.readingLabel}>Temperature</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.title}>History</Text>
        <TouchableOpacity
          onPress={onRefresh}
          style={styles.iconButton}
        >
          <Ionicons name="refresh" size={24} color="#3B4B75" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B4B75']}
          />
        }
      >
        {renderDateSelector()}
        {renderMetricSelector()}
        
        <View style={styles.chartContainer}>
          <LineChart
            data={getChartData(selectedMetric)}
            width={screenWidth - 48}
            height={200}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 75, 117, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
            segments={4}
            renderDotContent={({ x, y, index }) => {
              if (abnormalPoints.includes(index)) {
                return (
                  <View
                    key={index}
                    style={{
                      position: 'absolute',
                      top: y - 4,
                      left: x - 4,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#FF3B30',
                    }}
                  />
                );
              }
              return null;
            }}
          />
        </View>

        {renderLatestReadings()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 24,
    backgroundColor: '#E8EAF6',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  headerLeft: {
    width: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B4B75',
    textAlign: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  metricSelector: {
    marginBottom: 16,
  },
  metricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#E8EAF6',
  },
  selectedMetricButton: {
    backgroundColor: '#3B4B75',
  },
  metricButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#3B4B75',
  },
  selectedMetricButtonText: {
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  latestReadings: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  latestReadingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B4B75',
    marginBottom: 16,
  },
  readingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  readingItem: {
    width: '50%',
    padding: 8,
    alignItems: 'center',
  },
  readingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B4B75',
    marginTop: 8,
  },
  readingLabel: {
    fontSize: 12,
    color: '#3B4B75',
    opacity: 0.7,
    marginTop: 4,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B4B75',
    marginHorizontal: 16,
  },
});

export default HistoryScreen; 