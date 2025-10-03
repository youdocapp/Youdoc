import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';
import { useMockAuth } from '../../contexts/MockAuthContext';

interface SignUpScreenProps {
  onNext: (formData: any) => void;
  onBack: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  repeatPassword: string;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNext, onBack }) => {
  const { colors } = useAuthTheme();
  const { signUp } = useMockAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    repeatPassword: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const getPasswordStrength = () => {
    const validRequirements = Object.values(passwordRequirements).filter(Boolean).length;
    if (validRequirements === 0) return { width: '0%', color: '#d1d5db' };
    if (validRequirements === 1) return { width: '33%', color: '#ef4444' };
    if (validRequirements === 2) return { width: '67%', color: '#eab308' };
    return { width: '100%', color: '#22c55e' };
  };

  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.mobile && 
           formData.password && 
           formData.repeatPassword &&
           formData.password === formData.repeatPassword &&
           Object.values(passwordRequirements).every(Boolean);
  };

  const handleCreateAccount = async () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Form', 'Please fill in all fields correctly.');
      return;
    }

    setLoading(true);
    try {
      console.log('🚀 Starting signup process with OTP for:', formData.email);
      
      await signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
        }
      );

      console.log('✅ Mock signup completed, proceeding to verification');
      Alert.alert(
        'Account Created!',
        'Your account has been created successfully.',
        [{ text: 'OK', onPress: () => onNext(formData) }]
      );
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}>
          <TouchableOpacity onPress={onBack}>
            <Text style={{ fontSize: 24, color: '#000000' }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#000000', flex: 1, textAlign: 'center', marginRight: 24 }}>Great, let's get started</Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <TextInput
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
            style={{
              width: '100%',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderWidth: 0,
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
              color: '#000000',
              marginBottom: 12,
              fontSize: 16
            }}
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
            style={{
              width: '100%',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderWidth: 0,
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
              color: '#000000',
              marginBottom: 12,
              fontSize: 16
            }}
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            placeholder="Email Address Required"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
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
              marginBottom: 12,
              fontSize: 16
            }}
            placeholderTextColor="#9CA3AF"
          />

          <TextInput
            placeholder="Mobile Number"
            value={formData.mobile}
            onChangeText={(value) => handleInputChange('mobile', value)}
            keyboardType="phone-pad"
            style={{
              width: '100%',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderWidth: 0,
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
              color: '#000000',
              marginBottom: 12,
              fontSize: 16
            }}
            placeholderTextColor="#9CA3AF"
          />

          <View style={{ position: 'relative', marginBottom: 12 }}>
            <TextInput
              placeholder="Enter password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
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
              <Text style={{ fontSize: 20, color: '#6B7280' }}>
                {passwordVisible ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ position: 'relative', marginBottom: 20 }}>
            <TextInput
              placeholder="Repeat password"
              value={formData.repeatPassword}
              onChangeText={(value) => handleInputChange('repeatPassword', value)}
              secureTextEntry={!repeatPasswordVisible}
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
              onPress={() => setRepeatPasswordVisible(!repeatPasswordVisible)}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: [{ translateY: -12 }]
              }}
            >
              <Text style={{ fontSize: 20, color: '#6B7280' }}>
                {repeatPasswordVisible ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 16 }}>
            <View style={{ width: '100%', height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
              <View 
                style={{
                  height: 4,
                  backgroundColor: passwordStrength.color,
                  borderRadius: 2,
                  width: passwordStrength.width,
                }}
              />
            </View>
          </View>

          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: passwordRequirements.minLength ? '#22c55e' : '#D1D5DB',
                backgroundColor: passwordRequirements.minLength ? 'transparent' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                {passwordRequirements.minLength && (
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e' }} />
                )}
              </View>
              <Text style={{
                fontSize: 14,
                color: '#6B7280'
              }}>
                8 characters minimum
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: passwordRequirements.hasNumber ? '#22c55e' : '#D1D5DB',
                backgroundColor: passwordRequirements.hasNumber ? 'transparent' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                {passwordRequirements.hasNumber && (
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e' }} />
                )}
              </View>
              <Text style={{
                fontSize: 14,
                color: '#6B7280'
              }}>
                a number
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: passwordRequirements.hasSymbol ? '#22c55e' : '#D1D5DB',
                backgroundColor: passwordRequirements.hasSymbol ? 'transparent' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                {passwordRequirements.hasSymbol && (
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e' }} />
                )}
              </View>
              <Text style={{
                fontSize: 14,
                color: '#6B7280'
              }}>
                a symbol
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={{ padding: 24 }}>
        <TouchableOpacity 
          onPress={handleCreateAccount}
          style={{
            width: '100%',
            backgroundColor: (isFormValid() && !loading) ? '#B8C5D6' : '#D1D5DB',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
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
              Create an account
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
