import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import mockPatientData from '../mockPatientData';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const HEADER_BG = '#E8EAF6';

const HistoryScreen = ({ navigation }) => {
  const data = mockPatientData;

  async function handleDownload() {
    try {
      const html = generateEHRHtml(data);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share EHR PDF' });
    } catch (e) {
      Alert.alert('Error', 'Could not generate or share PDF.');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.title}>History</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleDownload}>
          <Ionicons name="download-outline" size={22} color="#3B4B75" />
        </TouchableOpacity>
      </View>
      <View style={{ height: 18 }} />
      <View style={styles.profileBox}>
        <Text style={styles.profileName}>{data.name}</Text>
      </View>
      <Text style={styles.sectionTitle}>Latest Medical Data</Text>
      {/* ECG */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ParameterDetails', { parameter: 'ecg' })}>
        <View style={styles.cardLeft}>
          <MaterialCommunityIcons name="heart-pulse" size={28} color="#3B4B75" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.cardLabel}>ECG</Text>
            <Text style={styles.cardValue}>{data.ecg}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.statusDotGreen} />
          <Ionicons name="chevron-forward" size={22} color="#3B4B75" />
        </View>
      </TouchableOpacity>
      {/* Pulse */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ParameterDetails', { parameter: 'pulse' })}>
        <View style={styles.cardLeft}>
          <Ionicons name="heart" size={28} color="#3B4B75" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.cardLabel}>Pulse</Text>
            <Text style={styles.cardValue}>{data.pulse} BPM</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.statusDotGreen} />
          <Ionicons name="chevron-forward" size={22} color="#3B4B75" />
        </View>
      </TouchableOpacity>
      {/* Body Temperature */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ParameterDetails', { parameter: 'bodyTemperature' })}>
        <View style={styles.cardLeft}>
          <Ionicons name="thermometer" size={28} color="#3B4B75" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.cardLabel}>Body Temperature</Text>
            <Text style={styles.cardValue}>{data.bodyTemperature} °C</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.statusDotGreen} />
          <Ionicons name="chevron-forward" size={22} color="#3B4B75" />
        </View>
      </TouchableOpacity>
      {/* Blood Pressure */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ParameterDetails', { parameter: 'bloodPressure' })}>
        <View style={styles.cardLeft}>
          <FontAwesome5 name="tint" size={26} color="#3B4B75" style={{ marginRight: 12 }} />
          <View>
            <Text style={styles.cardLabel}>Blood Pressure</Text>
            <Text style={styles.cardValue}>{data.bloodPressure.systolic}/{data.bloodPressure.diastolic} mmHg</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.statusDotGreen} />
          <Ionicons name="chevron-forward" size={22} color="#3B4B75" />
        </View>
      </TouchableOpacity>
      {/* SpO2 */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ParameterDetails', { parameter: 'spo2' })}>
        <View style={styles.cardLeft}>
          <FontAwesome5 name="lungs" size={26} color="#3B4B75" style={{ marginRight: 12 }} />
          <View>
            <Text style={styles.cardLabel}>SpO₂</Text>
            <Text style={styles.cardValue}>{data.spo2}%</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.statusDotGreen} />
          <Ionicons name="chevron-forward" size={22} color="#3B4B75" />
        </View>
      </TouchableOpacity>
      {/* Respiratory Rate */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ParameterDetails', { parameter: 'respiratoryRate' })}>
        <View style={styles.cardLeft}>
          <MaterialCommunityIcons name="weather-windy" size={28} color="#3B4B75" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.cardLabel}>Respiratory Rate</Text>
            <Text style={styles.cardValue}>{data.respiratoryRate} /min</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.statusDotGreen} />
          <Ionicons name="chevron-forward" size={22} color="#3B4B75" />
        </View>
      </TouchableOpacity>
      {/* HRV */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ParameterDetails', { parameter: 'hrv' })}>
        <View style={styles.cardLeft}>
          <MaterialCommunityIcons name="heart-settings" size={28} color="#3B4B75" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.cardLabel}>HRV</Text>
            <Text style={styles.cardValue}>{data.hrv} ms</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.statusDotGreen} />
          <Ionicons name="chevron-forward" size={22} color="#3B4B75" />
        </View>
      </TouchableOpacity>
      {/* Steps */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ParameterDetails', { parameter: 'steps' })}>
        <View style={styles.cardLeft}>
          <MaterialCommunityIcons name="walk" size={28} color="#3B4B75" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.cardLabel}>Steps</Text>
            <Text style={styles.cardValue}>{data.steps}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.statusDotGreen} />
          <Ionicons name="chevron-forward" size={22} color="#3B4B75" />
        </View>
      </TouchableOpacity>
      {/* Sleep */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ParameterDetails', { parameter: 'sleep' })}>
        <View style={styles.cardLeft}>
          <MaterialCommunityIcons name="sleep" size={28} color="#3B4B75" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.cardLabel}>Sleep</Text>
            <Text style={styles.cardValue}>{data.sleep.duration}h ({data.sleep.quality})</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.statusDotGreen} />
          <Ionicons name="chevron-forward" size={22} color="#3B4B75" />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

