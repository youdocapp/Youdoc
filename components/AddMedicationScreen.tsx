import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useMedication } from '../contexts/MedicationContext';

interface AddMedicationScreenProps {
  onBack: () => void;
  onSave?: () => void;
}

const AddMedicationScreen: React.FC<AddMedicationScreenProps> = ({ onBack, onSave }) => {
  const { colors } = useTheme();
  const { addMedication } = useMedication();
  const [name, setName] = useState<string>('');
  const [dosage, setDosage] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');

  const handleSave = () => {
    if (!name || !dosage || !frequency) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    addMedication({
      name,
      dosage,
      frequency,
      time: [],
      startDate: new Date().toISOString(),
      reminderEnabled: false
    });

    Alert.alert('Success', 'Medication added successfully', [
      { text: 'OK', onPress: () => onSave ? onSave() : onBack() }
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 24
    },
    headerLeft: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const
    },
    backButton: {
      fontSize: 24,
      color: colors.text
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: colors.text,
      marginLeft: 16
    },
    saveButton: {
      paddingHorizontal: 16,
      paddingVertical: 8
    },
    saveButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600' as const
    },
    content: {
      paddingHorizontal: 24
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.card,
      marginBottom: 24
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Medication</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Medication Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter medication name"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Dosage</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 500mg"
          placeholderTextColor={colors.textSecondary}
          value={dosage}
          onChangeText={setDosage}
        />

        <Text style={styles.label}>Frequency</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Twice daily"
          placeholderTextColor={colors.textSecondary}
          value={frequency}
          onChangeText={setFrequency}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMedicationScreen;
