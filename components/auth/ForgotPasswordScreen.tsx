import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';

interface ForgotPasswordScreenProps {
  onNext: (email: string) => void;
  onBack: () => void;
  onBackToSignIn: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNext, onBack, onBackToSignIn }) => {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 16, paddingBottom: 32 }}>
          <TouchableOpacity onPress={onBack}>
            <Text style={{ fontSize: 24, color: '#000000' }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#000000', flex: 1, textAlign: 'center', marginRight: 24 }}>
            Forgot Password
          </Text>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#E0E7FF',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24
          }}>
            <Text style={{ fontSize: 48 }}>🔐</Text>
          </View>
          
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#000000', marginBottom: 16, textAlign: 'center' }}>
            Reset your password
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000', marginBottom: 8 }}>
          Email Address
        </Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            width: '100%',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderWidth: 0,
            borderRadius: 12,
            backgroundColor: '#F3F4F6',
            color: '#000000',
            marginBottom: 24,
            fontSize: 16
          }}
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity 
          onPress={handleSendCode}
          style={{
            width: '100%',
            backgroundColor: (isEmailValid() && !loading) ? '#B8C5D6' : '#D1D5DB',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 24,
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
              fontWeight: '600'
            }}>
              Send Reset Email
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onBackToSignIn} style={{ alignItems: 'center' }}>
          <Text style={{ color: '#3B82F6', fontSize: 14, fontWeight: '500' }}>
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
