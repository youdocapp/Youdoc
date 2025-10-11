import React from 'react';
import { router } from 'expo-router';
import MyMedicationScreen from '../components/MyMedicationScreen';

export default function MyMedication() {
  const handleBack = () => {
    // Navigate back to dashboard instead of relying on navigation history
    router.replace('/dashboard');
  };

  const handleAddMedication = () => {
    router.push('/add-medication');
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
    <MyMedicationScreen
      onBack={handleBack}
      onAddMedication={handleAddMedication}
      onHome={handleHome}
      onNotifications={handleNotifications}
      onProfile={handleProfile}
    />
  );
}

