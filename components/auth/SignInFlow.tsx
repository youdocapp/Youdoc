import React from 'react';
import { router } from 'expo-router';
import SignInScreen from './SignInScreen';

interface SignInFlowProps {
  onComplete: () => void;
  onBack: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
}

const SignInFlow: React.FC<SignInFlowProps> = ({ onComplete, onBack, onSignUp, onSignOut }) => {
  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <SignInScreen
      onForgotPassword={handleForgotPassword}
      onSignUp={onSignUp}
    />
  );
};

export default SignInFlow;
