import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import alarmService, { Alarm } from '../services/alarm.service';

const API_URL = 'https://d6b6-193-226-8-99.ngrok-free.app';

export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlarms = async () => {
    try {
      console.log('Fetching alarms from thresholds endpoint');
      const fetchedAlarms = await alarmService.getAllAlarms();
      console.log('Raw alarms response:', fetchedAlarms);
      
      // Filter alarms for patient_id 1
      const userAlarms = fetchedAlarms.filter(alarm => alarm.patient_id === 1);
      console.log('Filtered alarms for patient 1:', userAlarms);
      
      setAlarms(userAlarms);
    } catch (error: any) {
      console.error('Failed to fetch alarms:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      Alert.alert('Error', 'Failed to fetch alarms. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlarms();
  };

  const getParameterIcon = (parameter: string) => {
    switch (parameter.toLowerCase()) {
      case 'pulse':
        return 'favorite';
      case 'temperature':
        return 'thermostat';
      case 'humidity':
        return 'water-drop';
      default:
        return 'warning';
    }
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const AlarmCard = ({ alarm }: { alarm: Alarm }) => (
    <View style={[styles.card, !alarm.isActive && styles.inactiveCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.parameterContainer}>
          <Icon 
            name={getParameterIcon(alarm.parameter)} 
            size={24} 
            color={alarm.isActive ? '#2196F3' : '#9E9E9E'}
          />
          <Text style={styles.parameterText}>
            {alarm.parameter.charAt(0).toUpperCase() + alarm.parameter.slice(1)}
          </Text>
        </View>
        <View style={[
          styles.statusBadge, 
          alarm.isActive ? styles.activeBadge : styles.inactiveBadge
        ]}>
          <Text style={styles.statusText}>
            {alarm.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.conditionRow}>
          <Text style={styles.label}>Min Value:</Text>
          <Text style={styles.value}>{alarm.minValue}</Text>
        </View>
        <View style={styles.conditionRow}>
          <Text style={styles.label}>Max Value:</Text>
          <Text style={styles.value}>{alarm.maxValue}</Text>
        </View>
        <View style={styles.conditionRow}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{alarm.durationMinutes} min</Text>
        </View>
        <Text style={styles.messageHighlight}>{alarm.message}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Custom Alarms</Text>
        <Text style={styles.subtitle}>Total: {alarms.length}</Text>
      </View>
      {alarms.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="notifications-off" size={48} color="#9E9E9E" />
          <Text style={styles.emptyText}>No alarms configured</Text>
        </View>
      ) : (
        alarms.map((alarm) => (
          <AlarmCard key={alarm.id} alarm={alarm} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
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
  inactiveCard: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  parameterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parameterText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#212121',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#E3F2FD',
  },
  inactiveBadge: {
    backgroundColor: '#EEEEEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    marginTop: 8,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  activityText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    color: '#616161',
    marginTop: 8,
  },
  messageHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 8,
  },
}); 