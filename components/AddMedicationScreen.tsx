import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, ChevronDown, Clock } from 'lucide-react-native';
import { useMedication } from '../contexts/MedicationContext';
import BottomNav from './ui/BottomNav';

type MedicationType = 'Pill' | 'Injection' | 'Drops' | 'Inhaler' | 'Cream' | 'Spray';
type FrequencyType = 'Daily' | 'Weekly' | 'As needed';
type TimesPerDayType = 'Once daily' | 'Twice daily' | 'Three times daily' | 'Four times daily';

interface AddMedicationScreenProps {
  onBack: () => void;
  onSave?: () => void;
  onHome?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  activeTab?: string;
}

const AddMedicationScreen: React.FC<AddMedicationScreenProps> = ({ 
  onBack, 
  onSave,
  onHome,
  onNotifications,
  onProfile,
  activeTab = 'home'
}) => {
  const { addMedication } = useMedication();
  const [name, setName] = useState<string>('');
  const [medicationType, setMedicationType] = useState<MedicationType>('Pill');
  const [quantity, setQuantity] = useState<string>('1');
  const [dosage, setDosage] = useState<string>('10');
  const [unit, setUnit] = useState<string>('mg');
  const [frequency, setFrequency] = useState<FrequencyType>('Daily');
  const [timesPerDay, setTimesPerDay] = useState<TimesPerDayType>('Once daily');
  const [reminderTimes, setReminderTimes] = useState<string[]>(['8:00 AM']);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [showTimesDropdown, setShowTimesDropdown] = useState<boolean>(false);
  const [showTimePickerIndex, setShowTimePickerIndex] = useState<number | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);

  const handleSave = () => {
    if (!name || !dosage) {
      Alert.alert('Error', 'Please fill in medication name and dosage');
      return;
    }

    addMedication({
      name,
      dosage: `${dosage}${unit}`,
      frequency,
      time: reminderTimes,
      startDate: startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      endDate: endDate ? endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined,
      notes,
      reminderEnabled: true,
      taken: false,
      dateAdded: startDate.toISOString().split('T')[0],
      startDateObj: startDate,
      endDateObj: endDate || undefined
    });

    Alert.alert('Success', 'Medication added successfully', [
      { text: 'OK', onPress: () => onSave ? onSave() : onBack() }
    ]);
  };

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, '12:00 PM']);
  };

  const timesPerDayOptions: TimesPerDayType[] = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily'];

  const handleTimesPerDayChange = (option: TimesPerDayType) => {
    setTimesPerDay(option);
    const count = option === 'Once daily' ? 1 : option === 'Twice daily' ? 2 : option === 'Three times daily' ? 3 : 4;
    const defaultTimes = ['8:00 AM', '12:00 PM', '4:00 PM', '8:00 PM'];
    setReminderTimes(defaultTimes.slice(0, count));
    setShowTimesDropdown(false);
  };

  const updateReminderTime = (index: number, time: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = time;
    setReminderTimes(newTimes);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const TimePickerModal = ({ visible, onClose, onSelect, currentTime }: { visible: boolean; onClose: () => void; onSelect: (time: string) => void; currentTime: string }) => {
    const [selectedHour, setSelectedHour] = useState<number>(parseInt(currentTime.split(':')[0]));
    const [selectedMinute, setSelectedMinute] = useState<number>(parseInt(currentTime.split(':')[1].split(' ')[0]));
    const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(currentTime.includes('AM') ? 'AM' : 'PM');

    const hourScrollRef = React.useRef<ScrollView>(null);
    const minuteScrollRef = React.useRef<ScrollView>(null);
    const periodScrollRef = React.useRef<ScrollView>(null);

    const ITEM_HEIGHT = 44;

    React.useEffect(() => {
      if (visible) {
        const hour = parseInt(currentTime.split(':')[0]);
        const minute = parseInt(currentTime.split(':')[1].split(' ')[0]);
        const period = currentTime.includes('AM') ? 'AM' : 'PM';
        
        setSelectedHour(hour);
        setSelectedMinute(minute);
        setSelectedPeriod(period);
        
        setTimeout(() => {
          hourScrollRef.current?.scrollTo({ y: (hour - 1) * ITEM_HEIGHT, animated: false });
          minuteScrollRef.current?.scrollTo({ y: minute * ITEM_HEIGHT, animated: false });
          periodScrollRef.current?.scrollTo({ y: (period === 'AM' ? 0 : 1) * ITEM_HEIGHT, animated: false });
        }, 100);
      }
    }, [visible, currentTime]);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const handleHourScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const hour = hours[index];
      if (hour && hour !== selectedHour) {
        setSelectedHour(hour);
      }
    };

    const handleMinuteScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const minute = minutes[index];
      if (minute !== undefined && minute !== selectedMinute) {
        setSelectedMinute(minute);
      }
    };

    const handlePeriodScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const period = index === 0 ? 'AM' : 'PM';
      if (period !== selectedPeriod) {
        setSelectedPeriod(period);
      }
    };

    const handleConfirm = () => {
      const time = `${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
      onSelect(time);
      onClose();
    };

    const renderWheelItem = (item: number | string, isSelected: boolean) => {
      return (
        <View style={[timePickerStyles.wheelItem, { height: ITEM_HEIGHT }]}>
          <Text style={[
            timePickerStyles.wheelItemText,
            isSelected && timePickerStyles.wheelItemTextSelected
          ]}>
            {typeof item === 'number' && item < 10 && item !== hours.find(h => h === item) ? item.toString().padStart(2, '0') : item}
          </Text>
        </View>
      );
    };

    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={timePickerStyles.modalOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={onClose}
          />
          <View style={timePickerStyles.modalContent}>
            <View style={timePickerStyles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={timePickerStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={timePickerStyles.modalTitle}>Select Time</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={timePickerStyles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={timePickerStyles.pickerContainer}>
              <View style={timePickerStyles.selectionIndicator} />
              
              <View style={timePickerStyles.wheelContainer}>
                <View style={timePickerStyles.wheelColumn}>
                  <ScrollView 
                    ref={hourScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleHourScroll}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  >
                    {hours.map((hour) => renderWheelItem(hour, selectedHour === hour))}
                  </ScrollView>
                </View>

                <View style={timePickerStyles.wheelColumn}>
                  <ScrollView 
                    ref={minuteScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleMinuteScroll}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  >
                    {minutes.map((minute) => renderWheelItem(minute.toString().padStart(2, '0'), selectedMinute === minute))}
                  </ScrollView>
                </View>

                <View style={timePickerStyles.wheelColumn}>
                  <ScrollView 
                    ref={periodScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handlePeriodScroll}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  >
                    {(['AM', 'PM'] as const).map((period) => renderWheelItem(period, selectedPeriod === period))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const DatePickerModal = ({ visible, onClose, onSelect, currentDate, title }: { visible: boolean; onClose: () => void; onSelect: (date: Date) => void; currentDate: Date; title: string }) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentYear = new Date().getFullYear();
    
    const [selectedDay, setSelectedDay] = useState<number>(currentDate.getDate());
    const [selectedMonth, setSelectedMonth] = useState<string>(currentDate.toLocaleDateString('en-US', { month: 'long' }));
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

    const dayScrollRef = React.useRef<ScrollView>(null);
    const monthScrollRef = React.useRef<ScrollView>(null);
    const yearScrollRef = React.useRef<ScrollView>(null);

    const ITEM_HEIGHT = 44;
    const VISIBLE_ITEMS = 5;

    React.useEffect(() => {
      if (visible) {
        setSelectedDay(currentDate.getDate());
        setSelectedMonth(currentDate.toLocaleDateString('en-US', { month: 'long' }));
        setSelectedYear(currentDate.getFullYear());
        
        setTimeout(() => {
          const monthIdx = months.indexOf(currentDate.toLocaleDateString('en-US', { month: 'long' }));
          const yearIdx = years.indexOf(currentDate.getFullYear());
          
          dayScrollRef.current?.scrollTo({ y: (currentDate.getDate() - 1) * ITEM_HEIGHT, animated: false });
          monthScrollRef.current?.scrollTo({ y: monthIdx * ITEM_HEIGHT, animated: false });
          yearScrollRef.current?.scrollTo({ y: yearIdx * ITEM_HEIGHT, animated: false });
        }, 100);
      }
    }, [visible, currentDate]);

    const monthIndex = months.indexOf(selectedMonth);
    const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const years = Array.from({ length: 200 }, (_, i) => currentYear + 50 - i);

    const handleDayScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const day = days[index];
      if (day && day !== selectedDay) {
        setSelectedDay(day);
      }
    };

    const handleMonthScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const month = months[index];
      if (month && month !== selectedMonth) {
        setSelectedMonth(month);
      }
    };

    const handleYearScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const year = years[index];
      if (year && year !== selectedYear) {
        setSelectedYear(year);
      }
    };

    const handleConfirm = () => {
      const monthIdx = months.indexOf(selectedMonth);
      const daysInSelectedMonth = new Date(selectedYear, monthIdx + 1, 0).getDate();
      const validDay = Math.min(selectedDay, daysInSelectedMonth);
      const newDate = new Date(selectedYear, monthIdx, validDay);
      onSelect(newDate);
      onClose();
    };

    const renderWheelItem = (item: number | string, isSelected: boolean) => {
      return (
        <View style={[datePickerStyles.wheelItem, { height: ITEM_HEIGHT }]}>
          <Text style={[
            datePickerStyles.wheelItemText,
            isSelected && datePickerStyles.wheelItemTextSelected
          ]}>
            {item}
          </Text>
        </View>
      );
    };

    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={datePickerStyles.modalOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={onClose}
          />
          <View style={datePickerStyles.modalContent}>
            <View style={datePickerStyles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={datePickerStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={datePickerStyles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={datePickerStyles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={datePickerStyles.pickerContainer}>
              <View style={datePickerStyles.selectionIndicator} />
              
              <View style={datePickerStyles.wheelContainer}>
                <View style={datePickerStyles.wheelColumn}>
                  <ScrollView 
                    ref={monthScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleMonthScroll}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  >
                    {months.map((month) => renderWheelItem(month, selectedMonth === month))}
                  </ScrollView>
                </View>

                <View style={datePickerStyles.wheelColumn}>
                  <ScrollView 
                    ref={dayScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleDayScroll}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  >
                    {days.map((day) => renderWheelItem(day, selectedDay === day))}
                  </ScrollView>
                </View>

                <View style={datePickerStyles.wheelColumn}>
                  <ScrollView 
                    ref={yearScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleYearScroll}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  >
                    {years.map((year) => renderWheelItem(year, selectedYear === year))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const medicationTypes: { type: MedicationType; emoji: string; bgColor: string }[] = [
    { type: 'Pill', emoji: '💊', bgColor: '#DBEAFE' },
    { type: 'Injection', emoji: '💉', bgColor: '#FCE7F3' },
    { type: 'Drops', emoji: '💧', bgColor: '#DBEAFE' },
    { type: 'Inhaler', emoji: '🫁', bgColor: '#FCE7F3' },
    { type: 'Cream', emoji: '🧴', bgColor: '#FEF3C7' },
    { type: 'Spray', emoji: '💨', bgColor: '#DBEAFE' },
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
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#1F2937',
      marginBottom: 12
    },
    input: {
      borderWidth: 0,
      borderRadius: 12,
      padding: 16,
      fontSize: 15,
      color: '#1F2937',
      backgroundColor: '#F3F4F6',
      marginBottom: 24
    },
    medicationTypesGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 12,
      marginBottom: 24
    },
    medicationTypeCard: {
      width: '48%',
      aspectRatio: 1.5,
      borderRadius: 16,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 2,
      borderColor: 'transparent'
    },
    medicationTypeCardActive: {
      borderColor: '#4F7FFF'
    },
    medicationTypeEmoji: {
      fontSize: 32,
      marginBottom: 8
    },
    medicationTypeText: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: '#1F2937'
    },
    row: {
      flexDirection: 'row' as const,
      gap: 12,
      marginBottom: 24
    },
    inputSmall: {
      flex: 1,
      borderWidth: 0,
      borderRadius: 12,
      padding: 16,
      fontSize: 15,
      color: '#1F2937',
      backgroundColor: '#F3F4F6'
    },
    frequencyContainer: {
      flexDirection: 'row' as const,
      gap: 12,
      marginBottom: 24
    },
    frequencyButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: '#F3F4F6',
      alignItems: 'center' as const
    },
    frequencyButtonActive: {
      backgroundColor: '#4F7FFF'
    },
    frequencyText: {
      fontSize: 15,
      fontWeight: '500' as const,
      color: '#6B7280'
    },
    frequencyTextActive: {
      color: '#FFFFFF'
    },
    subLabel: {
      fontSize: 14,
      color: '#9CA3AF',
      marginBottom: 12
    },
    dropdown: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      borderWidth: 0,
      borderRadius: 12,
      padding: 16,
      backgroundColor: '#F3F4F6',
      marginBottom: 16
    },
    dropdownText: {
      fontSize: 15,
      color: '#1F2937'
    },
    reminderTimeButton: {
      backgroundColor: '#4F7FFF',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row' as const,
      alignItems: 'center' as const
    },
    reminderTimeText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '500' as const
    },
    addTimeButton: {
      borderWidth: 2,
      borderColor: '#4F7FFF',
      borderStyle: 'dashed' as const,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center' as const,
      marginBottom: 24
    },
    addTimeText: {
      color: '#4F7FFF',
      fontSize: 15,
      fontWeight: '500' as const
    },
    textArea: {
      borderWidth: 0,
      borderRadius: 12,
      padding: 16,
      fontSize: 15,
      color: '#1F2937',
      backgroundColor: '#F3F4F6',
      marginBottom: 24,
      minHeight: 100,
      textAlignVertical: 'top' as const
    },
    saveButton: {
      backgroundColor: '#D1D5DB',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center' as const,
      marginBottom: 80
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600' as const
    },
    dropdownModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    },
    dropdownModalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      width: '80%',
      maxWidth: 300,
      overflow: 'hidden' as const
    },
    dropdownOption: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6'
    },
    dropdownOptionText: {
      fontSize: 16,
      color: '#1F2937'
    },
    dropdownOptionTextActive: {
      color: '#4F7FFF',
      fontWeight: '600' as const
    }
  });

  const timePickerStyles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'flex-end' as const
    },
    modalContent: {
      backgroundColor: '#F9FAFB',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: Platform.OS === 'ios' ? 34 : 20
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#FFFFFF'
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: '600' as const,
      color: '#1F2937'
    },
    cancelText: {
      fontSize: 17,
      color: '#4F7FFF',
      fontWeight: '400' as const
    },
    doneText: {
      fontSize: 17,
      color: '#4F7FFF',
      fontWeight: '600' as const
    },
    pickerContainer: {
      position: 'relative' as const,
      backgroundColor: '#FFFFFF',
      marginTop: 1
    },
    selectionIndicator: {
      position: 'absolute' as const,
      top: '50%',
      left: 0,
      right: 0,
      height: 44,
      marginTop: -22,
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#E5E7EB',
      zIndex: 1,
      pointerEvents: 'none' as const
    },
    wheelContainer: {
      flexDirection: 'row' as const,
      height: 220,
      paddingHorizontal: 20
    },
    wheelColumn: {
      flex: 1,
      overflow: 'hidden' as const
    },
    wheelItem: {
      height: 44,
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    },
    wheelItemText: {
      fontSize: 20,
      color: '#9CA3AF'
    },
    wheelItemTextSelected: {
      fontSize: 23,
      fontWeight: '500' as const,
      color: '#1F2937'
    }
  });

  const datePickerStyles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'flex-end' as const
    },
    modalContent: {
      backgroundColor: '#F9FAFB',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: Platform.OS === 'ios' ? 34 : 20
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#FFFFFF'
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: '600' as const,
      color: '#1F2937'
    },
    cancelText: {
      fontSize: 17,
      color: '#4F7FFF',
      fontWeight: '400' as const
    },
    doneText: {
      fontSize: 17,
      color: '#4F7FFF',
      fontWeight: '600' as const
    },
    pickerContainer: {
      position: 'relative' as const,
      backgroundColor: '#FFFFFF',
      marginTop: 1
    },
    selectionIndicator: {
      position: 'absolute' as const,
      top: '50%',
      left: 0,
      right: 0,
      height: 44,
      marginTop: -22,
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#E5E7EB',
      zIndex: 1,
      pointerEvents: 'none' as const
    },
    wheelContainer: {
      flexDirection: 'row' as const,
      height: 220,
      paddingHorizontal: 20
    },
    wheelColumn: {
      flex: 1,
      overflow: 'hidden' as const
    },
    wheelItem: {
      height: 44,
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    },
    wheelItemText: {
      fontSize: 20,
      color: '#9CA3AF'
    },
    wheelItemTextSelected: {
      fontSize: 23,
      fontWeight: '500' as const,
      color: '#1F2937'
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Medication</Text>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Medication Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter medication name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Medication Type</Text>
        <View style={styles.medicationTypesGrid}>
          {medicationTypes.map((item) => (
            <TouchableOpacity
              key={item.type}
              style={[
                styles.medicationTypeCard,
                { backgroundColor: item.bgColor },
                medicationType === item.type && styles.medicationTypeCardActive
              ]}
              onPress={() => setMedicationType(item.type)}
            >
              <Text style={styles.medicationTypeEmoji}>{item.emoji}</Text>
              <Text style={styles.medicationTypeText}>{item.type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.inputSmall}
              placeholder="1"
              placeholderTextColor="#9CA3AF"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Dosage</Text>
            <TextInput
              style={styles.inputSmall}
              placeholder="10"
              placeholderTextColor="#9CA3AF"
              value={dosage}
              onChangeText={setDosage}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Unit</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{unit}</Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Frequency</Text>
        <View style={styles.frequencyContainer}>
          {(['Daily', 'Weekly', 'As needed'] as FrequencyType[]).map((freq) => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.frequencyButton,
                frequency === freq && styles.frequencyButtonActive
              ]}
              onPress={() => setFrequency(freq)}
            >
              <Text style={[
                styles.frequencyText,
                frequency === freq && styles.frequencyTextActive
              ]}>
                {freq}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Reminder Times</Text>
        <Text style={styles.subLabel}>How many times per day?</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowTimesDropdown(true)}>
          <Text style={styles.dropdownText}>{timesPerDay}</Text>
          <ChevronDown size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <Text style={styles.subLabel}>Set your reminder times</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12, gap: 8 }}>
          {reminderTimes.map((time, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.reminderTimeButton}
              onPress={() => setShowTimePickerIndex(index)}
            >
              <Clock size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.reminderTimeText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.dropdownText}>{formatDate(startDate)}</Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowEndDatePicker(true)}>
              <Text style={[styles.dropdownText, { color: endDate ? '#1F2937' : '#9CA3AF' }]}>
                {endDate ? formatDate(endDate) : 'Select Date'}
              </Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Add any special instructions or notes..."
          placeholderTextColor="#9CA3AF"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Medication</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav
        activeTab={activeTab}
        onHome={onHome}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />

      <Modal
        visible={showTimesDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimesDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.dropdownModalOverlay} 
          activeOpacity={1}
          onPress={() => setShowTimesDropdown(false)}
        >
          <View style={styles.dropdownModalContent}>
            {timesPerDayOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownOption}
                onPress={() => handleTimesPerDayChange(option)}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  timesPerDay === option && styles.dropdownOptionTextActive
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {showTimePickerIndex !== null && (
        <TimePickerModal
          visible={true}
          onClose={() => setShowTimePickerIndex(null)}
          onSelect={(time) => {
            updateReminderTime(showTimePickerIndex, time);
            setShowTimePickerIndex(null);
          }}
          currentTime={reminderTimes[showTimePickerIndex]}
        />
      )}

      {showStartDatePicker && (
        <DatePickerModal
          visible={true}
          onClose={() => setShowStartDatePicker(false)}
          onSelect={(date) => {
            setStartDate(date);
            setShowStartDatePicker(false);
          }}
          currentDate={startDate}
          title="Select Start Date"
        />
      )}

      {showEndDatePicker && (
        <DatePickerModal
          visible={true}
          onClose={() => setShowEndDatePicker(false)}
          onSelect={(date) => {
            setEndDate(date);
            setShowEndDatePicker(false);
          }}
          currentDate={new Date()}
          title="Select End Date"
        />
      )}
    </SafeAreaView>
  );
};

export default AddMedicationScreen;
