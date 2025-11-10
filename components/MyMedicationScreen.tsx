import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ChevronLeft, Plus, Clock } from 'lucide-react-native';
import { useMedication } from '../contexts/MedicationContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { colors } = useTheme();
  
  // Helper function to format date in local timezone (YYYY-MM-DD)
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(formatLocalDate(today));
  const monthsScrollRef = useRef<FlatList>(null);
  const datesScrollRef = useRef<FlatList>(null);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const getDaysInMonth = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    if (!medications || !Array.isArray(medications)) {
      // Return days without medication data if medications is not available
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = formatLocalDate(date);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        days.push({
          day,
          weekday,
          dateString,
          dots: 0
        });
      }
      return days;
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatLocalDate(date);
      const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
      const medicationsOnDate = medications.filter(med => med.dateAdded === dateString);
      const uniqueMedications = new Set(medicationsOnDate.map(m => m.name));
      const medicationCount = uniqueMedications.size;
      
      days.push({
        day,
        weekday,
        dateString,
        dots: medicationCount
      });
    }
    
    return days;
  };
  
  const dates = useMemo(() => getDaysInMonth(selectedMonth, selectedYear), [selectedMonth, selectedYear, medications]);
  
  const filteredMedications = useMemo(() => {
    if (!medications || !Array.isArray(medications)) {
      return [];
    }
    return medications.filter(med => med.dateAdded === selectedDate);
  }, [medications, selectedDate]);
  
  useEffect(() => {
    const todayDateString = formatLocalDate(today);
    const todayIndex = dates.findIndex(d => d.dateString === todayDateString);
    if (todayIndex !== -1 && datesScrollRef.current) {
      setTimeout(() => {
        datesScrollRef.current?.scrollToIndex({
          index: todayIndex,
          animated: true,
          viewPosition: 0.5
        });
      }, 100);
    }
  }, [selectedMonth, selectedYear]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: colors.background,
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
      color: colors.text
    },
    monthsContainer: {
      paddingTop: 16,
      paddingBottom: 8,
      backgroundColor: colors.background
    },
    monthsContentContainer: {
      paddingHorizontal: 20,
      gap: 16
    },
    monthButton: {
      paddingHorizontal: 22,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: colors.card,
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
      color: colors.textSecondary,
      letterSpacing: 0.3
    },
    monthTextActive: {
      color: '#FFFFFF'
    },
    datesContainer: {
      paddingTop: 4,
      paddingBottom: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
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
      backgroundColor: colors.card,
      alignItems: 'center' as const,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.border
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
      color: colors.textSecondary,
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
      color: colors.text,
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
    todayIndicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#4F7FFF',
      position: 'absolute' as const,
      top: 8,
      right: 8
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 16
    },
    medicationCard: {
      backgroundColor: colors.card,
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
      borderColor: colors.border
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
      color: colors.text,
      marginBottom: 6
    },
    medicationNameTaken: {
      textDecorationLine: 'line-through' as const
    },
    medicationDose: {
      fontSize: 14,
      color: '#4F7FFF',
      marginBottom: 6
    },
    medicationDoseTaken: {
      textDecorationLine: 'line-through' as const
    },
    medicationTime: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 4
    },
    timeText: {
      fontSize: 13,
      color: colors.textSecondary
    },
    timeTextTaken: {
      textDecorationLine: 'line-through' as const
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
      color: colors.textSecondary,
      textAlign: 'center' as const
    },
    fab: {
      position: 'absolute' as const,
      right: 20,
      bottom: 140,
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
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Medication</Text>
      </View>

      <View style={styles.monthsContainer}>
        <FlatList
          ref={monthsScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={months}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={styles.monthsContentContainer}
          renderItem={({ item: month, index }) => (
            <TouchableOpacity
              style={[
                styles.monthButton,
                selectedMonth === index && styles.monthButtonActive
              ]}
              onPress={() => {
                setSelectedMonth(index);
                const firstDayOfMonth = formatLocalDate(new Date(selectedYear, index, 1));
                setSelectedDate(firstDayOfMonth);
              }}
            >
              <Text style={[
                styles.monthText,
                selectedMonth === index && styles.monthTextActive
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
          keyExtractor={(item) => item.dateString}
          contentContainerStyle={styles.datesContentContainer}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              datesScrollRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
            });
          }}
          renderItem={({ item: date }) => {
            const isToday = date.dateString === formatLocalDate(today);
            const isSelected = selectedDate === date.dateString;
            
            return (
              <TouchableOpacity
                style={[
                  styles.dateCard,
                  isSelected && styles.dateCardActive
                ]}
                onPress={() => setSelectedDate(date.dateString)}
              >
                <Text style={[
                  styles.dateWeekday,
                  isSelected && styles.dateWeekdayActive
                ]}>
                  {date.weekday}
                </Text>
                <Text style={[
                  styles.dateDay,
                  isSelected && styles.dateDayActive
                ]}>
                  {date.day}
                </Text>
                {isToday && !isSelected && (
                  <View style={styles.todayIndicator} />
                )}
                <View style={styles.dotsContainer}>
                  {Array.from({ length: date.dots }).map((_, i) => (
                    <View 
                      key={i} 
                      style={[
                        styles.dot,
                        isSelected && styles.dotActive
                      ]} 
                    />
                  ))}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Medicine</Text>
        
        {filteredMedications.length > 0 ? (
          filteredMedications.map((med) => (
            <TouchableOpacity 
              key={med.id} 
              style={[styles.medicationCard, med.taken && styles.medicationCardTaken]}
              onPress={() => toggleMedicationTaken(med.id)}
              activeOpacity={0.7}
            >
              <View style={styles.medicationIcon}>
                <Text style={styles.pillEmoji}>💊</Text>
              </View>
              <View style={styles.medicationInfo}>
                <Text style={[styles.medicationName, med.taken && styles.medicationNameTaken]}>{med.name}</Text>
                <Text style={[styles.medicationDose, med.taken && styles.medicationDoseTaken]}>{med.dosage}</Text>
                <View style={styles.medicationTime}>
                  <Clock size={14} color={colors.textSecondary} />
                  <Text style={[styles.timeText, med.taken && styles.timeTextTaken]}>{med.time[0] || '08:00'}</Text>
                </View>
              </View>
              <View style={[styles.checkbox, med.taken && styles.checkboxChecked]}>
                {med.taken && <View style={styles.checkmark} />}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No medication today</Text>
          </View>
        )}
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
