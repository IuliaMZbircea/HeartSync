import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HEADER_BG = '#E8EAF6';

// Get today's date in YYYY-MM-DD format
const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

// Mock data for calendar activities
const mockActivities = [
  {
    date: todayStr, // Today
    activities: [
      {
        time: '09:00',
        title: 'Morning Check-up',
        description: 'Daily health status review',
        type: 'appointment',
        duration: '30 min',
      },
      {
        time: '12:00',
        title: 'Blood Pressure Check',
        description: 'Measure and record blood pressure',
        type: 'measurement',
        duration: '5 min',
      },
      {
        time: '15:00',
        title: 'Medication Reminder',
        description: 'Take prescribed beta-blocker',
        type: 'medication',
        duration: '5 min',
      },
    ],
  },
  {
    date: `${today.getFullYear()}-05-01`,
    activities: [
      {
        time: '09:00',
        title: 'Cardiology Consultation',
        description: 'Regular check-up with Dr. Anderson',
        type: 'appointment',
        duration: '45 min',
      },
      {
        time: '14:00',
        title: 'Blood Pressure Check',
        description: 'Measure and record blood pressure',
        type: 'measurement',
        duration: '5 min',
      },
    ],
  },
  {
    date: `${today.getFullYear()}-05-05`,
    activities: [
      {
        time: '08:00',
        title: 'Morning Exercise',
        description: 'Light cardio and stretching',
        type: 'exercise',
        duration: '30 min',
      },
      {
        time: '12:00',
        title: 'Medication Reminder',
        description: 'Take prescribed beta-blocker',
        type: 'medication',
        duration: '5 min',
      },
    ],
  },
  {
    date: `${today.getFullYear()}-05-10`,
    activities: [
      {
        time: '10:00',
        title: 'Stress Test',
        description: 'Cardiac stress test at the hospital',
        type: 'appointment',
        duration: '1 hour',
      },
      {
        time: '15:00',
        title: 'Blood Pressure Check',
        description: 'Measure and record blood pressure',
        type: 'measurement',
        duration: '5 min',
      },
    ],
  },
  {
    date: `${today.getFullYear()}-05-15`,
    activities: [
      {
        time: '09:00',
        title: 'Morning Walk',
        description: '30-minute light walk in the park',
        type: 'exercise',
        duration: '30 min',
      },
      {
        time: '12:00',
        title: 'Blood Pressure Check',
        description: 'Measure and record blood pressure',
        type: 'measurement',
        duration: '5 min',
      },
      {
        time: '15:00',
        title: 'Medication Reminder',
        description: 'Take prescribed beta-blocker',
        type: 'medication',
        duration: '5 min',
      },
    ],
  },
  {
    date: `${today.getFullYear()}-05-20`,
    activities: [
      {
        time: '11:00',
        title: 'ECG Test',
        description: 'Routine ECG at the hospital',
        type: 'appointment',
        duration: '30 min',
      },
      {
        time: '14:00',
        title: 'Medication Reminder',
        description: 'Take prescribed beta-blocker',
        type: 'medication',
        duration: '5 min',
      },
    ],
  },
  {
    date: `${today.getFullYear()}-05-25`,
    activities: [
      {
        time: '08:30',
        title: 'Morning Exercise',
        description: 'Light stretching and breathing exercises',
        type: 'exercise',
        duration: '20 min',
      },
      {
        time: '12:00',
        title: 'Blood Pressure Check',
        description: 'Measure and record blood pressure',
        type: 'measurement',
        duration: '5 min',
      },
      {
        time: '15:00',
        title: 'Medication Reminder',
        description: 'Take prescribed beta-blocker',
        type: 'medication',
        duration: '5 min',
      },
    ],
  },
  {
    date: `${today.getFullYear()}-05-30`,
    activities: [
      {
        time: '10:00',
        title: 'Follow-up Consultation',
        description: 'Review test results with Dr. Anderson',
        type: 'appointment',
        duration: '30 min',
      },
      {
        time: '14:00',
        title: 'Blood Pressure Check',
        description: 'Measure and record blood pressure',
        type: 'measurement',
        duration: '5 min',
      },
    ],
  },
];

