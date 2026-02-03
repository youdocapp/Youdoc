import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pill, CheckCircle, Circle, Clock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useMedication } from '@/contexts/MedicationContext';
import { Card } from './Card';
import { Button } from './Button';

export const MedicationWidget: React.FC = () => {
  const { colors } = useTheme();
  const { medications, toggleMedicationTaken } = useMedication();

  const todayMedications = useMemo(() => {
    if (!medications || !Array.isArray(medications)) {
      return [];
    }
    const today = new Date().toISOString().split('T')[0];
    // Filter for today's medications (simple logic for now)
    // In a real app, check frequency/schedule
    return medications.filter(med => med.is_active).slice(0, 3); 
  }, [medications]);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    viewAllRequest: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600'
    },
    list: {
      paddingHorizontal: 20,
      gap: 12,
    },
    medCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    medLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.card === '#FFFFFF' ? '#EEF2FF' : '#1E293B',
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    details: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textSecondary,
      padding: 20,
    },
  });

  if (todayMedications.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Today's Plan</Text>
        </View>
        <Text style={styles.emptyText}>No medications scheduled for today.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Plan</Text>
      </View>
      <View style={styles.list}>
        {todayMedications.map((med) => (
          <Card key={med.id} style={styles.medCard}>
            <View style={styles.medLeft}>
              <View style={styles.iconBox}>
                <Pill size={24} color={colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={[
                  styles.name, 
                  med.taken && { textDecorationLine: 'line-through', color: colors.textSecondary }
                ]}>
                  {med.name}
                </Text>
                <Text style={styles.details}>
                    {med.dosage_display || `${med.dosage_amount || ''} ${med.dosage_unit || ''}`.trim() || 'No dosage'} • {med.time?.[0] || 'Anytime'}
                </Text>
              </View>
            </View>
             <TouchableOpacity
                onPress={() => toggleMedicationTaken(med.id)}
             >
                {med.taken ? (
                    <CheckCircle size={28} color={colors.success || '#10B981'} fill={colors.card} />
                ) : (
                    <Circle size={28} color={colors.border} />
                )}
             </TouchableOpacity>
          </Card>
        ))}
      </View>
    </View>
  );
};
