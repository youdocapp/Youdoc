import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';

interface WelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext, onSkip }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Text style={styles.title}>
            Welcome to <Text style={styles.titleHighlight}>YouDoc</Text>
          </Text>

          <Text style={styles.subtitle}>
            Your all-in-one health companion for trusted medical advice, remedies, and symptom checking—right at your fingertips.
          </Text>
        </View>

        <View>
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onNext}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center' as const,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1F2937',
    textAlign: 'left' as const,
    marginBottom: 24,
    lineHeight: 40,
  },
  titleHighlight: {
    color: '#4F7FFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'left' as const,
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-start' as const,
    marginBottom: 24,
    gap: 6,
  },
  dot: {
    width: 24,
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: '#4F7FFF',
  },
  buttonsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  skipText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '500' as const,
  },
  nextButton: {
    backgroundColor: '#4F7FFF',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 24,
    alignItems: 'center' as const,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600' as const,
  },
});

export default WelcomeScreen;
