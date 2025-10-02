import React from 'react';
import { router } from 'expo-router';
import PrivacyPolicyScreen from '../components/PrivacyPolicyScreen';

export default function PrivacyPolicyRoute() {
  const handleBack = () => {
    router.replace('/settings');
  };

  return (
    <PrivacyPolicyScreen 
      onBack={handleBack}
    />
  );
}
