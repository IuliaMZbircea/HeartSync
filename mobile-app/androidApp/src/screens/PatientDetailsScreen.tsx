import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, DateData } from 'react-native-calendars';
import patientService, { Patient, PatientAllergy, PatientDisease } from '../services/patient.service';
import medicationService, { MedicationRequest } from '../services/medication.service';
import recommendationService, { Recommendation } from '../services/recommendation.service';

type Severity = 'mild' | 'moderate' | 'severe';
type DiseaseType = 'chronic' | 'infectious' | 'degenerative';
type MedicationStatus = 'active' | 'completed' | 'stopped' | 'cancelled';

interface StylesType extends Record<string, any> {
  severitymild: any;
  severitymoderate: any;
  severitysevere: any;
  typechronic: any;
  typeinfectious: any;
  typedegenerative: any;
  statusactive: any;
  statuscompleted: any;
  statusstopped: any;
  statuscancelled: any;
}

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
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<MedicationRequest[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPatientInfo, setShowPatientInfo] = useState(false);

  const fetchAllData = async () => {
    try {
      setError(null);
      console.log('Fetching all patient data...');
      
      const [patientData, medicationsData, recommendationsData] = await Promise.all([
        patientService.getPatientDetails(),
        medicationService.getPatientMedications(),
        recommendationService.getPatientRecommendations(),
      ]);
      
      console.log('Fetched patient data:', patientData);
      console.log('Fetched medications:', medicationsData);
      console.log('Fetched recommendations:', recommendationsData);
      
      setPatient(patientData);
      setMedications(medicationsData);
      setRecommendations(recommendationsData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Error loading data: ${errorMessage}`);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

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

  const PatientInfoCard = () => (
    <View style={styles.card}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#2196F3', marginBottom: 8 }}>
        Hello, {patient?.firstName} {patient?.lastName}!
      </Text>
      <TouchableOpacity onPress={() => setShowPatientInfo((prev) => !prev)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Icon name="person" size={24} color="#2196F3" />
        <Text style={styles.cardTitle}>Show Details</Text>
        <Icon name={showPatientInfo ? 'expand-less' : 'expand-more'} size={24} color="#2196F3" style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>
      {showPatientInfo && (
        <View style={styles.cardContent}>
          <Text style={styles.label}>Email: <Text style={styles.value}>{patient?.email}</Text></Text>
          <Text style={styles.label}>Phone: <Text style={styles.value}>{patient?.phone}</Text></Text>
          <Text style={styles.label}>Birth Date: <Text style={styles.value}>{patient?.birthDate ? new Date(patient.birthDate).toLocaleDateString() : 'N/A'}</Text></Text>
          <Text style={styles.label}>Sex: <Text style={styles.value}>{patient?.sex || 'N/A'}</Text></Text>
          <Text style={styles.label}>Weight: <Text style={styles.value}>{patient?.weight} kg</Text></Text>
          <Text style={styles.label}>Height: <Text style={styles.value}>{patient?.height} cm</Text></Text>
          <Text style={styles.label}>Blood Group: <Text style={styles.value}>{patient?.bloodGroup} {patient?.rh}</Text></Text>
          <Text style={styles.label}>Address: <Text style={styles.value}>{patient?.locality}, {patient?.street} {patient?.number}</Text></Text>
        </View>
      )}
    </View>
  );

  const AllergyCard = ({ allergy }: { allergy: PatientAllergy }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="warning" size={20} color="#FF9800" />
        <Text style={styles.allergyName}>{allergy.name}</Text>
        <View style={[
          styles.severityTag,
          styles[`severity${allergy.severity as Severity}`] as any
        ]}>
          <Text style={styles.severityText}>{allergy.severity}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.allergyInfo}>Reaction: {allergy.reaction}</Text>
        <Text style={styles.allergyInfo}>Notes: {allergy.notes}</Text>
        <Text style={styles.allergyDate}>
          Recorded: {new Date(allergy.recordedDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const DiseaseCard = ({ disease }: { disease: PatientDisease }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="local-hospital" size={20} color="#F44336" />
        <Text style={styles.diseaseName}>{disease.name}</Text>
        <View style={[
          styles.typeTag,
          styles[`type${disease.type as DiseaseType}`] as any
        ]}>
          <Text style={styles.typeText}>{disease.type}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.diseaseDescription}>{disease.description}</Text>
      </View>
    </View>
  );

  const MedicationCard = ({ medication }: { medication: MedicationRequest }) => (
    <View style={styles.card}>
      <View style={styles.medicationHeader}>
        <View style={styles.medicationTitleContainer}>
          <Icon name="medication" size={20} color="#2196F3" />
          <Text style={styles.medicationName}>
            {medication.medicationCodeableConcept.text}
          </Text>
        </View>
        <View style={[
          styles.statusTag,
          styles[`status${medication.status}`] as any
        ]}>
          <Text style={styles.statusText}>{medication.status}</Text>
        </View>
      </View>
      
      <View style={styles.medicationDetails}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Dosage:</Text>
          <Text style={styles.value}>{medication.dosageInstruction[0]?.text || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Route:</Text>
          <Text style={styles.value}>{medication.route.text}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Prescribed:</Text>
          <Text style={styles.value}>{new Date(medication.authoredOn).toLocaleDateString()}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Doctor:</Text>
          <Text style={styles.value}>{medication.prescribedBy}</Text>
        </View>

        {medication.note?.length > 0 && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            {medication.note.map((note, index) => (
              <Text key={index} style={styles.noteText}>• {note.text}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => (
    <View style={[styles.card, { marginBottom: 16, borderLeftWidth: 5, borderLeftColor: '#2196F3', backgroundColor: '#F8FAFF' }]}> 
      <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#D32F2F', marginBottom: 6 }}>
        {recommendation.additionalNotes || 'No notes provided'}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Icon name="category" size={18} color="#2196F3" style={{ marginRight: 4 }} />
        <Text style={{ fontSize: 15, color: '#2196F3', fontWeight: '600' }}>{recommendation.activityType}</Text>
        <View style={[styles.priorityTag, recommendation.isActive ? styles.priorityhigh : styles.prioritylow, { marginLeft: 10 }]}>
          <Text style={styles.priorityText}>{recommendation.isActive ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 15, color: '#333' }}>Daily Duration: {recommendation.dailyDuration} min</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <PatientInfoCard />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations ({recommendations.length})</Text>
          {recommendations.length === 0 ? (
            <Text style={styles.emptyText}>No recommendations available</Text>
          ) : (
            recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies ({patient?.allergies.length || 0})</Text>
          {patient?.allergies.length === 0 ? (
            <Text style={styles.emptyText}>No known allergies</Text>
          ) : (
            patient?.allergies.map((allergy) => (
              <AllergyCard key={allergy.id} allergy={allergy} />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Conditions ({patient?.diseases.length || 0})</Text>
          {patient?.diseases.length === 0 ? (
            <Text style={styles.emptyText}>No medical conditions recorded</Text>
          ) : (
            patient?.diseases.map((disease) => (
              <DiseaseCard key={disease.id} disease={disease} />
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medications ({medications.length})</Text>
          {medications.length === 0 ? (
            <Text style={styles.emptyText}>No medications prescribed</Text>
          ) : (
            medications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))
          )}
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
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#212121',
  },
  cardContent: {
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#212121',
  },
  medicationDetails: {
    gap: 4,
  },
  medicationInfo: {
    fontSize: 14,
    color: '#424242',
  },
  instructions: {
    fontSize: 14,
    color: '#616161',
    marginTop: 8,
    fontStyle: 'italic',
  },
  inactiveTag: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveText: {
    fontSize: 12,
    color: '#757575',
  },
  recommendationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationType: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#212121',
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  prioritylow: {
    backgroundColor: '#E8F5E9',
  },
  prioritymedium: {
    backgroundColor: '#FFF3E0',
  },
  priorityhigh: {
    backgroundColor: '#FFEBEE',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusactive: {
    backgroundColor: '#E8F5E9',
  },
  statuscompleted: {
    backgroundColor: '#E3F2FD',
  },
  statusstopped: {
    backgroundColor: '#FFF3E0',
  },
  statuscancelled: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#212121',
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
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
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 8,
  },
  infoSection: {
    marginTop: 16,
    gap: 8,
  },
  allergyName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#212121',
    flex: 1,
  },
  severityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severitymild: {
    backgroundColor: '#E8F5E9',
  },
  severitymoderate: {
    backgroundColor: '#FFF3E0',
  },
  severitysevere: {
    backgroundColor: '#FFEBEE',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#212121',
  },
  allergyInfo: {
    fontSize: 14,
    color: '#424242',
  },
  allergyDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 8,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#212121',
    flex: 1,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typechronic: {
    backgroundColor: '#E3F2FD',
  },
  typeinfectious: {
    backgroundColor: '#FFF3E0',
  },
  typedegenerative: {
    backgroundColor: '#F3E5F5',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#212121',
  },
  diseaseDescription: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 16,
  },
  recommendationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default PatientDetailsScreen; 