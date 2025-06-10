import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, DateData } from 'react-native-calendars';

// Mock data for recommendations
const MOCK_RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Blood Pressure Monitoring',
    description: 'Monitor blood pressure twice daily, morning and evening',
    date: '2024-03-15',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Medication Adjustment',
    description: 'Increase Lisinopril to 20mg starting next week',
    date: '2024-03-20',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Exercise Routine',
    description: 'Start with 15 minutes of walking daily, gradually increase to 30 minutes',
    date: '2024-03-25',
    priority: 'low',
  },
];

// Replace the mock events with only one follow-up appointment
const MOCK_EVENTS = [
  {
    date: '2024-06-12',
    title: 'Follow-up Appointment',
    time: '10:00',
    location: 'HeartSync Clinic',
    type: 'appointment',
    priority: 'high',
  },
];

// Convert MOCK_EVENTS to the format expected by the Calendar component
const getMarkedDates = () => {
  const markedDates: { [key: string]: { marked: boolean; dotColor?: string } } = {};
  MOCK_EVENTS.forEach(event => {
    markedDates[event.date] = {
      marked: true,
      dotColor: '#2196F3', // Set a default dot color for marked dates
    };
  });
  return markedDates;
};

const PatientDetailsScreen = ({ navigation }: any) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['user', 'token']);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDownloadPDF = () => {
    Alert.alert(
      'Download Medical File',
      'Your medical file will be downloaded as a PDF. This is a mock implementation.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Download',
          onPress: () => {
            Alert.alert('Success', 'Medical file downloaded successfully!');
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDownloadPDF} style={styles.downloadButton}>
          <Icon name="file-download" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>Patient Details</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.welcomeText}>Hello, John!</Text>
          <View style={styles.personalInfoCard}>
            <View style={styles.personalInfoRow}>
              <Icon name="person" size={20} color="#2196F3" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>45 years old</Text>
              </View>
            </View>
            <View style={styles.personalInfoRow}>
              <Icon name="medical-services" size={20} color="#2196F3" style={styles.infoIcon} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Primary Doctor</Text>
                <Text style={styles.infoValue}>Dr. Sarah Smith</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Recommendations</Text>
          {MOCK_RECOMMENDATIONS.map((recommendation) => (
            <View key={recommendation.id} style={styles.recommendationItem}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(recommendation.priority) }]} />
              </View>
              <Text style={styles.recommendationDescription}>
                {recommendation.description}
              </Text>
              <Text style={styles.recommendationDate}>
                Date: {recommendation.date}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Medication 1:</Text>
            <Text style={styles.value}>Lisinopril 10mg</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Medication 2:</Text>
            <Text style={styles.value}>Metformin 500mg</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <View style={styles.agendaContainer}>
            {MOCK_EVENTS
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((event, index) => (
                <View key={index} style={styles.agendaItem}>
                  <View style={styles.agendaDate}>
                    <Text style={styles.agendaDay}>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                    <Text style={styles.agendaDateNumber}>{new Date(event.date).getDate()}</Text>
                    <Text style={styles.agendaMonth}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</Text>
                  </View>
                  <View style={styles.agendaContent}>
                    <View style={styles.agendaHeader}>
                      <Text style={styles.agendaTitle}>{event.title}</Text>
                      <View style={[styles.eventType, { backgroundColor: getPriorityColor(event.priority) }]} />
                    </View>
                    <View style={styles.agendaDetails}>
                      <View style={styles.agendaDetailRow}>
                        <Icon name="access-time" size={16} color="#666" />
                        <Text style={styles.agendaDetailText}>{event.time}</Text>
                      </View>
                      <View style={styles.agendaDetailRow}>
                        <Icon name="location-on" size={16} color="#666" />
                        <Text style={styles.agendaDetailText}>{event.location}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  downloadButton: {
    padding: 8,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  recommendationItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  recommendationDate: {
    fontSize: 12,
    color: '#999',
  },
  eventDetails: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  eventType: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  personalInfoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  personalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  agendaContainer: {
    marginTop: 8,
  },
  agendaItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  agendaDate: {
    width: 70,
    backgroundColor: '#2196F3',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agendaDay: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  agendaDateNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  agendaMonth: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  agendaContent: {
    flex: 1,
    padding: 12,
  },
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agendaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  agendaDetails: {
    marginTop: 4,
  },
  agendaDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  agendaDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});

export default PatientDetailsScreen; 