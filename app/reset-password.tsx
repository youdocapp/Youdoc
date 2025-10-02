import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import ForgotPasswordFlow from '../components/auth/ForgotPasswordFlow';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();

  const handleResetComplete = () => {
    router.replace('/signin');
  };

  const handleBack = () => {
    router.replace('/signin');
  };

  return (
    <ForgotPasswordFlow 
      onComplete={handleResetComplete}
      onBack={handleBack}
      initialStep={2}
      resetToken={token}
    />
  );
}
