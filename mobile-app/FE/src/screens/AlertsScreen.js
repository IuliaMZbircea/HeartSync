import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Thresholds matching HistoryScreen
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

// Mock recorded abnormal values (in a real app, this would come from the same data source as HistoryScreen)
const mockRecordedAlerts = [
  {
    id: 1,
    type: 'heart_rate',
    message: 'Heart rate is above normal range',
    currentValue: '110 bpm',
    threshold: '60-100 bpm',
    severity: 'high',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: 'active',
  },
  {
    id: 2,
    type: 'blood_pressure',
    message: 'Blood pressure is above normal range',
    currentValue: '145/95 mmHg',
    threshold: '90-130/60-85 mmHg',
    severity: 'high',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    status: 'active',
  },
  {
    id: 3,
    type: 'oxygen_saturation',
    message: 'Oxygen saturation is below normal range',
    currentValue: '93%',
    threshold: '>95%',
    severity: 'medium',
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    status: 'active',
  },
  {
    id: 4,
    type: 'temperature',
    message: 'Body temperature is above normal range',
    currentValue: '37.8°C',
    threshold: '36.1-37.2°C',
    severity: 'medium',
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    status: 'active',
  },
];

const getAlertIcon = (type) => {
  switch (type) {
    case 'heart_rate':
      return 'pulse';
    case 'blood_pressure':
      return 'water';
    case 'oxygen_saturation':
      return 'fitness';
    case 'temperature':
      return 'thermometer';
    case 'humidity':
      return 'water-outline';
    case 'qt_interval':
    case 'pr_interval':
      return 'heart';
    default:
      return 'alert';
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'high':
      return '#FF3B30';
    case 'medium':
      return '#FF9500';
    case 'low':
      return '#FFCC00';
    default:
      return '#3B4B75';
  }
};

const formatTimestamp = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const AlertsScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState(mockRecordedAlerts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch the latest recorded alerts
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#3B4B75" />
        </TouchableOpacity>
        <Text style={styles.title}>Health Alerts</Text>
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
        {alerts.map(alert => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <View style={styles.alertType}>
                <Ionicons
                  name={getAlertIcon(alert.type)}
                  size={24}
                  color={getSeverityColor(alert.severity)}
                />
                <Text style={styles.alertTypeText}>
                  {alert.type.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
              </View>
              <View style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor(alert.severity) }
              ]}>
                <Text style={styles.severityText}>
                  {alert.severity.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={styles.alertMessage}>{alert.message}</Text>
            
            <View style={styles.alertDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Current Value</Text>
                <Text style={styles.detailValue}>{alert.currentValue}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Normal Range</Text>
                <Text style={styles.detailValue}>{alert.threshold}</Text>
              </View>
            </View>
            
            <View style={styles.alertFooter}>
              <Text style={styles.timestamp}>
                {formatTimestamp(alert.timestamp)}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: alert.status === 'active' ? '#4CAF50' : '#9E9E9E' }
              ]}>
                <Text style={styles.statusText}>
                  {alert.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        ))}
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
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTypeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#3B4B75',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  alertMessage: {
    fontSize: 14,
    color: '#3B4B75',
    marginBottom: 16,
  },
  alertDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#3B4B75',
    opacity: 0.7,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B4B75',
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#3B4B75',
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AlertsScreen; 