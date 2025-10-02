import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';

interface ForgotPasswordScreenProps {
  onNext: (email: string) => void;
  onBack: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNext, onBack }) => {
  const { colors } = useAuthTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    if (!isEmailValid()) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password reset code sent to:', email);
      Alert.alert(
        'Code Sent',
        'A password reset code has been sent to your email.',
        [{ text: 'OK', onPress: () => onNext(email) }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset code. Please try again.');
      console.error('Send code error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 48, paddingBottom: 32 }}>
          <TouchableOpacity onPress={onBack}>
            <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, fontFamily: 'ReadexPro-Medium', marginBottom: 8 }}>
          Forgot Password?
        </Text>
        <Text style={{ fontSize: 16, color: colors.textSecondary, fontFamily: 'ReadexPro-Medium', marginBottom: 32 }}>
          Enter your email address and we will send you a code to reset your password.
        </Text>

        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 16,
            backgroundColor: colors.inputBackground,
            color: colors.text,
            marginBottom: 24,
            fontSize: 16,
            fontFamily: 'ReadexPro-Medium'
          }}
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity 
          onPress={handleSendCode}
          style={{
            width: '100%',
            backgroundColor: (isEmailValid() && !loading) ? colors.primary : colors.border,
            paddingVertical: 16,
            borderRadius: 25,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1
          }}
          disabled={!isEmailValid() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '500',
              fontFamily: 'ReadexPro-Medium'
            }}>
              Send Code
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
