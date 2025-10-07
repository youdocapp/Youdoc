import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';
import { useMockAuth } from '../../contexts/MockAuthContext';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';

interface SignInScreenProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
  onBack: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onForgotPassword, onSignUp, onBack }) => {
  const { colors } = useAuthTheme();
  const { signIn } = useMockAuth();
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
      await signIn(email, password);
      Alert.alert(
        'Success!',
        'You have been signed in successfully.',
        [{ text: 'OK', onPress: () => router.push('/dashboard') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
          <TouchableOpacity onPress={onBack} style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 24, color: '#000000' }}>←</Text>
          </TouchableOpacity>
          
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#000000', marginBottom: 8, textAlign: 'center' }}>
            Welcome back
          </Text>
          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 40, textAlign: 'center' }}>
            Continue your health journey
          </Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000', marginBottom: 8 }}>
            Email
          </Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              width: '100%',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderWidth: 0,
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
              color: '#000000',
              marginBottom: 20,
              fontSize: 16
            }}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000000', marginBottom: 8 }}>
            Password
          </Text>
          <View style={{ position: 'relative', marginBottom: 16 }}>
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              style={{
                width: '100%',
                paddingHorizontal: 20,
                paddingVertical: 16,
                paddingRight: 48,
                borderWidth: 0,
                borderRadius: 12,
                backgroundColor: '#F3F4F6',
                color: '#000000',
                fontSize: 16
              }}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: [{ translateY: -12 }]
              }}
            >
              {passwordVisible ? (
                <Eye size={20} color="#6B7280" />
              ) : (
                <EyeOff size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <TouchableOpacity 
              onPress={() => setRememberMe(!rememberMe)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: rememberMe ? '#3B82F6' : '#D1D5DB',
                backgroundColor: rememberMe ? '#3B82F6' : 'transparent',
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {rememberMe && (
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
              <Text style={{ color: '#6B7280', fontSize: 14 }}>
                Remember me
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={{ color: '#3B82F6', fontSize: 14, fontWeight: '500' }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={handleSignIn}
            style={{
              width: '100%',
              backgroundColor: (isFormValid() && !loading) ? '#B8C5D6' : '#D1D5DB',
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
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
            <Text style={{ marginHorizontal: 16, color: '#6B7280', fontSize: 14 }}>
              Or continue with
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
          </View>

          <TouchableOpacity
            style={{
              width: '100%',
              paddingVertical: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#3B82F6',
              alignItems: 'center',
              marginBottom: 12,
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 8 }}>G</Text>
            <Text style={{ color: '#3B82F6', fontSize: 16, fontWeight: '500' }}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: '100%',
              paddingVertical: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#3B82F6',
              alignItems: 'center',
              marginBottom: 32,
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 8 }}></Text>
            <Text style={{ color: '#3B82F6', fontSize: 16, fontWeight: '500' }}>
              Continue with Apple
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>
              Don't have an account?{' '}
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
