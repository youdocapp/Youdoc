import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const { colors } = useAuthTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingVertical: 48 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32
          }}>
            <Text style={{ fontSize: 48, color: 'white' }}>💊</Text>
          </View>

          <Text style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.text,
            fontFamily: 'ReadexPro-Medium',
            textAlign: 'center',
            marginBottom: 16
          }}>
            Welcome to YouDoc
          </Text>

          <Text style={{
            fontSize: 16,
            color: colors.textSecondary,
            fontFamily: 'ReadexPro-Medium',
            textAlign: 'center',
            lineHeight: 24
          }}>
            Your personal health companion for managing medications, tracking symptoms, and staying healthy.
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
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
