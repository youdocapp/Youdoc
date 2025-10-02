import React from 'react';
import { router } from 'expo-router';
import HealthRecordsScreen from '../components/HealthRecordsScreen';

export default function HealthRecordsRoute() {
  const handleBack = () => {
    router.replace('/profile');
  };

  return (
    <HealthRecordsScreen
      onBack={handleBack}
    />
  );
}
