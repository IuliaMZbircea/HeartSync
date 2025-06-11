import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import alarmService, { Alarm } from '../services/alarm.service';

export const TestAlarmsScreen = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [error, setError] = useState<string>('');

  const fetchAlarms = async () => {
    try {
      const fetchedAlarms = await alarmService.getAllAlarms();
      setAlarms(fetchedAlarms);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const createTestAlarm = async () => {
    try {
      await alarmService.createTestAlarm();
      await fetchAlarms();
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Alarms</Text>
      
      <Button 
        title="Create Test Alarm" 
        onPress={createTestAlarm}
      />
      
      <Button 
        title="Refresh Alarms" 
        onPress={fetchAlarms}
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <ScrollView style={styles.alarmList}>
        {alarms.map((alarm, index) => (
          <View key={alarm.id || index} style={styles.alarmItem}>
            <Text>Parameter: {alarm.parameter}</Text>
            <Text>Condition: {alarm.condition_type}</Text>
            <Text>Threshold: {alarm.threshold}</Text>
            <Text>Duration: {alarm.duration}s</Text>
            <Text>Message: {alarm.message}</Text>
            <Text>Active: {alarm.is_active ? 'Yes' : 'No'}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginVertical: 16,
  },
  alarmList: {
    marginTop: 16,
  },
  alarmItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
}); 