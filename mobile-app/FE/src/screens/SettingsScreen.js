import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HEADER_BG = '#E8EAF6';

const SettingsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.header}>
        <View style={styles.iconButton} />
        <Text style={styles.title}>Settings</Text>
        <View style={styles.iconButton} />
      </View>
      <View style={{ height: 18 }} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity 
          style={styles.row}
          onPress={() => navigation.navigate('ProfileInfo')}
        >
          <Ionicons name="person-circle" size={22} color="#3B4B75" />
          <Text style={styles.label}>Profile Info</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <Ionicons name="lock-closed" size={22} color="#3B4B75" />
          <Text style={styles.label}>Change Password</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.row}>
          <Ionicons name="notifications" size={22} color="#3B4B75" />
          <Text style={styles.label}>Push Notifications</Text>
          <Switch value={true} />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <TouchableOpacity 
          style={styles.row}
          onPress={() => navigation.navigate('About')}
        >
          <Ionicons name="information-circle" size={22} color="#3B4B75" />
          <Text style={styles.label}>About</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 0,
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B4B75',
    textAlign: 'center',
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#3B4B75', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  label: { marginLeft: 10, fontSize: 16, color: '#3B4B75', flex: 1 },
});

export default SettingsScreen; 