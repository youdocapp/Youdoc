import React from 'react';
import { router } from 'expo-router';
import SeeDoctorScreen from '../components/SeeDoctorScreen';

export default function SeeDoctorRoute() {
  const handleBack = () => {
    router.replace('/dashboard');
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
    <SeeDoctorScreen
      onBack={handleBack}
      onHome={handleHome}
      onNotifications={handleNotifications}
      onProfile={handleProfile}
    />
  );
}
