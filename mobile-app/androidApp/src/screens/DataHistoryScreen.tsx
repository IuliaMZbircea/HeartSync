import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import measurementService from '../services/measurementService';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#2196F3',
  },
};

const DataHistoryScreen = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [pulseData, setPulseData] = useState<any>(null);
  const [temperatureData, setTemperatureData] = useState<any>(null);
  const [humidityData, setHumidityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<'pulse' | 'temperature' | 'humidity'>('pulse');
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [timeRange, selectedDate, selectedParameter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching data for:', {
        parameter: selectedParameter,
        timeRange,
        selectedDate: selectedDate.toISOString()
      });

      let processedData;
      switch (selectedParameter) {
        case 'pulse':
          processedData = await measurementService.getPulseHistory(timeRange, selectedDate);
          break;
        case 'temperature':
          processedData = await measurementService.getTemperatureHistory(timeRange, selectedDate);
          break;
        case 'humidity':
          processedData = await measurementService.getHumidityHistory(timeRange, selectedDate);
          break;
      }

      console.log('Processed data:', processedData);
      
      if (!processedData) {
        console.log('No processed data available');
        setChartData(null);
        return;
      }

      setChartData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (timeRange === 'daily') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (timeRange === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    console.log('Navigating to date:', newDate.toISOString());
    setSelectedDate(newDate);
  };

  const formatDateRange = () => {
    if (timeRange === 'daily') {
      return selectedDate.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (timeRange === 'weekly') {
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 6);
      return `${selectedDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    } else {
      return selectedDate.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'long' 
      });
    }
  };

  const renderChart = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!chartData) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>
            {timeRange === 'daily' 
              ? 'No data available for today'
              : timeRange === 'weekly'
                ? 'Not enough data for weekly view (need at least 3 days)'
                : 'Not enough data for monthly view (need at least 7 days)'}
          </Text>
        </View>
      );
    }

    console.log('Rendering chart with data:', chartData);

    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: [{
              data: chartData.values
            }]
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={styles.chart}
        />
        <Text style={styles.unitLabel}>
          {timeRange === 'daily' ? chartData.unit : `Average ${chartData.unit}`}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeRangeContainer}>
        <TouchableOpacity
          style={[styles.timeButton, timeRange === 'daily' && styles.activeTimeButton]}
          onPress={() => setTimeRange('daily')}
        >
          <Text style={[styles.timeButtonText, timeRange === 'daily' && styles.activeTimeButtonText]}>
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeButton, timeRange === 'weekly' && styles.activeTimeButton]}
          onPress={() => setTimeRange('weekly')}
        >
          <Text style={[styles.timeButtonText, timeRange === 'weekly' && styles.activeTimeButtonText]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeButton, timeRange === 'monthly' && styles.activeTimeButton]}
          onPress={() => setTimeRange('monthly')}
        >
          <Text style={[styles.timeButtonText, timeRange === 'monthly' && styles.activeTimeButtonText]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateNavigationContainer}>
        <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
          <Icon name="chevron-left" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.dateRangeText}>{formatDateRange()}</Text>
        <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
          <Icon name="chevron-right" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderChart()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeTimeButton: {
    backgroundColor: '#2196F3',
  },
  timeButtonText: {
    color: '#757575',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTimeButtonText: {
    color: '#FFFFFF',
  },
  dateNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  navButton: {
    padding: 8,
  },
  dateRangeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  scrollContent: {
    padding: 16,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  chartUnit: {
    fontSize: 14,
    color: '#757575',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  unitLabel: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'right',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
});

export default DataHistoryScreen; 