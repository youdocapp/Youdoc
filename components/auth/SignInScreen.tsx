import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from 'lucide-react-native';

interface SignInScreenProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
  onBack: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onForgotPassword, onSignUp, onBack }) => {
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isFormValid = () => {
    return email.length > 0 && password.length > 0;
  };

  const handleSignIn = async () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Form', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setLoading(false);
        if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          Alert.alert('Email Not Verified', 'Please verify your email before signing in.');
        } else {
          Alert.alert('Login Error', error.message || 'Failed to sign in. Please try again.');
        }
        return;
      }

      console.log('✅ Sign in successful, navigating to dashboard');
      router.replace('/dashboard');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Sign in error:', error);
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
          <Text style={{ fontSize: 15, color: '#9CA3AF', marginBottom: 32 }}>
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
              backgroundColor: (isFormValid() && !loading) ? '#3B82F6' : '#D1D5DB',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 24,
              opacity: loading ? 0.7 : 1
            }}
            disabled={!isFormValid() || loading}
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

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
            <Text style={{ marginHorizontal: 16, color: '#9CA3AF', fontSize: 13 }}>
              Or log in with
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
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
            >
              <Text style={{ fontSize: 24 }}>G</Text>
            </TouchableOpacity>
          </View>

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
