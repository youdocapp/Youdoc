import React from 'react';
import { router } from 'expo-router';
import HIPAAComplianceScreen from '../components/HIPAAComplianceScreen';

export default function HIPAAComplianceRoute() {
  const handleBack = () => {
    router.replace('/settings');
  };

  return (
    <HIPAAComplianceScreen 
      onBack={handleBack}
    />
  );
}
