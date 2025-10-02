import React from 'react';
import { AuthThemeProvider } from '../contexts/AuthThemeContext';
import SignInScreen from '../components/auth/SignInScreen';
import { useRouter } from 'expo-router';

export default function SignInPage() {
  const router = useRouter();

  return (
    <AuthThemeProvider>
      <SignInScreen 
        onForgotPassword={() => router.push('/forgot-password')}
        onSignUp={() => router.push('/signup')}
      />
    </AuthThemeProvider>
  );
}
