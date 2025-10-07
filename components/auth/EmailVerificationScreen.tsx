import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';
import { useMockAuth } from '../../contexts/MockAuthContext';
import { ChevronLeft } from 'lucide-react-native';

interface EmailVerificationScreenProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ email, onVerified, onBack }) => {
  const { colors } = useAuthTheme();
  const { verifyOTP, resendOTP } = useMockAuth();
  const [code, setCode] = useState(['', '', '', '']);
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

    if (value && index < 3) {
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
    if (verificationCode.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter the complete 4-digit code.');
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ paddingTop: 16, paddingBottom: 32 }}>
          <TouchableOpacity onPress={onBack} style={{ marginBottom: 32 }}>
            <ChevronLeft size={28} color="#000000" />
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#000000' }}>
              Check your email
            </Text>
            <Text style={{ fontSize: 28, marginLeft: 8 }}>✨</Text>
          </View>
          <Text style={{ fontSize: 15, color: '#9CA3AF', marginBottom: 32 }}>
            We sent a verification link to {email}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => { inputRefs.current[index] = ref; }}
              value={digit}
              onChangeText={(value) => handleCodeChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                width: 70,
                height: 70,
                borderWidth: 1,
                borderColor: digit ? '#3B82F6' : '#E5E7EB',
                borderRadius: 12,
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontSize: 28,
                fontWeight: '700',
                textAlign: 'center'
              }}
            />
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleVerify}
          style={{
            width: '100%',
            backgroundColor: (isCodeComplete && !loading) ? '#3B82F6' : '#D1D5DB',
            paddingVertical: 16,
            borderRadius: 12,
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
              fontWeight: '600'
            }}>
              Verify email
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#6B7280', fontSize: 14 }}>
            {"Didn't receive the email? "}
          </Text>
          {timer > 0 ? (
            <Text style={{ color: '#6B7280', fontSize: 14 }}>
              Resend in {timer}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              <Text style={{ color: '#3B82F6', fontSize: 14, fontWeight: '600' }}>
                {resending ? 'Sending...' : 'Click to resend'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;
