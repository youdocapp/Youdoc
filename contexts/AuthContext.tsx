import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string; mobile?: string }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<{ error: Error | null }>;
  resendOTP: (email: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing auth...');
        const storedUser = await AsyncStorage.getItem('user');
        
        if (storedUser) {
          console.log('🔍 Found stored user');
          setUser(JSON.parse(storedUser));
        } else {
          console.log('🔍 No stored user found');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string; mobile?: string }
  ) => {
    try {
      console.log('🚀 Starting signup for:', email);
      
      await AsyncStorage.setItem('pending_verification_email', email);
      
      console.log('✅ Signup successful (any credentials accepted)');
      return { error: null };
    } catch (error: any) {
      console.error('❌ Unexpected signup error:', error);
      return { 
        error: new Error(error?.message || 'An unexpected error occurred')
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🚀 Starting sign in for:', email);
      
      const userToStore: User = {
        id: Date.now().toString(),
        email: email,
        firstName: 'User',
        lastName: 'Demo',
        mobile: '1234567890',
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
      
      console.log('✅ Sign in successful (any credentials accepted)');
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected sign in error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚀 Signing out...');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('pending_verification_email');
      setUser(null);
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Unexpected sign out error:', error);
      throw error;
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    try {
      console.log('🚀 Verifying OTP for:', email);
      
      await AsyncStorage.removeItem('pending_verification_email');
      
      console.log('✅ OTP verification successful (any code accepted)');
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected OTP verification error:', error);
      return { error: error as Error };
    }
  };

  const resendOTP = async (email: string) => {
    try {
      console.log('🚀 Resending OTP to:', email);
      console.log('✅ OTP resent successfully');
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected resend OTP error:', error);
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🚀 Sending password reset email to:', email);
      
      await AsyncStorage.setItem('password_reset_email', email);
      
      console.log('✅ Password reset email sent (any email accepted)');
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected password reset error:', error);
      return { error: error as Error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      console.log('🚀 Updating password...');
      
      if (!user) {
        return { error: new Error('No user logged in') };
      }
      
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) {
        return { error: new Error('User not found') };
      }
      
      users[userIndex].password = newPassword;
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      console.log('✅ Password updated successfully');
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected password update error:', error);
      return { error: error as Error };
    }
  };

  const deleteAccount = async () => {
    try {
      console.log('🚀 Deleting account...');
      
      if (!user) {
        return { error: new Error('No user logged in') };
      }

      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const filteredUsers = users.filter((u: any) => u.id !== user.id);
      await AsyncStorage.setItem('users', JSON.stringify(filteredUsers));
      
      await signOut();
      console.log('✅ Account deleted successfully');
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected account deletion error:', error);
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        verifyOTP,
        resendOTP,
        resetPassword,
        updatePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
