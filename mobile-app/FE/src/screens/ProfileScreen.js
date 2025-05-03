import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>Hello, John!</Text>

      <View style={styles.recommendationsContainer}>
        <Text style={styles.recommendationsTitle}>
          Dr. Anderson's Recommendations
        </Text>

        <View style={styles.recommendationItem}>
          <Text style={styles.recommendationText}>
            Your heart rate has been slightly elevated this week. Reduce stress and get enough rest.
          </Text>
        </View>

        <View style={styles.recommendationItem}>
          <Text style={styles.recommendationText}>
            Take Metoprolol (25mg) once daily after breakfast.
          </Text>
        </View>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="calendar" size={24} color="#3B4B75" />
          <Text style={styles.menuText}>Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="warning" size={24} color="#E57373" />
          <Text style={styles.menuText}>Alerts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person" size={24} color="#3B4B75" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text" size={24} color="#3B4B75" />
          <Text style={styles.menuText}>Records</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings" size={24} color="#3B4B75" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3B4B75',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8C97B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: '#3B4B75',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recommendationsContainer: {
    padding: 20,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3B4B75',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  recommendationItem: {
    backgroundColor: '#E8EAF6',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 16,
    color: '#3B4B75',
    lineHeight: 22,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-around',
  },
  menuItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F5F6FA',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  menuText: {
    marginTop: 8,
    color: '#3B4B75',
    fontSize: 14,
  },
});

export default ProfileScreen; 