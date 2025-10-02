import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SeeDoctorScreenProps {
  onBack: () => void;
}

const SeeDoctorScreen: React.FC<SeeDoctorScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 24
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
    content: {
      paddingHorizontal: 24
    },
    description: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8
    },
    cardDescription: {
      fontSize: 14,
      color: colors.textSecondary
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>See a Doctor</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Connect with healthcare professionals for consultations and medical advice.
        </Text>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Video Consultation</Text>
          <Text style={styles.cardDescription}>Schedule a video call with a doctor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Chat with Doctor</Text>
          <Text style={styles.cardDescription}>Get quick answers via chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Book Appointment</Text>
          <Text style={styles.cardDescription}>Schedule an in-person visit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SeeDoctorScreen;
