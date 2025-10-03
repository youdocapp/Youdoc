import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Plus, Clock } from 'lucide-react-native';
import { useMedication } from '../contexts/MedicationContext';
import BottomNav from './ui/BottomNav';

interface MyMedicationScreenProps {
  onBack: () => void;
  onAddMedication?: () => void;
  onHome?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  activeTab?: string;
}

const MyMedicationScreen: React.FC<MyMedicationScreenProps> = ({ 
  onBack, 
  onAddMedication,
  onHome,
  onNotifications,
  onProfile,
  activeTab = 'home'
}) => {
  const { medications } = useMedication();
  const [selectedMonth, setSelectedMonth] = useState<string>('May');
  const [selectedDate, setSelectedDate] = useState<number>(13);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const dates = [
    { day: 11, weekday: 'Sat', dots: 1 },
    { day: 12, weekday: 'Sun', dots: 2 },
    { day: 13, weekday: 'Mon', dots: 0 },
    { day: 14, weekday: 'Tue', dots: 1 },
    { day: 15, weekday: 'Wed', dots: 2 },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB'
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: '#FFFFFF',
      position: 'relative' as const
    },
    backButton: {
      position: 'absolute' as const,
      left: 20,
      padding: 8
    },
    title: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: '#1F2937'
    },
    monthsContainer: {
      flexDirection: 'row' as const,
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
      backgroundColor: '#FFFFFF'
    },
    monthButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#F3F4F6'
    },
    monthButtonActive: {
      backgroundColor: '#4F7FFF'
    },
    monthText: {
      fontSize: 15,
      fontWeight: '500' as const,
      color: '#6B7280'
    },
    monthTextActive: {
      color: '#FFFFFF'
    },
    datesContainer: {
      flexDirection: 'row' as const,
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
      backgroundColor: '#FFFFFF'
    },
    dateCard: {
      width: 70,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 16,
      backgroundColor: '#F9FAFB',
      alignItems: 'center' as const
    },
    dateCardActive: {
      backgroundColor: '#4F7FFF'
    },
    dateDay: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: '#1F2937',
      marginBottom: 4
    },
    dateDayActive: {
      color: '#FFFFFF'
    },
    dateWeekday: {
      fontSize: 13,
      color: '#6B7280',
      marginBottom: 8
    },
    dateWeekdayActive: {
      color: '#FFFFFF'
    },
    dotsContainer: {
      flexDirection: 'row' as const,
      gap: 4
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#4F7FFF'
    },
    dotActive: {
      backgroundColor: '#FFFFFF'
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: '#1F2937',
      marginBottom: 16
    },
    medicationCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2
    },
    medicationIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#FEF3C7',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 12
    },
    pillEmoji: {
      fontSize: 24
    },
    medicationInfo: {
      flex: 1
    },
    medicationName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#1F2937',
      marginBottom: 4
    },
    medicationDose: {
      fontSize: 13,
      color: '#6B7280',
      marginBottom: 4
    },
    medicationTime: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 4
    },
    timeText: {
      fontSize: 13,
      color: '#9CA3AF'
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF'
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingVertical: 48
    },
    emptyText: {
      fontSize: 16,
      color: '#9CA3AF',
      textAlign: 'center' as const
    },
    fab: {
      position: 'absolute' as const,
      right: 20,
      bottom: 80,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#4F7FFF',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>My Medication</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthsContainer}>
        {months.map((month) => (
          <TouchableOpacity
            key={month}
            style={[
              styles.monthButton,
              selectedMonth === month && styles.monthButtonActive
            ]}
            onPress={() => setSelectedMonth(month)}
          >
            <Text style={[
              styles.monthText,
              selectedMonth === month && styles.monthTextActive
            ]}>
              {month}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
        {dates.map((date) => (
          <TouchableOpacity
            key={date.day}
            style={[
              styles.dateCard,
              selectedDate === date.day && styles.dateCardActive
            ]}
            onPress={() => setSelectedDate(date.day)}
          >
            <Text style={[
              styles.dateDay,
              selectedDate === date.day && styles.dateDayActive
            ]}>
              {date.day}
            </Text>
            <Text style={[
              styles.dateWeekday,
              selectedDate === date.day && styles.dateWeekdayActive
            ]}>
              {date.weekday}
            </Text>
            <View style={styles.dotsContainer}>
              {Array.from({ length: date.dots }).map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.dot,
                    selectedDate === date.day && styles.dotActive
                  ]} 
                />
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Medicine</Text>
        
        {medications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No medications added yet</Text>
          </View>
        ) : (
          medications.map((med) => (
            <View key={med.id} style={styles.medicationCard}>
              <View style={styles.medicationIcon}>
                <Text style={styles.pillEmoji}>💊</Text>
              </View>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{med.name}</Text>
                <Text style={styles.medicationDose}>{med.dosage}</Text>
                <View style={styles.medicationTime}>
                  <Clock size={14} color="#9CA3AF" />
                  <Text style={styles.timeText}>{med.time[0] || '08:00'}</Text>
                </View>
              </View>
              <View style={styles.checkbox} />
            </View>
          ))
        )}

        <View style={styles.medicationCard}>
          <View style={styles.medicationIcon}>
            <Text style={styles.pillEmoji}>💊</Text>
          </View>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>Aspirin</Text>
            <Text style={styles.medicationDose}>100mg pill, (100mg mg)</Text>
            <View style={styles.medicationTime}>
              <Clock size={14} color="#9CA3AF" />
              <Text style={styles.timeText}>08:00</Text>
            </View>
          </View>
          <View style={styles.checkbox} />
        </View>

        <View style={styles.medicationCard}>
          <View style={styles.medicationIcon}>
            <Text style={styles.pillEmoji}>💊</Text>
          </View>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>Vitamin D</Text>
            <Text style={styles.medicationDose}>1000 IU, (1000 IU IU)</Text>
            <View style={styles.medicationTime}>
              <Clock size={14} color="#9CA3AF" />
              <Text style={styles.timeText}>09:00</Text>
            </View>
          </View>
          <View style={styles.checkbox} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={onAddMedication}>
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <BottomNav
        activeTab={activeTab}
        onHome={onHome}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />
    </SafeAreaView>
  );
};

export default MyMedicationScreen;
