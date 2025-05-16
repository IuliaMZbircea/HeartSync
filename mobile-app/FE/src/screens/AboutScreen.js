import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HEADER_BG = '#E8EAF6';

const AboutScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#3B4B75" />
        </TouchableOpacity>
        <Text style={styles.title}>About</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.appName}>HeartSync</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>About HeartSync</Text>
          <Text style={styles.description}>
            HeartSync is a comprehensive patient monitoring platform that integrates with wearable devices to provide real-time health tracking and analysis. Our mission is to empower patients and healthcare providers with advanced monitoring tools and actionable insights.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="pulse" size={20} color="#3B4B75" style={styles.featureIcon} />
              <Text style={styles.featureText}>Real-time vital signs monitoring</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={20} color="#3B4B75" style={styles.featureIcon} />
              <Text style={styles.featureText}>Comprehensive health analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="notifications" size={20} color="#3B4B75" style={styles.featureIcon} />
              <Text style={styles.featureText}>Smart health alerts</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="document-text" size={20} color="#3B4B75" style={styles.featureIcon} />
              <Text style={styles.featureText}>Detailed health reports</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Contact & Support</Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color="#3B4B75" style={styles.contactIcon} />
            <Text style={styles.contactText}>support@heartsync.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call" size={20} color="#3B4B75" style={styles.contactIcon} />
            <Text style={styles.contactText}>+40 123 456 789</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.copyright}>
            © 2024 HeartSync. All rights reserved.
          </Text>
        </View>
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
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B4B75',
    textAlign: 'center',
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    color: '#3B4B75',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#3B4B75',
    opacity: 0.1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B4B75',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#3B4B75',
    lineHeight: 24,
    marginBottom: 8,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#3B4B75',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#3B4B75',
  },
  copyright: {
    fontSize: 14,
    color: '#3B4B75',
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default AboutScreen; 