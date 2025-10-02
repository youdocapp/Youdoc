import React from 'react';
import { router } from 'expo-router';
import SubscriptionScreen from '../components/SubscriptionScreen';

export default function SubscriptionRoute() {
  const handleBack = () => {
    router.replace('/settings');
  };

  return (
    <SubscriptionScreen
      onBack={handleBack}
    />
  );
}
