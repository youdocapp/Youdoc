import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from 'lucide-react-native';
// GOOGLE AUTH COMMENTED OUT - Uncomment when ready to re-enable
// import { GoogleIcon, AppleIcon } from '../ui';

interface SignInScreenProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
  onBack: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onForgotPassword, onSignUp, onBack }) => {
  const { login, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('✅ User authenticated, navigating to dashboard');
      router.replace('/dashboard');
    }
  }, [user]);

  const isFormValid = () => {
    return email.trim().length > 0 && password.trim().length > 0;
  };

  const handleSignIn = async () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Form', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      console.log('🔑 Attempting sign in...');
      const result = await login({
        email,
        password,
      });
      
      if (!result.success) {
        setLoading(false);
        const errorMessage = result.error || result.message || 'Failed to sign in. Please try again.';
        const errorDetails = result.details || {};
        console.error('❌ Sign in failed:', errorMessage);
        console.error('❌ Sign in error details:', errorDetails);
        
        // Check for invalid credentials
        if (errorMessage.toLowerCase().includes('invalid') || 
            errorMessage.toLowerCase().includes('credentials') ||
            errorMessage.toLowerCase().includes('incorrect')) {
          Alert.alert(
            'Invalid Credentials',
            'The email or password you entered is incorrect. Please try again.',
            [{ text: 'OK', style: 'default' }]
          );
          return;
        }
        
        // Check for email not verified
        if (errorMessage.toLowerCase().includes('verify') || 
            errorMessage.toLowerCase().includes('verification') ||
            errorMessage.toLowerCase().includes('not verified')) {
          Alert.alert(
            'Email Not Verified',
            'Please verify your email address before signing in. Check your inbox for the verification email.',
            [{ text: 'OK', style: 'default' }]
          );
          return;
        }
        
        // Check for account not found
        if (errorMessage.toLowerCase().includes('not found') ||
            errorMessage.toLowerCase().includes('does not exist') ||
            errorMessage.toLowerCase().includes('no user')) {
          Alert.alert(
            'Account Not Found',
            'No account found with this email address. Please sign up first.',
            [{ text: 'OK', style: 'default' }]
          );
          return;
        }
        
        // Check for network errors
        if (errorMessage.toLowerCase().includes('network') || 
            errorMessage.toLowerCase().includes('fetch') || 
            errorMessage.toLowerCase().includes('timeout') ||
            errorMessage.toLowerCase().includes('connection')) {
          Alert.alert(
            'Connection Error',
            'Unable to connect to the server. Please check your internet connection and try again.',
            [{ text: 'OK', style: 'default' }]
          );
          return;
        }
        
        // Check for account locked or disabled
        if (errorMessage.toLowerCase().includes('locked') ||
            errorMessage.toLowerCase().includes('disabled') ||
            errorMessage.toLowerCase().includes('suspended')) {
          Alert.alert(
            'Account Unavailable',
            'Your account has been locked or disabled. Please contact support for assistance.',
            [{ text: 'OK', style: 'default' }]
          );
          return;
        }
        
        // Generic error with refined message
        let refinedMessage = errorMessage;
        if (errorMessage.toLowerCase().includes('login failed')) {
          refinedMessage = 'Login failed. Please check your credentials and try again.';
        } else if (errorMessage.toLowerCase().includes('server error')) {
          refinedMessage = 'Server error. Please try again in a moment.';
        }
        
        Alert.alert(
          'Sign In Failed',
          refinedMessage,
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      console.log('✅ Sign in successful, waiting for auth state update...');
    } catch (error) {
      setLoading(false);
      console.error('❌ Sign in error:', error);
      Alert.alert(
        'Unexpected Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
          <TouchableOpacity onPress={onBack} style={{ marginBottom: 32 }}>
            <ChevronLeft size={28} color="#000000" />
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#000000' }}>
              Log in
            </Text>
            <Text style={{ fontSize: 28, marginLeft: 8 }}>✨</Text>
          </View>

          <Text style={{ fontSize: 15, color: '#6B7280', marginBottom: 32 }}>
            Welcome back! Please enter your details.
          </Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Email
          </Text>
          <View style={{ position: 'relative', marginBottom: 20 }}>
            <Mail size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                width: '100%',
                paddingLeft: 48,
                paddingRight: 20,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 12,
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontSize: 15
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Password
          </Text>
          <View style={{ position: 'relative', marginBottom: 16 }}>
            <Lock size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
            <TextInput
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              style={{
                width: '100%',
                paddingLeft: 48,
                paddingRight: 48,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 12,
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontSize: 15
              }}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={{
                position: 'absolute',
                right: 16,
                top: 16,
                zIndex: 1
              }}
            >
              {passwordVisible ? (
                <Eye size={20} color="#9CA3AF" />
              ) : (
                <EyeOff size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <TouchableOpacity 
              onPress={() => setRememberMe(!rememberMe)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={{
                width: 18,
                height: 18,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: rememberMe ? '#3B82F6' : '#D1D5DB',
                backgroundColor: rememberMe ? '#3B82F6' : 'transparent',
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {rememberMe && (
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
              <Text style={{ color: '#6B7280', fontSize: 14 }}>
                Remember for 30 days
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={{ color: '#3B82F6', fontSize: 14, fontWeight: '500' }}>
                Forgot password
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={handleSignIn}
            style={{
              width: '100%',
              backgroundColor: (isFormValid() && !loading) ? '#3B82F6' : '#93C5FD',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 32,
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600'
              }}>
                Log In
              </Text>
            )}
          </TouchableOpacity>

          {/* GOOGLE AUTH COMMENTED OUT - Uncomment when ready to re-enable
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
            <Text style={{ marginHorizontal: 16, color: '#9CA3AF', fontSize: 13 }}>
              Or log in with
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
            <TouchableOpacity
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={onGooglePress}
            >
              <GoogleIcon size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                backgroundColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => Alert.alert('Apple Sign In', 'Apple sign in coming soon')}
            >
              <AppleIcon size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          */}

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>
              {"Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={onSignUp}>
              <Text style={{ color: '#3B82F6', fontSize: 14, fontWeight: '600' }}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;
