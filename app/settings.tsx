import React from 'react';
import { router } from 'expo-router';
import SettingsScreen from '../components/SettingsScreen';

export default function SettingsRoute() {
  const handleBack = () => {
    router.replace('/dashboard');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handlePrivacy = () => {
    router.push('/privacy');
  };

  const handleHelp = () => {
    router.push('/health-support');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const handleSubscription = () => {
    router.push('/subscription');
  };

  const handleConnectedDevices = () => {
    router.push('/connected-devices');
  };

  return (
    <SettingsScreen
      onBack={handleBack}
      onProfile={handleProfile}
      onPrivacy={handlePrivacy}
      onHelp={handleHelp}
      onAbout={handleAbout}
      onSubscription={handleSubscription}
      onConnectedDevices={handleConnectedDevices}
    />
  );
}
