import React from 'react';
import { router } from 'expo-router';
import ProfileScreen from '../components/ProfileScreen';

export default function ProfileRoute() {
  const handleBack = () => {
    router.replace('/dashboard');
  };

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleHealthRecords = () => {
    router.push('/health-records');
  };

  const handleMedicalHistory = () => {
    router.push('/medical-history');
  };

  const handleEmergencyContacts = () => {
    router.push('/emergency-contacts');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleHome = () => {
    router.push('/dashboard');
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleProfile = () => {
    console.log('Already on profile screen');
  };

  return (
    <ProfileScreen
      onBack={handleBack}
      onEditProfile={handleEditProfile}
      onHealthRecords={handleHealthRecords}
      onMedicalHistory={handleMedicalHistory}
      onEmergencyContacts={handleEmergencyContacts}
      onSettings={handleSettings}
      onHome={handleHome}
      onNotifications={handleNotifications}
      onProfile={handleProfile}
    />
  );
}
