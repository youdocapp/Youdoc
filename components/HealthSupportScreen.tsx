import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface HealthSupportScreenProps {
  onBack: () => void;
}

const HealthSupportScreen: React.FC<HealthSupportScreenProps> = ({ onBack }) => {
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
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>FAQs</Text>
          <Text style={styles.cardDescription}>Find answers to common questions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Contact Support</Text>
          <Text style={styles.cardDescription}>Get in touch with our support team</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Live Chat</Text>
          <Text style={styles.cardDescription}>Chat with a support representative</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthSupportScreen;
