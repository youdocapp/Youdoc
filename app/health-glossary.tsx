import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import HealthGlossaryScreen from '../components/HealthGlossaryScreen';

export default function HealthGlossaryRoute() {
  const params = useLocalSearchParams();
  const initialSearchQuery = typeof params.query === 'string' ? params.query : '';

  const handleBack = () => {
    router.back();
  };

  return (
    <HealthGlossaryScreen
      onBack={handleBack}
      initialSearchQuery={initialSearchQuery}
    />
  );
}
