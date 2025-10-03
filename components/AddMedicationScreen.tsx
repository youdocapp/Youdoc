import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import { useMedication } from '../contexts/MedicationContext';
import BottomNav from './ui/BottomNav';

type MedicationType = 'Pill' | 'Injection' | 'Drops' | 'Inhaler' | 'Cream' | 'Spray';
type FrequencyType = 'Daily' | 'Weekly' | 'As needed';

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
  const [timesPerDay, setTimesPerDay] = useState<string>('Once daily');
  const [reminderTimes, setReminderTimes] = useState<string[]>(['8:00 AM']);
  const [startDate, setStartDate] = useState<string>('May 13, 2024');
  const [endDate, setEndDate] = useState<string>('Select Date');
  const [notes, setNotes] = useState<string>('');

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
      startDate: startDate,
      reminderEnabled: true
    });

    Alert.alert('Success', 'Medication added successfully', [
      { text: 'OK', onPress: () => onSave ? onSave() : onBack() }
    ]);
  };

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, '12:00 PM']);
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
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 12
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
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{timesPerDay}</Text>
          <ChevronDown size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <Text style={styles.subLabel}>Set your reminder times</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
          {reminderTimes.map((time, index) => (
            <View key={index} style={styles.reminderTimeButton}>
              <Text style={styles.reminderTimeText}>{time}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.addTimeButton} onPress={addReminderTime}>
          <Text style={styles.addTimeText}>+ Add another time</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{startDate}</Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={[styles.dropdownText, { color: '#9CA3AF' }]}>{endDate}</Text>
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

      <BottomNav
        activeTab={activeTab}
        onHome={onHome}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />
    </SafeAreaView>
  );
};

export default AddMedicationScreen;
