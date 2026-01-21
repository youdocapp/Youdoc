import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stethoscope, Syringe, MapPin, Pill, FileText, Phone } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from './Card';
import { router } from 'expo-router';

interface QuickActionsWidgetProps {
    onSymptomChecker?: () => void;
    onMyMedication?: () => void;
    onSeeDoctor?: () => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
    onSymptomChecker,
    onMyMedication,
    onSeeDoctor,
}) => {
  const { colors } = useTheme();

  const actions = [
      {
          label: 'Symptom\nChecker',
          icon: Stethoscope,
          action: onSymptomChecker,
          color: '#4F7FFF',
          bg: '#EEF2FF'
      },
      {
          label: 'My\nMeds',
          icon: Syringe,
          action: onMyMedication,
          color: '#10B981',
          bg: '#D1FAE5'
      },
      {
          label: 'See a\nDoctor',
          icon: MapPin,
          action: onSeeDoctor,
          color: '#F59E0B',
          bg: '#FEF3C7'
      },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    card: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      minHeight: 110,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        color: colors.text
    }
  });

  return (
    <View style={styles.container}>
      {actions.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={{ flex: 1 }} 
            onPress={item.action}
            activeOpacity={0.7}
          >
            <Card style={styles.card}>
                <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                    <item.icon size={24} color={item.color} />
                </View>
                <Text style={styles.label}>{item.label}</Text>
            </Card>
          </TouchableOpacity>
      ))}
    </View>
  );
};
