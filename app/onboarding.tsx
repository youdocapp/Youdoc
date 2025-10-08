import React from 'react';
import { AuthThemeProvider } from '../contexts/AuthThemeContext';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';

export default function OnboardingPage() {
  console.log('📱 Onboarding page rendered');
  
  return (
    <AuthThemeProvider>
      <OnboardingFlow startAtAuth={true} />
    </AuthThemeProvider>
  );
}
