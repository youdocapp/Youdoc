import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';
import { useMockAuth } from '../../contexts/MockAuthContext';
import { useRouter } from 'expo-router';

interface SignInScreenProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onForgotPassword, onSignUp }) => {
  const { colors } = useAuthTheme();
  const { signIn } = useMockAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, fontFamily: 'ReadexPro-Medium', marginBottom: 8 }}>
            Welcome back
          </Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary, fontFamily: 'ReadexPro-Medium' }}>
            Sign in to continue
          </Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              width: '100%',
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 16,
              backgroundColor: colors.inputBackground,
              color: colors.text,
              marginBottom: 16,
              fontSize: 16,
              fontFamily: 'ReadexPro-Medium'
            }}
            placeholderTextColor={colors.textSecondary}
          />

          <View style={{ position: 'relative', marginBottom: 16 }}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              style={{
                width: '100%',
                paddingHorizontal: 16,
                paddingVertical: 16,
                paddingRight: 48,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 16,
                backgroundColor: colors.inputBackground,
                color: colors.text,
                fontSize: 16,
                fontFamily: 'ReadexPro-Medium'
              }}
              placeholderTextColor={colors.textSecondary}
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
              <Text style={{ fontSize: 20, color: colors.textSecondary }}>
                {passwordVisible ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onForgotPassword} style={{ alignSelf: 'flex-end', marginBottom: 32 }}>
            <Text style={{ color: colors.primary, fontSize: 14, fontFamily: 'ReadexPro-Medium' }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleSignIn}
            style={{
              width: '100%',
              backgroundColor: (isFormValid() && !loading) ? colors.primary : colors.border,
              paddingVertical: 16,
              borderRadius: 25,
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
                fontWeight: '500',
                fontFamily: 'ReadexPro-Medium'
              }}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 14, fontFamily: 'ReadexPro-Medium' }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={onSignUp}>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '600', fontFamily: 'ReadexPro-Medium' }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;
