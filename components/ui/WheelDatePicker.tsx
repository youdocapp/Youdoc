import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface WheelDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}

const WheelDatePicker: React.FC<WheelDatePickerProps> = ({
  value,
  onChange,
  label = 'Select Date'
}) => {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const [selectedDay, setSelectedDay] = useState<number>(value.getDate());
  const [selectedMonth, setSelectedMonth] = useState<string>(value.toLocaleDateString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState<number>(value.getFullYear());

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleConfirm = () => {
    const monthIndex = months.indexOf(selectedMonth);
    const newDate = new Date(selectedYear, monthIndex, selectedDay);
    onChange(newDate);
    setShowPicker(false);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8
    },
    button: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      backgroundColor: colors.card
    },
    buttonText: {
      fontSize: 16,
      color: colors.text
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 0,
      width: '85%',
      maxWidth: 400
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#1F2937',
      marginBottom: 16,
      textAlign: 'center' as const,
      paddingTop: 20
    },
    clearButton: {
      position: 'absolute' as const,
      top: 20,
      right: 20,
      zIndex: 10
    },
    clearButtonText: {
      fontSize: 16,
      color: '#4F7FFF',
      fontWeight: '600' as const
    },
    wheelContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'space-around' as const,
      paddingVertical: 20,
      paddingHorizontal: 16,
      gap: 8
    },
    wheelColumn: {
      flex: 1,
      height: 200,
      backgroundColor: '#F9FAFB',
      borderRadius: 12,
      overflow: 'hidden' as const
    },
    wheelScroll: {
      flex: 1
    },
    wheelItem: {
      height: 50,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 8
    },
    wheelItemText: {
      fontSize: 16,
      color: '#6B7280'
    },
    wheelItemSelected: {
      backgroundColor: 'rgba(79, 127, 255, 0.1)'
    },
    wheelItemTextSelected: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#1F2937'
    },
    datePreview: {
      paddingVertical: 20,
      paddingHorizontal: 24,
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
      alignItems: 'center' as const
    },
    datePreviewText: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#1F2937'
    },
    modalButtons: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginTop: 0
    },
    modalButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 0,
      marginHorizontal: 0
    },
    cancelButton: {
      backgroundColor: '#F3F4F6',
      borderBottomLeftRadius: 20
    },
    confirmButton: {
      backgroundColor: '#4F7FFF',
      borderBottomRightRadius: 20
    },
    buttonTextWhite: {
      color: 'white',
      textAlign: 'center' as const,
      fontWeight: '600' as const,
      fontSize: 16
    },
    buttonTextDark: {
      color: '#1F2937',
      textAlign: 'center' as const,
      fontWeight: '600' as const,
      fontSize: 16
    }
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.buttonText}>{formatDate(value)}</Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.clearButton} onPress={() => setShowPicker(false)}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            
            <View style={styles.wheelContainer}>
              <View style={styles.wheelColumn}>
                <ScrollView 
                  style={styles.wheelScroll}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                >
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.wheelItem,
                        selectedDay === day && styles.wheelItemSelected
                      ]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text style={[
                        styles.wheelItemText,
                        selectedDay === day && styles.wheelItemTextSelected
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.wheelColumn}>
                <ScrollView 
                  style={styles.wheelScroll}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                >
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.wheelItem,
                        selectedMonth === month && styles.wheelItemSelected
                      ]}
                      onPress={() => setSelectedMonth(month)}
                    >
                      <Text style={[
                        styles.wheelItemText,
                        selectedMonth === month && styles.wheelItemTextSelected
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.wheelColumn}>
                <ScrollView 
                  style={styles.wheelScroll}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.wheelItem,
                        selectedYear === year && styles.wheelItemSelected
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text style={[
                        styles.wheelItemText,
                        selectedYear === year && styles.wheelItemTextSelected
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.datePreview}>
              <Text style={styles.datePreviewText}>
                {selectedDay} {selectedMonth} {selectedYear}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.buttonTextDark}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonTextWhite}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WheelDatePicker;
