import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';

interface CarepointScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const CarepointScreen: React.FC<CarepointScreenProps> = ({ onNext, onBack }) => {
  const { colors } = useAuthTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingVertical: 48 }}>
        <TouchableOpacity onPress={onBack} style={{ alignSelf: 'flex-start' }}>
          <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.primaryLight,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32
          }}>
            <Text style={{ fontSize: 48 }}>📋</Text>
          </View>

          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            fontFamily: 'ReadexPro-Medium',
            textAlign: 'center',
            marginBottom: 16
          }}>
            Manage Medications
          </Text>

          <Text style={{
            fontSize: 16,
            color: colors.textSecondary,
            fontFamily: 'ReadexPro-Medium',
            textAlign: 'center',
            lineHeight: 24
          }}>
            Set reminders, track dosages, and never miss a medication with smart notifications.
          </Text>
        </View>

        <TouchableOpacity 
          onPress={onNext}
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
            fontWeight: '500',
            fontFamily: 'ReadexPro-Medium'
          }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CarepointScreen;
