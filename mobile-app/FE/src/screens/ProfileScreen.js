import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import mockPatientData from '../mockPatientData';

const HEADER_BG = '#E8EAF6';

const ProfileScreen = ({ navigation }) => {
  const today = new Date().toISOString().slice(0, 10); // e.g., '2025-04-03'
  const recommendations = mockPatientData.recommendations || [];
  const newRecs = recommendations.filter(r => r.new && r.date === today);
  const oldRecs = recommendations.filter(r => !(r.new && r.date === today));

  return (
    <View style={styles.flexGrow}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL('tel:+40123456789')}>
            <Ionicons name="call" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ height: 24 }} />
        <View style={styles.greetingRowMockup}>
          <Text style={styles.greeting}>Hello, John!</Text>
          <TouchableOpacity 
            style={styles.avatarMockup}
            onPress={() => navigation.navigate('ProfileInfo')}
          >
            <Ionicons name="person" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={{ height: 18 }} />
        <View style={styles.recommendationsCard}>
          <View style={styles.recommendationsHeader}>
            <Text style={styles.recommendationsTitle}>
              <Text style={{ textDecorationLine: 'underline', fontWeight: '700' }}>{"Dr. Anderson's\nRecommendations"}</Text>
            </Text>
            <View style={{ position: 'relative' }}>
              <Ionicons name="notifications" size={22} color="#E57373" style={{ marginLeft: 8 }} />
              {newRecs.length > 0 && (
                <View style={styles.bellBubble}>
                  <Text style={styles.bellBubbleText}>{newRecs.length}</Text>
                </View>
              )}
            </View>
          </View>
          {/* All recommendations as bullet points, new ones styled differently */}
          {newRecs.concat(oldRecs).map((rec, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={[styles.bullet, rec.new && rec.date === today ? styles.bulletRed : null]}>•</Text>
              <Text style={[styles.recommendationText, rec.new && rec.date === today ? styles.recommendationTextNew : null]}>{rec.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomMenuContainer}>
        <TouchableOpacity 
          style={styles.menuItemMockup}
          onPress={() => navigation.navigate('Calendar')}
        >
          <MaterialCommunityIcons name="calendar" size={28} color="#3B4B75" />
          <Text style={styles.menuTextMockup}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuItemMockup}
          onPress={() => navigation.navigate('Alerts')}
        >
          <Ionicons name="warning" size={28} color="#E57373" />
          <Text style={styles.menuTextMockup}>Alerts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexGrow: {
    flex: 1,
  },
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
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E57373',
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
  greetingRowMockup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    marginBottom: 0,
    zIndex: 2,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: '#3B4B75',
  },
  avatarMockup: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B4B75',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    marginRight: 2,
  },
  recommendationsCard: {
    backgroundColor: '#E8EAF6',
    borderRadius: 18,
    marginHorizontal: 18,
    marginBottom: 32,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 1,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  recommendationsTitle: {
    fontSize: 22,
    color: '#3B4B75',
    fontWeight: '700',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 18,
    color: '#3B4B75',
    marginRight: 8,
    marginTop: 2,
  },
  bulletRed: {
    color: '#E57373',
  },
  recommendationText: {
    fontSize: 16,
    color: '#3B4B75',
    lineHeight: 22,
    flex: 1,
  },
  recommendationTextNew: {
    color: '#E57373',
    fontWeight: '700',
  },
  bottomMenuContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingVertical: 18,
    gap: 32,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemMockup: {
    width: 120,
    aspectRatio: 1.1,
    backgroundColor: HEADER_BG,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  menuTextMockup: {
    marginTop: 12,
    color: '#3B4B75',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  bellBubble: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#E57373',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 2,
  },
  bellBubbleText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});

export default ProfileScreen; 