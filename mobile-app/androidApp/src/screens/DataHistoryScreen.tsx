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
  const [alarmList, setAlarmList] = useState<any[]>([]);

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
      // Fetch and filter alarms for the current parameter and time range
      if (processedData && processedData.rawData) {
        const alarms = processedData.rawData.filter((item: any) => item.send_alarm);
        setAlarmList(alarms);
      } else {
        setAlarmList([]);
      }
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
          renderDotContent={({ x, y, index, indexData }) => {
            return null;
          }}
        />
        {/* Activated Alarms List */}
        <View style={styles.alarmsListContainer}>
          <Text style={styles.alarmsListTitle}>Activated Alarms</Text>
          {alarmList.length === 0 ? (
            <Text style={styles.noAlarmsText}>No alarms detected for this period. 🎉</Text>
          ) : (
            alarmList.map((alarm, idx) => (
              <View key={idx} style={styles.alarmCard}>
                <View style={styles.alarmIconContainer}>
                  <Icon name="warning" size={24} color="#e53935" />
                </View>
                <View style={styles.alarmInfoContainer}>
                  <Text style={styles.alarmValue}>
                    {selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)}: <Text style={styles.alarmValueNumber}>{alarm[selectedParameter] ?? alarm.value}</Text> {chartData.unit}
                  </Text>
                  <Text style={styles.alarmTimestamp}>{new Date(alarm.timestamp || alarm.created_at).toLocaleString()}</Text>
                </View>
              </View>
            ))
          )}
        </View>
        <Text style={styles.unitLabel}>
          {timeRange === 'daily' ? chartData.unit : `Average ${chartData.unit}`}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Parameter Switcher */}
      <View style={styles.parameterContainer}>
        <TouchableOpacity
          style={[styles.parameterButton, selectedParameter === 'pulse' && styles.activeParameterButton]}
          onPress={() => setSelectedParameter('pulse')}
        >
          <Icon name="favorite" size={20} color={selectedParameter === 'pulse' ? '#fff' : '#2196F3'} style={styles.parameterIcon} />
          <Text style={[styles.parameterButtonText, selectedParameter === 'pulse' && styles.activeParameterButtonText]}>Pulse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.parameterButton, selectedParameter === 'temperature' && styles.activeParameterButton]}
          onPress={() => setSelectedParameter('temperature')}
        >
          <Icon name="thermostat" size={20} color={selectedParameter === 'temperature' ? '#fff' : '#2196F3'} style={styles.parameterIcon} />
          <Text style={[styles.parameterButtonText, selectedParameter === 'temperature' && styles.activeParameterButtonText]}>Temperature</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.parameterButton, selectedParameter === 'humidity' && styles.activeParameterButton]}
          onPress={() => setSelectedParameter('humidity')}
        >
          <Icon name="water-drop" size={20} color={selectedParameter === 'humidity' ? '#fff' : '#2196F3'} style={styles.parameterIcon} />
          <Text style={[styles.parameterButtonText, selectedParameter === 'humidity' && styles.activeParameterButtonText]}>Humidity</Text>
        </TouchableOpacity>
      </View>
      {/* Time Range Switcher - Segmented Control Style */}
      <View style={styles.timeRangeSegmentedContainer}>
        <TouchableOpacity
          style={[styles.segmentedButton, timeRange === 'daily' && styles.activeSegmentedButton]}
          onPress={() => setTimeRange('daily')}
        >
          <Text style={[styles.segmentedButtonText, timeRange === 'daily' && styles.activeSegmentedButtonText]}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentedButton, timeRange === 'weekly' && styles.activeSegmentedButton]}
          onPress={() => setTimeRange('weekly')}
        >
          <Text style={[styles.segmentedButtonText, timeRange === 'weekly' && styles.activeSegmentedButtonText]}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentedButton, timeRange === 'monthly' && styles.activeSegmentedButton]}
          onPress={() => setTimeRange('monthly')}
        >
          <Text style={[styles.segmentedButtonText, timeRange === 'monthly' && styles.activeSegmentedButtonText]}>Monthly</Text>
        </TouchableOpacity>
      </View>
      {/* Date Navigation Modernized */}
      <View style={styles.dateNavigationModernContainer}>
        <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.circleNavButton}>
          <Icon name="chevron-left" size={24} color="#2196F3" />
        </TouchableOpacity>
        <View style={styles.dateRangeCard}>
          <Text style={styles.dateRangeTextModern}>{formatDateRange()}</Text>
        </View>
        <TouchableOpacity onPress={() => navigateDate('next')} style={styles.circleNavButton}>
          <Icon name="chevron-right" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Chart Summary and Chart */}
        {chartData && (
          <View style={styles.chartSummaryContainer}>
            <Text style={styles.chartSummaryText}>
              {`Avg: ${chartData.avg ?? '-'}${chartData.unit ? ' ' + chartData.unit : ''}`}
              {chartData.max !== undefined ? `   Max: ${chartData.max}${chartData.unit ? ' ' + chartData.unit : ''}` : ''}
              {chartData.min !== undefined ? `   Min: ${chartData.min}${chartData.unit ? ' ' + chartData.unit : ''}` : ''}
            </Text>
          </View>
        )}
        {renderChart()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  parameterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  parameterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  activeParameterButton: {
    backgroundColor: '#2196F3',
    shadowOpacity: 0.12,
  },
  parameterButtonText: {
    color: '#2196F3',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeParameterButtonText: {
    color: '#FFFFFF',
  },
  parameterIcon: {
    marginRight: 2,
  },
  timeRangeSegmentedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 18,
    padding: 4,
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  activeSegmentedButton: {
    backgroundColor: '#2196F3',
  },
  segmentedButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  activeSegmentedButtonText: {
    color: '#FFFFFF',
  },
  dateNavigationModernContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 6,
  },
  circleNavButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  dateRangeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  dateRangeTextModern: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2196F3',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  chartSummaryContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  chartSummaryText: {
    fontSize: 15,
    color: '#388E3C',
    fontWeight: '600',
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
  alarmsListContainer: { marginTop: 18, backgroundColor: '#fff', borderRadius: 12, padding: 14, shadowColor: '#e53935', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  alarmsListTitle: { fontSize: 17, fontWeight: 'bold', color: '#e53935', marginBottom: 10, letterSpacing: 0.2 },
  noAlarmsText: { fontSize: 15, color: '#388e3c', textAlign: 'center', marginVertical: 8 },
  alarmCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff5f5', borderRadius: 8, marginBottom: 10, padding: 10, borderLeftWidth: 5, borderLeftColor: '#e53935', shadowColor: '#e53935', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  alarmIconContainer: { marginRight: 12 },
  alarmInfoContainer: { flex: 1 },
  alarmValue: { fontSize: 16, fontWeight: '600', color: '#b71c1c' },
  alarmValueNumber: { fontSize: 18, fontWeight: 'bold', color: '#e53935' },
  alarmTimestamp: { fontSize: 13, color: '#888', marginTop: 2 },
});

export default DataHistoryScreen; 