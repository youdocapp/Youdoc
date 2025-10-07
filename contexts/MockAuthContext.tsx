import React, { createContext, useContext, useState } from 'react';

interface MockAuthContextType {
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  verifyOTP: (code: string) => Promise<{ success: boolean; error?: string }>;
  resendOTP: () => Promise<{ success: boolean; error?: string }>;
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedOTP, setStoredOTP] = useState<string>('12345');

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('Mock SignUp:', { email, password, metadata });
    const newOTP = Math.floor(10000 + Math.random() * 90000).toString();
    setStoredOTP(newOTP);
    console.log('OTP sent:', newOTP);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const signIn = async (email: string, password: string) => {
    console.log('Mock SignIn:', { email, password });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Login successful - accepting any credentials');
  };

  const verifyOTP = async (code: string) => {
    console.log('Verifying OTP:', code, 'Expected:', storedOTP);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (code === storedOTP) {
      return { success: true };
    }
    return { success: false, error: 'Invalid verification code' };
  };

  const resendOTP = async () => {
    const newOTP = Math.floor(10000 + Math.random() * 90000).toString();
    setStoredOTP(newOTP);
    console.log('New OTP sent:', newOTP);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  return (
    <MockAuthContext.Provider value={{ signUp, signIn, verifyOTP, resendOTP }}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within MockAuthProvider');
  }
  return context;
};
