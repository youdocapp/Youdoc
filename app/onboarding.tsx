import React from 'react';
import { AuthThemeProvider } from '../contexts/AuthThemeContext';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';

export default function OnboardingPage() {
  return (
    <AuthThemeProvider>
      <OnboardingFlow />
    </AuthThemeProvider>
  );
}
