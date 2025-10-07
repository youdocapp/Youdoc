import React from 'react';
import { router } from 'expo-router';
import PrivacyScreen from '../components/PrivacyScreen';

export default function PrivacyRoute() {
  const handleBack = () => {
    router.replace('/settings');
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

  return (
    <PrivacyScreen
      onBack={handleBack}
      onPrivacyPolicy={handlePrivacyPolicy}
      onTermsOfService={handleTermsOfService}
      onHIPAACompliance={handleHIPAACompliance}
    />
  );
}
