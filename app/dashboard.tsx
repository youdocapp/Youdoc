import React from 'react';
import { router } from 'expo-router';
import DashboardScreen from '../components/DashboardScreen';

export default function DashboardPage() {
  const handleSymptomChecker = () => {
    router.push('/symptom-checker');
  };

  const handleMyMedication = () => {
    router.push('/my-medication');
  };

  const handleSeeDoctor = () => {
    router.push('/see-doctor');
  };

  const handleHealthArticles = () => {
    router.push('/health-articles');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <DashboardScreen
      onSymptomChecker={handleSymptomChecker}
      onMyMedication={handleMyMedication}
      onSeeDoctor={handleSeeDoctor}
      onHealthArticles={handleHealthArticles}
      onSettings={handleSettings}
    />
  );
}
