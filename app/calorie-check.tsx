import React from 'react';
import { router } from 'expo-router';
import CalorieCheckScreen from '@/components/CalorieCheckScreen';

export default function CalorieCheckPage() {
  return <CalorieCheckScreen onBack={() => router.back()} />;
}

