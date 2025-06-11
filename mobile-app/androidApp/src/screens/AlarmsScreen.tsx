import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AlertService, { Alarm } from '../../services/alarms.services';

const AlarmsScreen = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlarms = async () => {
    try {
      setError(null);
      const data = await AlertService.getAlarms();
      setAlarms(data);
    } catch (err) {
      setError('Failed to fetch alarms. Please try again.');
      console.error('Error fetching alarms:', err);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlarms();
    setRefreshing(false);
  };

  const renderAlarmItem = ({ item }: { item: Alarm }) => (
    <View style={styles.alarmItem}>
      <View style={styles.alarmHeader}>
        <View style={styles.alarmTypeContainer}>
          <Icon 
            name={item.isActive ? "notifications-active" : "notifications-off"} 
            size={24} 
            color={item.isActive ? "#4CAF50" : "#9E9E9E"} 
          />
          <Text style={styles.alarmType}>{item.parameter}</Text>
        </View>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: item.isActive ? '#4CAF50' : '#9E9E9E' },
          ]}
        />
      </View>
      
      <View style={styles.alarmDetails}>
        <Text style={styles.alarmMessage}>{item.message || 'No message'}</Text>
        <Text style={styles.alarmThreshold}>Threshold: {item.threshold}</Text>
        <Text style={styles.alarmDate}>
          Created: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alarms</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          renderItem={renderAlarmItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="notifications-off" size={48} color="#9E9E9E" />
              <Text style={styles.emptyText}>No alarms found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  alarmItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alarmTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  alarmDetails: {
    marginTop: 8,
  },
  alarmMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  alarmThreshold: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 4,
  },
  alarmDate: {
    fontSize: 12,
    color: '#999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 8,
  },
});

export default AlarmsScreen; 