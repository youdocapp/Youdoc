import React, { useState } from 'react';
import { View } from 'react-native';
import WelcomeScreen from './WelcomeScreen';
import WellnessScreen from './WellnessScreen';
import CarepointScreen from './CarepointScreen';
import AuthScreen from './AuthScreen';

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen onNext={handleNext} />;
      case 1:
        return <WellnessScreen onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <CarepointScreen onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <AuthScreen onBack={handleBack} />;
      default:
        return <WelcomeScreen onNext={handleNext} />;
    }
  };

  return <View style={{ flex: 1 }}>{renderStep()}</View>;
};

export default OnboardingFlow;
