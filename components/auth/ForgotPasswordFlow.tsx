import React, { useState } from 'react';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import NewPasswordScreen from './NewPasswordScreen';
import ResetPasswordConfirmationScreen from './ResetPasswordConfirmationScreen';

interface ForgotPasswordFlowProps {
  onComplete: () => void;
  onBack: () => void;
  initialStep?: number;
  resetToken?: string;
}

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({
  onComplete,
  onBack,
  initialStep = 1,
  resetToken
}) => {
  const [step, setStep] = useState<number>(initialStep);
  const [email, setEmail] = useState<string>('');

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep(2);
  };

  const handlePasswordReset = () => {
    setStep(3);
  };

  const handleBackToEmail = () => {
    setStep(1);
  };

  if (step === 1) {
    return (
      <ForgotPasswordScreen
        onNext={handleEmailSubmit}
        onBack={onBack}
      />
    );
  }

  if (step === 2) {
    return (
      <NewPasswordScreen
        onSuccess={handlePasswordReset}
        onBack={handleBackToEmail}
      />
    );
  }

  return (
    <ResetPasswordConfirmationScreen
      onContinue={onComplete}
    />
  );
};

export default ForgotPasswordFlow;