const getActivityIcon = (type) => {
  switch (type) {
    case 'exercise':
      return 'fitness';
    case 'measurement':
      return 'pulse';
    case 'medication':
      return 'medkit';
    case 'appointment':
      return 'calendar';
    default:
      return 'time';
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const CalendarScreen = ({ navigation }) => {
  const today = new Date();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(today);

  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const hasActivities = (date) => {
    if (!date) return false;
    const dateStr = formatDateString(date);
    return mockActivities.some(day => day.date === dateStr);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const renderCalendarGrid = () => {
    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const rows = [];
    
    for (let i = 0; i < days.length; i += 7) {
      const row = days.slice(i, i + 7);
      rows.push(row);
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.monthNavButton}>
            <Ionicons name="chevron-back" size={24} color="#3B4B75" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.monthNavButton}>
            <Ionicons name="chevron-forward" size={24} color="#3B4B75" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDaysContainer}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekDay}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysContainer}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.weekRow}>
              {row.map((day, dayIndex) => (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dayCell,
                    day && hasActivities(day) && styles.dayWithActivities,
                    day && day.toDateString() === selectedDate.toDateString() && styles.selectedDay,
                  ]}
                  onPress={() => {
                    if (day) {
                      setSelectedDate(day);
                      setShowCalendar(false);
                    }
                  }}
                  disabled={!day}
                >
                  {day && (
                    <Text style={[
                      styles.dayText,
                      day.toDateString() === selectedDate.toDateString() && styles.selectedDayText,
                    ]}>
                      {day.getDate()}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const filteredActivities = mockActivities.find(
    day => day.date === formatDateString(selectedDate)
  )?.activities || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#3B4B75" />
        </TouchableOpacity>
        <Text style={styles.title}>Calendar</Text>
        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={styles.iconButton}
        >
          <Ionicons name="calendar" size={24} color="#3B4B75" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {renderCalendarGrid()}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.dayContainer}>
          <Text style={styles.dateHeader}>{formatDate(selectedDate.toISOString())}</Text>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <View key={index} style={styles.activityCard}>
                <View style={styles.timeContainer}>
                  <Text style={styles.time}>{activity.time}</Text>
                  <Text style={styles.duration}>{activity.duration}</Text>
                </View>
                <View style={styles.activityContent}>
                  <View style={styles.activityHeader}>
                    <Ionicons 
                      name={getActivityIcon(activity.type)} 
                      size={20} 
                      color="#3B4B75" 
                      style={styles.activityIcon}
                    />
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                  </View>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noActivitiesCard}>
              <Ionicons name="calendar-outline" size={32} color="#3B4B75" style={styles.noActivitiesIcon} />
              <Text style={styles.noActivitiesText}>No activities scheduled for this day</Text>
            </View>
          )}
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
  iconButton: {
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
  dayContainer: {
    marginTop: 24,
    marginHorizontal: 18,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B4B75',
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: '#E8EAF6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },
  timeContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#3B4B75',
    opacity: 0.2,
    marginRight: 16,
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B4B75',
  },
  duration: {
    fontSize: 14,
    color: '#3B4B75',
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityIcon: {
    marginRight: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B4B75',
  },
  activityDescription: {
    fontSize: 14,
    color: '#3B4B75',
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F5F6FA',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  calendarContainer: {
    backgroundColor: '#E8EAF6',
    borderRadius: 16,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthNavButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B4B75',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#3B4B75',
    opacity: 0.7,
  },
  daysContainer: {
    marginTop: 8,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 8,
  },
  dayWithActivities: {
    backgroundColor: '#E8EAF6',
    borderWidth: 1,
    borderColor: '#3B4B75',
  },
  selectedDay: {
    backgroundColor: '#3B4B75',
  },
  dayText: {
    fontSize: 16,
    color: '#3B4B75',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '700',
  },
  closeButton: {
    backgroundColor: '#E8EAF6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#3B4B75',
    fontSize: 16,
    fontWeight: '600',
  },
  noActivitiesCard: {
    backgroundColor: '#E8EAF6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noActivitiesIcon: {
    marginBottom: 12,
    opacity: 0.7,
  },
  noActivitiesText: {
    fontSize: 16,
    color: '#3B4B75',
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default CalendarScreen; 