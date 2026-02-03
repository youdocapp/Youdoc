import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, Clock, CheckCircle2, Circle, Eye, EyeOff, Filter } from 'lucide-react-native';
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
  const [showTaken, setShowTaken] = useState<boolean>(true); // Show taken medications by default
  const [sortBy, setSortBy] = useState<'default' | 'taken-last'>('default');
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
    
    // Filter by selected date
    let filtered = medications.filter(med => med.dateAdded === selectedDate);
    
    // Filter out taken medications if showTaken is false
    if (!showTaken) {
      filtered = filtered.filter(med => !med.taken);
    }
    
    // Sort medications
    if (sortBy === 'taken-last') {
      // Sort: not taken first, then taken
      filtered = [...filtered].sort((a, b) => {
        if (a.taken === b.taken) return 0;
        return a.taken ? 1 : -1;
      });
    }
    
    return filtered;
  }, [medications, selectedDate, showTaken, sortBy]);
  
  // Calculate completion stats
  const completionStats = useMemo(() => {
    const allForDate = medications?.filter(med => med.dateAdded === selectedDate) || [];
    const takenCount = allForDate.filter(med => med.taken).length;
    const totalCount = allForDate.length;
    const percentage = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;
    
    return {
      taken: takenCount,
      total: totalCount,
      percentage,
      remaining: totalCount - takenCount
    };
  }, [medications, selectedDate]);

  // Get medication emoji based on type
  const getMedicationEmoji = (medicationType: string | undefined): string => {
    if (!medicationType) return '💊'; // Default to pill
    
    const typeMap: { [key: string]: string } = {
      'Pill': '💊',
      'Injection': '💉',
      'Drops': '💧',
      'Inhaler': '🫁',
      'Cream': '🧴',
      'Spray': '💨',
      // Handle lowercase variations
      'pill': '💊',
      'injection': '💉',
      'drops': '💧',
      'inhaler': '🫁',
      'cream': '🧴',
      'spray': '💨',
    };
    
    return typeMap[medicationType] || '💊'; // Default to pill if type not found
  };

  // Medication Card Component with enhanced taken button
  const MedicationCard = ({ medication, onToggle, colors }: { medication: any; onToggle: (id: string) => Promise<{ success: boolean; error?: string }>; colors: any }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(medication.taken ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(opacityAnim, {
        toValue: medication.taken ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [medication.taken]);

    const handleToggle = async () => {
      if (isProcessing) return;

      setIsProcessing(true);
      
      // Animate button press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      const result = await onToggle(medication.id);
      
      if (result.success && !medication.taken) {
        // Show success feedback
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
      
      setIsProcessing(false);
    };

    // Get medication type (handle both camelCase and snake_case)
    const medicationType = medication.medication_type || medication.medicationType || 'Pill';
    const medicationEmoji = getMedicationEmoji(medicationType);

    return (
      <View style={[styles.medicationCard, medication.taken && styles.medicationCardTaken]}>
        <View style={styles.medicationIcon}>
          <Text style={styles.pillEmoji}>{medicationEmoji}</Text>
        </View>
        <View style={styles.medicationInfo}>
          <Text style={[styles.medicationName, medication.taken && styles.medicationNameTaken]}>
            {medication.name}
          </Text>
          <Text style={[styles.medicationDose, medication.taken && styles.medicationDoseTaken]}>
            {medication.dosage}
          </Text>
          <View style={styles.medicationTime}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={[styles.timeText, medication.taken && styles.timeTextTaken]}>
              {medication.time[0] || '08:00'}
            </Text>
          </View>
        </View>
        <Animated.View 
          style={[
            styles.takenButtonContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.takenButton,
              medication.taken && styles.takenButtonActive,
              isProcessing && styles.takenButtonProcessing
            ]}
            onPress={handleToggle}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            {medication.taken ? (
              <>
                <CheckCircle2 size={20} color="#FFFFFF" />
                <Text style={styles.takenButtonText}>Taken</Text>
              </>
            ) : (
              <>
                <Circle size={20} color="#4F7FFF" strokeWidth={2.5} />
                <Text style={[styles.takenButtonText, styles.takenButtonTextInactive]}>
                  {isProcessing ? 'Marking...' : 'Mark as Taken'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };
  
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
    sectionHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 16
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      flex: 1
    },
    completionBadge: {
      backgroundColor: '#E0E7FF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginLeft: 12
    },
    completionText: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: '#4F7FFF'
    },
    filterControls: {
      flexDirection: 'row' as const,
      gap: 8,
      marginBottom: 16
    },
    filterButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border
    },
    filterButtonActive: {
      backgroundColor: '#E0E7FF',
      borderColor: '#4F7FFF'
    },
    filterButtonText: {
      fontSize: 13,
      fontWeight: '500' as const,
      color: colors.textSecondary
    },
    filterButtonTextActive: {
      color: '#4F7FFF',
      fontWeight: '600' as const
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
      borderColor: colors.border,
      position: 'relative' as const
    },
    medicationCardTaken: {
      backgroundColor: '#F0F9FF',
      borderColor: '#4F7FFF',
      borderWidth: 1.5
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
    takenButtonContainer: {
      marginLeft: 'auto'
    },
    takenButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: '#F3F4F6',
      borderWidth: 2,
      borderColor: '#E5E7EB',
      minWidth: 120,
      gap: 8
    },
    takenButtonActive: {
      backgroundColor: '#4F7FFF',
      borderColor: '#4F7FFF',
      shadowColor: '#4F7FFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4
    },
    takenButtonProcessing: {
      opacity: 0.6
    },
    takenButtonText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: '#FFFFFF'
    },
    takenButtonTextInactive: {
      color: '#4F7FFF'
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
                      key={`dot-${date.dateString}-${i}`} 
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medicine</Text>
          {completionStats.total > 0 && (
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>
                {completionStats.taken}/{completionStats.total} taken ({completionStats.percentage}%)
              </Text>
            </View>
          )}
        </View>
        
        {/* Filter and Sort Controls */}
        {medications?.filter(med => med.dateAdded === selectedDate).length > 0 && (
          <View style={styles.filterControls}>
            <TouchableOpacity
              style={[styles.filterButton, !showTaken && styles.filterButtonActive]}
              onPress={() => setShowTaken(!showTaken)}
            >
              {showTaken ? <Eye size={16} color={colors.textSecondary} /> : <EyeOff size={16} color="#4F7FFF" />}
              <Text style={[styles.filterButtonText, !showTaken && styles.filterButtonTextActive]}>
                {showTaken ? 'Show All' : 'Hide Taken'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.filterButton, sortBy === 'taken-last' && styles.filterButtonActive]}
              onPress={() => setSortBy(sortBy === 'taken-last' ? 'default' : 'taken-last')}
            >
              <Filter size={16} color={sortBy === 'taken-last' ? '#4F7FFF' : colors.textSecondary} />
              <Text style={[styles.filterButtonText, sortBy === 'taken-last' && styles.filterButtonTextActive]}>
                {sortBy === 'taken-last' ? 'Pending First' : 'Sort'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {filteredMedications.length > 0 ? (
          filteredMedications.map((med) => (
            <MedicationCard
              key={med.id} 
              medication={med}
              onToggle={toggleMedicationTaken}
              colors={colors}
            />
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
