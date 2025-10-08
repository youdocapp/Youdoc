import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User, AuthError } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string; mobile?: string }) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<{ error: AuthError | null }>;
  resendOTP: (email: string) => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing auth...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setSession(null);
          setUser(null);
        } else {
          console.log('🔍 Current session:', currentSession ? 'exists' : 'null');
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('🔄 Auth state changed:', _event, 'Session:', newSession ? 'exists' : 'null');
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string; mobile?: string }
  ) => {
    try {
      console.log('🚀 Starting Supabase signup for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: metadata?.first_name,
            last_name: metadata?.last_name,
            mobile: metadata?.mobile,
          },
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        console.error('❌ Signup error:', error);
        return { error };
      }

      console.log('✅ Signup successful:', data);
      await AsyncStorage.setItem('pending_verification_email', email);
      
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected signup error:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🚀 Starting Supabase sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        return { error };
      }

      console.log('✅ Sign in successful:', data);
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected sign in error:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚀 Signing out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        throw error;
      }

      await AsyncStorage.removeItem('pending_verification_email');
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Unexpected sign out error:', error);
      throw error;
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    try {
      console.log('🚀 Verifying OTP for:', email);
      
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        console.error('❌ OTP verification error:', error);
        return { error };
      }

      console.log('✅ OTP verification successful:', data);
      await AsyncStorage.removeItem('pending_verification_email');
      
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected OTP verification error:', error);
      return { error: error as AuthError };
    }
  };

  const resendOTP = async (email: string) => {
    try {
      console.log('🚀 Resending OTP to:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        console.error('❌ Resend OTP error:', error);
        return { error };
      }

      console.log('✅ OTP resent successfully');
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected resend OTP error:', error);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🚀 Sending password reset email to:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: undefined,
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        return { error };
      }

      console.log('✅ Password reset email sent');
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected password reset error:', error);
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      console.log('🚀 Updating password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('❌ Password update error:', error);
        return { error };
      }

      console.log('✅ Password updated successfully');
      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected password update error:', error);
      return { error: error as AuthError };
    }
  };

  const deleteAccount = async () => {
    try {
      console.log('🚀 Deleting account...');
      
      if (!user) {
        return { error: new Error('No user logged in') };
      }

      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) {
        console.error('❌ Account deletion error:', error);
        return { error: new Error(error.message) };
      }

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
        session,
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