function generateEHRHtml(data) {
  const d = data.demographics;
  const today = new Date().toISOString().slice(0, 10);
  function row(label, value) {
    return `<tr><td style='font-weight:bold;padding:4px 8px;'>${label}</td><td style='padding:4px 8px;'>${value}</td></tr>`;
  }
  function sectionTitle(title) {
    return `<tr><td colspan='2' style='font-weight:bold;font-size:18px;padding:12px 0 4px 0;color:#3B4B75;'>${title}</td></tr>`;
  }
  // Vitals
  const vitals = [
    row('Pulse', data.pulse + ' BPM'),
    row('Body Temperature', data.bodyTemperature + ' °C'),
    row('Blood Pressure', data.bloodPressure.systolic + '/' + data.bloodPressure.diastolic + ' mmHg'),
    row('SpO₂', data.spo2 + ' %'),
    row('Respiratory Rate', data.respiratoryRate + ' /min'),
    row('HRV', data.hrv + ' ms'),
    row('Steps', data.steps),
    row('Sleep', data.sleep.duration + 'h (' + data.sleep.quality + ')'),
    row('ECG', data.ecg),
  ].join('');
  // Recommendations
  const recs = (data.recommendations || []).map(r => `<li>${r.text}</li>`).join('');
  return `
    <html>
      <head>
        <meta charset='utf-8' />
        <title>Electronic Health Record</title>
      </head>
      <body style='font-family:sans-serif;background:#F5F6FA;'>
        <h2 style='color:#3B4B75;text-align:center;margin-bottom:0;'>Electronic Health Record (HL7 style)</h2>
        <table style='width:100%;margin:16px 0 24px 0;background:#E8EAF6;border-radius:12px;'>
          ${sectionTitle('Patient Demographics')}
          ${row('Name', d.name)}
          ${row('Patient ID', d.patientId)}
          ${row('Date of Birth', d.dob)}
          ${row('Gender', d.gender)}
          ${row('Address', d.address)}
          ${row('Phone', d.phone)}
          ${row('Email', d.email)}
        </table>
        <table style='width:100%;margin-bottom:24px;background:#E8EAF6;border-radius:12px;'>
          ${sectionTitle('Current Vitals & Observations')}
          ${vitals}
        </table>
        <div style='margin-bottom:24px;'>
          <div style='font-weight:bold;font-size:18px;color:#3B4B75;margin-bottom:8px;'>Doctor Recommendations</div>
          <ul>${recs}</ul>
        </div>
        <div style='font-size:12px;color:#888;text-align:center;margin-top:32px;'>Generated on ${today}</div>
      </body>
    </html>
  `;
}

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
  profileBox: {
    backgroundColor: '#E8EAF6',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 0,
    marginHorizontal: 24,
    marginBottom: 18,
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#3B4B75',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3B4B75',
    marginLeft: 24,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F0F1F6',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B4B75',
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3B4B75',
    marginTop: 2,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
});

export default HistoryScreen; 