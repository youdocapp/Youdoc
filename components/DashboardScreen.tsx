import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardScreenProps {
  onSymptomChecker?: () => void;
  onMyMedication?: () => void;
  onSeeDoctor?: () => void;
  onHealthArticles?: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onSymptomChecker,
  onMyMedication,
  onSeeDoctor,
  onHealthArticles
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 24
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      color: colors.text,
      marginBottom: 8
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
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
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome to YouDoc</Text>
        </View>

        <View style={{ paddingHorizontal: 24 }}>
          <TouchableOpacity style={styles.card} onPress={onSymptomChecker}>
            <Text style={styles.cardTitle}>Symptom Checker</Text>
            <Text style={styles.cardDescription}>Check your symptoms and get health insights</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={onMyMedication}>
            <Text style={styles.cardTitle}>My Medication</Text>
            <Text style={styles.cardDescription}>Manage your medications and reminders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={onSeeDoctor}>
            <Text style={styles.cardTitle}>See a Doctor</Text>
            <Text style={styles.cardDescription}>Connect with healthcare professionals</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={onHealthArticles}>
            <Text style={styles.cardTitle}>Health Articles</Text>
            <Text style={styles.cardDescription}>Read the latest health tips and articles</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
