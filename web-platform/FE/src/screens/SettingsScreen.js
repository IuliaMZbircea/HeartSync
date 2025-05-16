import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HEADER_BG = '#E8EAF6';

const SettingsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.title}>Settings</Text>
        <View style={styles.iconButton}>
          <Ionicons name="settings" size={22} color="#3B4B75" />
        </View>
      </View>
      <View style={{ height: 18 }} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.row}>
          <Ionicons name="person-circle" size={22} color="#3B4B75" />
          <Text style={styles.label}>Profile Info</Text>
        </View>
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
        <View style={styles.row}>
          <Ionicons name="information-circle" size={22} color="#3B4B75" />
          <Text style={styles.label}>About</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
