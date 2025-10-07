import React from 'react';
import { router } from 'expo-router';
import ChangePasswordScreen from '../components/ChangePasswordScreen';

export default function ChangePasswordRoute() {
  const handleBack = () => {
    router.back();
  };

  return <ChangePasswordScreen onBack={handleBack} />;
}
