import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CarepointDataRightsRequestProps {
  onBack: () => void;
}

const CarepointDataRightsRequest: React.FC<CarepointDataRightsRequestProps> = ({ onBack }) => {
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
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Data Rights Request</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Submit a request to access, modify, or delete your personal data.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CarepointDataRightsRequest;
