import React from 'react';
import { router } from 'expo-router';
import DownloadDataScreen from '../components/DownloadDataScreen';

export default function DownloadDataRoute() {
  const handleBack = () => {
    router.back();
  };

  return <DownloadDataScreen onBack={handleBack} />;
}
