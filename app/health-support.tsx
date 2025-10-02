import React from 'react';
import { router } from 'expo-router';
import HealthSupportScreen from '../components/HealthSupportScreen';

export default function HealthSupportRoute() {
  const handleBack = () => {
    router.replace('/settings');
  };

  return (
    <HealthSupportScreen
      onBack={handleBack}
    />
  );
}
