import React, { useState } from 'react';
import { View } from 'react-native';
import { AuthThemeProvider } from '../contexts/AuthThemeContext';
import ForgotPasswordScreen from '../components/auth/ForgotPasswordScreen';
import EmailVerificationScreen from '../components/auth/EmailVerificationScreen';
import NewPasswordScreen from '../components/auth/NewPasswordScreen';
import { useRouter } from 'expo-router';

type Step = 'forgot' | 'verify' | 'newPassword';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('forgot');
  const [email, setEmail] = useState('');

  const handleForgotNext = (userEmail: string) => {
    setEmail(userEmail);
    setStep('verify');
  };

  const handleVerified = () => {
    setStep('newPassword');
  };

  const handleSuccess = () => {
    router.push('/signin');
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('forgot');
    } else if (step === 'newPassword') {
      setStep('verify');
    } else {
      router.back();
    }
  };

  return (
    <AuthThemeProvider>
      <View style={{ flex: 1 }}>
        {step === 'forgot' && (
          <ForgotPasswordScreen 
            onNext={handleForgotNext}
            onBack={() => router.back()}
          />
        )}
        {step === 'verify' && (
          <EmailVerificationScreen
            email={email}
            onVerified={handleVerified}
            onBack={handleBack}
          />
        )}
        {step === 'newPassword' && (
          <NewPasswordScreen
            onSuccess={handleSuccess}
            onBack={handleBack}
          />
        )}
      </View>
    </AuthThemeProvider>
  );
}
