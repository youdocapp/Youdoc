import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SubscriptionScreenProps {
  onBack: () => void;
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ onBack }) => {
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
    planCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border
    },
    planName: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8
    },
    planPrice: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      color: colors.primary,
      marginBottom: 16
    },
    planFeature: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8
    },
    subscribeButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center' as const,
      marginTop: 16
    },
    subscribeButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600' as const
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Subscription</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.planCard}>
          <Text style={styles.planName}>Free Plan</Text>
          <Text style={styles.planPrice}>$0/month</Text>
          <Text style={styles.planFeature}>✓ Basic health tracking</Text>
          <Text style={styles.planFeature}>✓ Medication reminders</Text>
          <Text style={styles.planFeature}>✓ Health articles</Text>
        </View>

        <View style={styles.planCard}>
          <Text style={styles.planName}>Premium Plan</Text>
          <Text style={styles.planPrice}>$9.99/month</Text>
          <Text style={styles.planFeature}>✓ All Free features</Text>
          <Text style={styles.planFeature}>✓ Video consultations</Text>
          <Text style={styles.planFeature}>✓ Priority support</Text>
          <Text style={styles.planFeature}>✓ Advanced health insights</Text>
          <TouchableOpacity style={styles.subscribeButton}>
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;
