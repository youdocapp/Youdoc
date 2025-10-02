import React from 'react';
import { router } from 'expo-router';
import MedicalHistoryScreen from '../components/MedicalHistoryScreen';

export default function MedicalHistoryRoute() {
  const handleBack = () => {
    router.replace('/profile');
  };

  return (
    <MedicalHistoryScreen
      onBack={handleBack}
    />
  );
}
