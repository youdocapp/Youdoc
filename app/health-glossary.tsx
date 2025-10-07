import React from 'react';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import HealthGlossaryScreen from '../components/HealthGlossaryScreen';

export default function HealthGlossaryRoute() {
  const params = useLocalSearchParams();
  const initialSearchQuery = typeof params.query === 'string' ? params.query : '';

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HealthGlossaryScreen
        onBack={handleBack}
        initialSearchQuery={initialSearchQuery}
      />
    </>
  );
}
