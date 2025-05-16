import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import mockPatientData from '../mockPatientData';

const HEADER_BG = '#E8EAF6';

const ProfileInfoScreen = ({ navigation }) => {
  const { demographics, medications, recommendations } = mockPatientData;
  const today = new Date().toISOString().slice(0, 10);
  const newRecs = recommendations.filter(r => r.new && r.date === today);
  const oldRecs = recommendations.filter(r => !(r.new && r.date === today));

  const InfoSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#3B4B75" />
        </TouchableOpacity>
        <Text style={styles.title}>Medical Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Personal Information Section */}
        <InfoSection title="Personal Information">
          <InfoRow label="Full Name" value={`${demographics.name} ${demographics.surname}`} />
          <InfoRow label="Patient ID" value={demographics.patientId} />
          <InfoRow label="CNP" value={demographics.cnp} />
          <InfoRow label="Date of Birth" value={demographics.dob} />
          <InfoRow label="Gender" value={demographics.gender} />
          <InfoRow label="Address" value={demographics.address} />
          <InfoRow label="Phone" value={demographics.phone} />
          <InfoRow label="Email" value={demographics.email} />
        </InfoSection>

        {/* Current Medications Section */}
        <InfoSection title="Current Medications">
          {medications
            .filter(med => med.status === 'current')
            .map((medication, index) => (
              <View key={medication.productId} style={styles.medicationItem}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <Text style={styles.medicationDetails}>
                  Dosage: {medication.dosage}
                </Text>
                <Text style={styles.medicationDetails}>
                  Started: {medication.startDate}
                </Text>
                <Text style={styles.medicationDetails}>
                  Last Prescription: {medication.lastPrescription}
                </Text>
              </View>
            ))}
        </InfoSection>

        {/* Recommendations Section */}
        <InfoSection title="Health Recommendations">
          {newRecs.concat(oldRecs).map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons 
                name="bulb-outline" 
                size={20} 
                color={recommendation.new && recommendation.date === today ? "#E57373" : "#3B4B75"} 
                style={styles.recommendationIcon} 
              />
              <Text style={[
                styles.recommendationText,
                recommendation.new && recommendation.date === today && styles.recommendationTextNew
              ]}>
                {recommendation.text}
              </Text>
            </View>
          ))}
        </InfoSection>
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
    backgroundColor: HEADER_BG,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  backButton: {
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
    paddingBottom: 32,
  },
  section: {
    backgroundColor: '#E8EAF6',
    marginVertical: 8,
    marginHorizontal: 18,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3B4B75',
    marginBottom: 12,
  },
  sectionContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 16,
    color: '#3B4B75',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#3B4B75',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  medicationItem: {
    backgroundColor: '#F5F6FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B4B75',
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: 14,
    color: '#3B4B75',
    marginTop: 2,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  recommendationIcon: {
    marginRight: 12,
  },
  recommendationText: {
    fontSize: 16,
    color: '#3B4B75',
    flex: 1,
    lineHeight: 22,
  },
  recommendationTextNew: {
    color: '#E57373',
    fontWeight: '700',
  },
});

export default ProfileInfoScreen; 