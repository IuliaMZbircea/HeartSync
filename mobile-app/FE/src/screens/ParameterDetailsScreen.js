import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import mockPatientData from '../mockPatientData';

const HEADER_BG = '#E8EAF6';
const SCREEN_WIDTH = Dimensions.get('window').width;

const PARAMETER_LABELS = {
  pulse: 'Avg. Pulse',
  bodyTemperature: 'Avg. Body Temp',
  bloodPressure: 'Avg. Blood Pressure',
  spo2: 'Avg. SpO₂',
  respiratoryRate: 'Avg. Resp. Rate',
  hrv: 'Avg. HRV',
  steps: 'Steps',
  sleep: 'Sleep',
  ecg: 'ECG',
};

const getUnit = (parameter) => {
  switch (parameter) {
    case 'pulse': return 'BPM';
    case 'bodyTemperature': return '°C';
    case 'bloodPressure': return 'mmHg';
    case 'spo2': return '%';
    case 'respiratoryRate': return '/min';
    case 'hrv': return 'ms';
    case 'steps': return '';
    case 'sleep': return 'h';
    default: return '';
  }
};

const isNormal = (parameter, value) => {
  if (parameter === 'pulse') return value < 100;
  if (parameter === 'bodyTemperature') return value < 37.5;
  if (parameter === 'spo2') return value >= 95;
  if (parameter === 'bloodPressure') return value.systolic < 140 && value.diastolic < 90;
  if (parameter === 'respiratoryRate') return value <= 20;
  if (parameter === 'hrv') return value >= 40;
  if (parameter === 'steps') return value >= 5000;
  if (parameter === 'sleep') return value >= 6;
  if (parameter === 'ecg') return value === 'Normal';
  return true;
};

const formatValue = (parameter, entry) => {
  if (parameter === 'bloodPressure') return `${entry.systolic}/${entry.diastolic} mmHg`;
  if (parameter === 'sleep') return `${entry.duration}h (${entry.quality})`;
  if (entry.value !== undefined) return `${entry.value} ${getUnit(parameter)}`.trim();
  return '';
};

