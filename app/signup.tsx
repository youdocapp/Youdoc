import React, { useState } from 'react';
import { View } from 'react-native';
import { AuthThemeProvider } from '../contexts/AuthThemeContext';
import SignUpScreen from '../components/auth/SignUpScreen';
import EmailVerificationScreen from '../components/auth/EmailVerificationScreen';
import { useRouter } from 'expo-router';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [formData, setFormData] = useState<any>(null);

  const handleSignUpNext = (data: any) => {
    setFormData(data);
    setStep('verify');
  };

  const handleVerified = () => {
    router.push('/dashboard');
  };

  return (
    <AuthThemeProvider>
      <View style={{ flex: 1 }}>
        {step === 'signup' ? (
          <SignUpScreen 
            onNext={handleSignUpNext}
            onBack={() => router.back()}
          />
        ) : (
          <EmailVerificationScreen
            email={formData?.email || ''}
            onVerified={handleVerified}
            onBack={() => setStep('signup')}
          />
        )}
      </View>
    </AuthThemeProvider>
  );
}
