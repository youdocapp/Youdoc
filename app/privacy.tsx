import React from 'react';
import { router } from 'expo-router';
import PrivacyScreen from '../components/PrivacyScreen';

export default function PrivacyRoute() {
  const handleBack = () => {
    router.replace('/settings');
  };

  return (
    <PrivacyScreen
      onBack={handleBack}
    />
  );
}