const ParameterDetailsScreen = ({ route, navigation }) => {
  const { parameter } = route.params;
  const history = mockPatientData.history[parameter] || [];
  const today = history[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  if (!today) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={22} color="#3B4B75" />
          </TouchableOpacity>
          <Text style={styles.title}>{PARAMETER_LABELS[parameter] || parameter}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#3B4B75', fontSize: 18, fontWeight: '600' }}>No data available for this parameter.</Text>
        </View>
      </View>
    );
  }

  function renderDateWithSuperscript(dateStr, style = styles.dateRow) {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();
    const suffix = getDaySuffix(day);
    return (
      <Text style={style}>
        {month} {day}
        <Text style={styles.superscript}>{suffix}</Text>
        , {year}
      </Text>
    );
  }

  function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  function getAverage(entry) {
    if (!entry.hourly || !Array.isArray(entry.hourly)) return null;
    if (parameter === 'bloodPressure') {
      // Average systolic/diastolic
      const avgS = Math.round(entry.hourly.reduce((sum, h) => sum + h.systolic, 0) / entry.hourly.length);
      const avgD = Math.round(entry.hourly.reduce((sum, h) => sum + h.diastolic, 0) / entry.hourly.length);
      return `${avgS}/${avgD} mmHg`;
    }
    if (parameter === 'sleep') {
      // Average sleep duration
      const avg = (entry.hourly.reduce((sum, h) => sum + h, 0) / entry.hourly.length).toFixed(2);
      return `${avg} h`;
    }
    if (parameter === 'ecg') {
      // If any abnormal, show 'Abnormal', else 'Normal'
      return entry.hourly.some((v) => v !== 'Normal') ? 'Abnormal' : 'Normal';
    }
    // Numeric average
    const nums = entry.hourly.filter((v) => typeof v === 'number');
    if (!nums.length) return null;
    return `${(nums.reduce((sum, v) => sum + v, 0) / nums.length).toFixed(1)} ${getUnit(parameter)}`.trim();
  }

  function getWarnings(entry) {
    if (!entry.hourly || !Array.isArray(entry.hourly)) return null;
    if (parameter === 'bloodPressure') {
      const abnormal = entry.hourly.some((h) => !isNormal(parameter, h));
      return abnormal ? 'Warning: Abnormal blood pressure detected' : null;
    }
    if (parameter === 'ecg') {
      return entry.hourly.some((v) => v !== 'Normal') ? 'Warning: Abnormal ECG detected' : null;
    }
    // For numeric values
    const abnormal = entry.hourly.some((v) => !isNormal(parameter, v));
    return abnormal ? 'Warning: Abnormal values detected' : null;
  }

  // Prepare chart data for today
  let chartData = today.hourly;
  if (parameter === 'bloodPressure') {
    chartData = today.hourly.map((h) => h.systolic);
  } else if (parameter === 'sleep') {
    chartData = today.hourly;
  }
  // X axis labels: 12AM, 6AM, 12PM, 6PM, 12AM
  const chartLabels = ['12AM', '6AM', '12PM', '6PM', '12AM'];
  const chartLabelIndices = [0, 6, 12, 18, 23];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={22} color="#3B4B75" />
        </TouchableOpacity>
        <Text style={styles.title}>{PARAMETER_LABELS[parameter] || parameter}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.todayRowNoBox}>
          <View style={{ flex: 1 }}>
            <Text style={styles.todayLabelNoBox}>Today</Text>
            <View style={styles.todayDateRow}>{renderDateWithSuperscript(today.date)}</View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
            <View style={[styles.statusDot, { backgroundColor: isNormal(parameter, today.value ?? today) ? '#4CAF50' : '#E57373' }]} />
            <Text style={styles.todayValueNoBox}>{formatValue(parameter, today)}</Text>
          </View>
        </View>
        {/* Chart */}
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [
                {
                  data: chartLabelIndices.map(i => chartData[i] ?? null),
                  color: () => '#3B4B75',
                  strokeWidth: 3,
                },
              ],
            }}
            width={SCREEN_WIDTH - 48}
            height={180}
            yAxisLabel={''}
            yAxisSuffix={getUnit(parameter)}
            chartConfig={{
              backgroundColor: '#E8EAF6',
              backgroundGradientFrom: '#E8EAF6',
              backgroundGradientTo: '#E8EAF6',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 75, 117, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(140, 151, 183, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#3B4B75',
              },
              propsForBackgroundLines: {
                stroke: '#B0B6C3',
                strokeDasharray: '4',
              },
            }}
            bezier
            style={{ borderRadius: 16 }}
            fromZero
          />
        </View>
        {/* Past entries */}
        {history.slice(1).map((entry, idx) => (
          <TouchableOpacity
            key={entry.date}
            style={styles.prevDayCard}
            onPress={() => { setSelectedEntry(entry); setModalVisible(true); }}
            activeOpacity={0.8}
          >
            <View style={styles.prevDayRow}>
              {renderDateWithSuperscript(entry.date)}
              <View style={[styles.statusDot, { backgroundColor: isNormal(parameter, entry.value ?? entry) ? '#4CAF50' : '#E57373' }]} />
              <Ionicons name="chevron-forward" size={20} color="#3B4B75" />
            </View>
            <Text style={styles.prevDayValue}>{formatValue(parameter, entry)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Modal for past entry details */}
      {selectedEntry && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {renderDateWithSuperscript(selectedEntry.date, styles.modalDate)}
              <Text style={styles.modalAvgLabel}>Average value:</Text>
              <Text style={styles.modalAvgValue}>{getAverage(selectedEntry)}</Text>
              {/* Chart for past entry */}
              <View style={styles.modalChartContainer}>
                <LineChart
                  data={{
                    labels: ['12AM', '6AM', '12PM', '6PM', '12AM'],
                    datasets: [
                      {
                        data: [0, 6, 12, 18, 23].map(i => selectedEntry.hourly[i] ?? null),
                        color: () => '#3B4B75',
                        strokeWidth: 3,
                      },
                    ],
                  }}
                  width={SCREEN_WIDTH - 96}
                  height={120}
                  yAxisLabel={''}
                  yAxisSuffix={getUnit(parameter)}
                  chartConfig={{
                    backgroundColor: '#E8EAF6',
                    backgroundGradientFrom: '#E8EAF6',
                    backgroundGradientTo: '#E8EAF6',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(59, 75, 117, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(140, 151, 183, ${opacity})`,
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#3B4B75',
                    },
                    propsForBackgroundLines: {
                      stroke: '#B0B6C3',
                      strokeDasharray: '4',
                    },
                  }}
                  bezier
                  style={{ borderRadius: 12 }}
                  fromZero
                />
              </View>
              <Text style={styles.modalWarning}>
                {getWarnings(selectedEntry) || 'No warnings detected'}
              </Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 24,
    backgroundColor: HEADER_BG,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
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
  todayRowNoBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 18,
  },
  todayLabelNoBox: {
    fontSize: 30,
    fontWeight: '700',
    color: '#3B4B75',
    marginBottom: 2,
  },
  todayValueNoBox: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B4B75',
    marginLeft: 6,
  },
  todayDateRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  dateRow: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3B4B75',
  },
  superscript: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B4B75',
    lineHeight: 22,
    marginLeft: 1,
    marginRight: 2,
    textAlignVertical: 'top',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  prevDayCard: {
    backgroundColor: '#E8EAF6',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 14,
    padding: 16,
  },
  prevDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  prevDayValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#8C97B7',
    marginTop: 8,
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    width: 300,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  modalDate: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3B4B75',
    marginBottom: 10,
  },
  modalAvgLabel: {
    fontSize: 16,
    color: '#3B4B75',
    marginTop: 8,
  },
  modalAvgValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B4B75',
    marginBottom: 10,
  },
  modalWarning: {
    fontSize: 16,
    color: '#E57373',
    marginTop: 8,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalCloseBtn: {
    backgroundColor: '#E8EAF6',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  modalCloseText: {
    color: '#3B4B75',
    fontWeight: '700',
    fontSize: 16,
  },
  chartContainer: {
    backgroundColor: '#E8EAF6',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 18,
    paddingVertical: 8,
    alignItems: 'center',
  },
  modalChartContainer: {
    backgroundColor: '#E8EAF6',
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
    paddingVertical: 4,
  },
});

export default ParameterDetailsScreen; 