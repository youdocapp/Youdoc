import React, { useState } from 'react';
import SignUpScreen from './SignUpScreen';
import EmailVerificationScreen from './EmailVerificationScreen';
import SuccessScreen from './SuccessScreen';

interface SignUpFlowProps {
  onComplete: () => void;
  onBack: () => void;
  onSignOut: () => void;
}

const SignUpFlow: React.FC<SignUpFlowProps> = ({ onComplete, onBack, onSignOut }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<any>(null);

  const handleSignUpNext = (data: any) => {
    setFormData(data);
    setStep(2);
  };

  const handleVerificationComplete = () => {
    setStep(3);
  };

  const handleSuccessComplete = () => {
    onComplete();
  };

  const handleBackToSignUp = () => {
    setStep(1);
  };

  if (step === 1) {
    return <SignUpScreen onNext={handleSignUpNext} onBack={onBack} />;
  }

  if (step === 2) {
    return (
      <EmailVerificationScreen
        email={formData?.email || ''}
        onVerified={handleVerificationComplete}
        onBack={handleBackToSignUp}
      />
    );
  }

  return (
    <SuccessScreen
      title="Account Created!"
      message="Your account has been successfully created. Welcome to YouDoc!"
      onContinue={handleSuccessComplete}
    />
  );
};

export default SignUpFlow;
