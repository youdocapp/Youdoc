import React, { useState, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
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
  const { medications, toggleMedicationTaken } = useMedication();
  const [selectedMonth, setSelectedMonth] = useState<string>('May');
  const [selectedDate, setSelectedDate] = useState<number>(13);
  const monthsScrollRef = useRef<FlatList>(null);
  const datesScrollRef = useRef<FlatList>(null);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dates = [
    { day: 11, weekday: 'Sun', dots: 1 },
    { day: 12, weekday: 'Mon', dots: 2 },
    { day: 13, weekday: 'Tue', dots: 0 },
    { day: 14, weekday: 'Wed', dots: 1 },
    { day: 15, weekday: 'Thu', dots: 2 },
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
      paddingTop: 16,
      paddingBottom: 8,
      backgroundColor: '#FFFFFF'
    },
    monthsContentContainer: {
      paddingHorizontal: 20,
      gap: 16
    },
    monthButton: {
      paddingHorizontal: 22,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      marginRight: 12,
      borderWidth: 0
    },
    monthButtonActive: {
      backgroundColor: '#4F7FFF',
      borderColor: '#4F7FFF'
    },
    monthText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: '#6B7280',
      letterSpacing: 0.3
    },
    monthTextActive: {
      color: '#FFFFFF'
    },
    datesContainer: {
      paddingTop: 4,
      paddingBottom: 16,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6'
    },
    datesContentContainer: {
      paddingHorizontal: 20,
      gap: 16
    },
    dateCard: {
      width: 68,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 16,
      backgroundColor: '#F9FAFB',
      alignItems: 'center' as const,
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#E5E7EB'
    },
    dateCardActive: {
      backgroundColor: '#4F7FFF',
      borderColor: '#4F7FFF',
      shadowColor: '#4F7FFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3
    },
    dateWeekday: {
      fontSize: 11,
      fontWeight: '600' as const,
      color: '#9CA3AF',
      marginBottom: 2,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5
    },
    dateWeekdayActive: {
      color: '#FFFFFF'
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
    dotsContainer: {
      flexDirection: 'row' as const,
      gap: 4,
      minHeight: 6
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
      borderRadius: 20,
      padding: 18,
      marginBottom: 14,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#F3F4F6'
    },
    medicationCardTaken: {
      opacity: 0.5
    },
    medicationIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: '#FEF3C7',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 14
    },
    pillEmoji: {
      fontSize: 28
    },
    medicationInfo: {
      flex: 1
    },
    medicationName: {
      fontSize: 17,
      fontWeight: '600' as const,
      color: '#1F2937',
      marginBottom: 6
    },
    medicationNameTaken: {
      textDecorationLine: 'line-through' as const
    },
    medicationDose: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 6
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
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: '#D1D5DB',
      backgroundColor: '#FFFFFF',
      alignItems: 'center' as const,
      justifyContent: 'center' as const
    },
    checkboxChecked: {
      backgroundColor: '#4F7FFF',
      borderColor: '#4F7FFF'
    },
    checkmark: {
      width: 14,
      height: 10,
      borderLeftWidth: 2.5,
      borderBottomWidth: 2.5,
      borderColor: '#FFFFFF',
      transform: [{ rotate: '-45deg' }],
      marginTop: -2
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

      <View style={styles.monthsContainer}>
        <FlatList
          ref={monthsScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={months}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.monthsContentContainer}
          renderItem={({ item: month }) => (
            <TouchableOpacity
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
          )}
        />
      </View>

      <View style={styles.datesContainer}>
        <FlatList
          ref={datesScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dates}
          keyExtractor={(item) => item.day.toString()}
          contentContainerStyle={styles.datesContentContainer}
          renderItem={({ item: date }) => (
            <TouchableOpacity
              style={[
                styles.dateCard,
                selectedDate === date.day && styles.dateCardActive
              ]}
              onPress={() => setSelectedDate(date.day)}
            >
              <Text style={[
                styles.dateWeekday,
                selectedDate === date.day && styles.dateWeekdayActive
              ]}>
                {date.weekday}
              </Text>
              <Text style={[
                styles.dateDay,
                selectedDate === date.day && styles.dateDayActive
              ]}>
                {date.day}
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
          )}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Medicine</Text>
        
        {medications.map((med) => (
          <View key={med.id} style={[styles.medicationCard, med.taken && styles.medicationCardTaken]}>
            <View style={styles.medicationIcon}>
              <Text style={styles.pillEmoji}>💊</Text>
            </View>
            <View style={styles.medicationInfo}>
              <Text style={[styles.medicationName, med.taken && styles.medicationNameTaken]}>{med.name}</Text>
              <Text style={styles.medicationDose}>{med.dosage}</Text>
              <View style={styles.medicationTime}>
                <Clock size={14} color="#9CA3AF" />
                <Text style={styles.timeText}>{med.time[0] || '08:00'}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.checkbox, med.taken && styles.checkboxChecked]}
              onPress={() => toggleMedicationTaken(med.id)}
            >
              {med.taken && <View style={styles.checkmark} />}
            </TouchableOpacity>
          </View>
        ))}

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
