import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';
import { useMockAuth } from '../../contexts/MockAuthContext';

interface EmailVerificationScreenProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ email, onVerified, onBack }) => {
  const { colors } = useAuthTheme();
  const { verifyOTP, resendOTP } = useMockAuth();
  const [code, setCode] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 5) {
      Alert.alert('Invalid Code', 'Please enter the complete 5-digit code.');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(verificationCode);
      if (result.success) {
        Alert.alert(
          'Verified!',
          'Your email has been verified successfully.',
          [{ text: 'OK', onPress: onVerified }]
        );
      } else {
        Alert.alert('Error', result.error || 'Invalid verification code.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOTP();
      setTimer(60);
      Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setResending(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 48, paddingBottom: 32 }}>
          <TouchableOpacity onPress={onBack}>
            <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, fontFamily: 'ReadexPro-Medium', marginBottom: 8 }}>
          Verify your email
        </Text>
        <Text style={{ fontSize: 16, color: colors.textSecondary, fontFamily: 'ReadexPro-Medium', marginBottom: 32 }}>
          We sent a code to {email}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              value={digit}
              onChangeText={(value) => handleCodeChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                width: 56,
                height: 56,
                borderWidth: 2,
                borderColor: digit ? colors.primary : colors.border,
                borderRadius: 12,
                backgroundColor: colors.inputBackground,
                color: colors.text,
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'ReadexPro-Medium'
              }}
            />
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleVerify}
          style={{
            width: '100%',
            backgroundColor: (isCodeComplete && !loading) ? colors.primary : colors.border,
            paddingVertical: 16,
            borderRadius: 25,
            alignItems: 'center',
            marginBottom: 24,
            opacity: loading ? 0.7 : 1
          }}
          disabled={!isCodeComplete || loading}
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
              Verify
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textSecondary, fontSize: 14, fontFamily: 'ReadexPro-Medium' }}>
            Didn't receive the code?{' '}
          </Text>
          {timer > 0 ? (
            <Text style={{ color: colors.textSecondary, fontSize: 14, fontFamily: 'ReadexPro-Medium' }}>
              Resend in {timer}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '600', fontFamily: 'ReadexPro-Medium' }}>
                {resending ? 'Sending...' : 'Resend'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;
