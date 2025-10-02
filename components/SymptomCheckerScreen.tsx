import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SymptomCheckerScreenProps {
  onBack: () => void;
  onHome?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
}

const SymptomCheckerScreen: React.FC<SymptomCheckerScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const [symptoms, setSymptoms] = useState<string>('');

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
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.card,
      minHeight: 120,
      textAlignVertical: 'top' as const,
      marginBottom: 24
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center' as const
    },
    buttonText: {
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
        <Text style={styles.title}>Symptom Checker</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Describe your symptoms and we'll help you understand what might be causing them.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Describe your symptoms..."
          placeholderTextColor={colors.textSecondary}
          value={symptoms}
          onChangeText={setSymptoms}
          multiline
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Check Symptoms</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SymptomCheckerScreen;
