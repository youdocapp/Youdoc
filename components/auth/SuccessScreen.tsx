import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';

interface SuccessScreenProps {
  title: string;
  message: string;
  onContinue: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ title, message, onContinue }) => {
  const { colors } = useAuthTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.success,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24
        }}>
          <Text style={{ fontSize: 40, color: 'white' }}>✓</Text>
        </View>

        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: 16,
          textAlign: 'center'
        }}>
          {title}
        </Text>

        <Text style={{
          fontSize: 16,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: 48
        }}>
          {message}
        </Text>

        <TouchableOpacity
          onPress={onContinue}
          style={{
            width: '100%',
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 25,
            alignItems: 'center'
          }}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600'
          }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SuccessScreen;
