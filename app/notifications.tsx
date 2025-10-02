import React from 'react';
import { router } from 'expo-router';
import NotificationsScreen from '../components/NotificationsScreen';

export default function NotificationsRoute() {
  const handleBack = () => {
    router.replace('/dashboard');
  };

  const handleHome = () => {
    router.push('/dashboard');
  };

  const handleNotifications = () => {
    console.log('Already on notifications');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <NotificationsScreen
      onBack={handleBack}
      onHome={handleHome}
      onNotifications={handleNotifications}
      onProfile={handleProfile}
    />
  );
}
