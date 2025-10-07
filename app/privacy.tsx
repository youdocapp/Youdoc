import React from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import PrivacyScreen from '../components/PrivacyScreen';

export default function PrivacyRoute() {
  const handleBack = () => {
    router.replace('/settings');
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const handlePrivacyPolicy = () => {
    router.push('/privacy-policy');
  };

  const handleTermsOfService = () => {
    router.push('/terms-of-service');
  };

  const handleHIPAACompliance = () => {
    router.push('/hipaa-compliance');
  };

  const handleDownloadData = () => {
    router.push('/download-data');
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to permanently delete all your data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data Deleted', 'All your data has been permanently deleted.');
          }
        }
      ]
    );
  };

  return (
    <PrivacyScreen
      onBack={handleBack}
      onChangePassword={handleChangePassword}
      onPrivacyPolicy={handlePrivacyPolicy}
      onTermsOfService={handleTermsOfService}
      onHIPAACompliance={handleHIPAACompliance}
      onDownloadData={handleDownloadData}
      onDeleteData={handleDeleteData}
    />
  );
}
