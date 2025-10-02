import React from 'react';
import { router } from 'expo-router';
import AboutScreen from '../components/AboutScreen';

export default function AboutRoute() {
  const handleBack = () => {
    router.replace('/settings');
  };

  return (
    <AboutScreen
      onBack={handleBack}
    />
  );
}
