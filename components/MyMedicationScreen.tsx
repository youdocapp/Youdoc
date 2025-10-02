import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useMedication } from '../contexts/MedicationContext';

interface MyMedicationScreenProps {
  onBack: () => void;
  onAddMedication?: () => void;
  onHome?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
}

const MyMedicationScreen: React.FC<MyMedicationScreenProps> = ({ onBack, onAddMedication }) => {
  const { colors } = useTheme();
  const { medications } = useMedication();

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
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8
    },
    addButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600' as const
    },
    content: {
      paddingHorizontal: 24
    },
    medicationCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border
    },
    medicationName: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8
    },
    medicationDetails: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4
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
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>My Medication</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAddMedication}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {medications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No medications added yet</Text>
          </View>
        ) : (
          medications.map((med) => (
            <View key={med.id} style={styles.medicationCard}>
              <Text style={styles.medicationName}>{med.name}</Text>
              <Text style={styles.medicationDetails}>Dosage: {med.dosage}</Text>
              <Text style={styles.medicationDetails}>Frequency: {med.frequency}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyMedicationScreen;
