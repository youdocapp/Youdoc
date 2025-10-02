import React from 'react';
import { router } from 'expo-router';
import AddMedicationScreen from '../components/AddMedicationScreen';

export default function AddMedicationRoute() {
  const handleBack = () => {
    router.replace('/my-medication');
  };

  const handleSave = () => {
    router.replace('/my-medication');
  };

  return (
    <AddMedicationScreen
      onBack={handleBack}
      onSave={handleSave}
    />
  );
}
