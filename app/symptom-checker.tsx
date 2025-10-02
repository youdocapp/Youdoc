import React from 'react';
import { router } from 'expo-router';
import SymptomCheckerScreen from '../components/SymptomCheckerScreen';

export default function SymptomChecker() {
  const handleBack = () => {
    router.replace('/dashboard');
  };

  const handleHome = () => {
    router.replace('/dashboard');
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <SymptomCheckerScreen
      onBack={handleBack}
      onHome={handleHome}
      onNotifications={handleNotifications}
      onProfile={handleProfile}
    />
  );
}
