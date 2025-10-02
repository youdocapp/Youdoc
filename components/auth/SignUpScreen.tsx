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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32 }}>
          <TouchableOpacity onPress={onBack}>
            <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, fontFamily: 'ReadexPro-Medium' }}>Great, let's get started</Text>
          <View></View>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <TextInput
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
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

          <TextInput
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
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

          <TextInput
            placeholder="Email Address Required"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
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

          <TextInput
            placeholder="Mobile Number"
            value={formData.mobile}
            onChangeText={(value) => handleInputChange('mobile', value)}
            keyboardType="phone-pad"
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
              placeholder="Enter password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
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

          <View style={{ position: 'relative', marginBottom: 16 }}>
            <TextInput
              placeholder="Repeat password"
              value={formData.repeatPassword}
              onChangeText={(value) => handleInputChange('repeatPassword', value)}
              secureTextEntry={!repeatPasswordVisible}
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
              onPress={() => setRepeatPasswordVisible(!repeatPasswordVisible)}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: [{ translateY: -12 }]
              }}
            >
              <Text style={{ fontSize: 20, color: colors.textSecondary }}>
                {repeatPasswordVisible ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 16, marginBottom: 16 }}>
            <View style={{ width: '100%', height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
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

          <View style={{ marginTop: 16, marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: passwordRequirements.minLength ? '#22c55e' : colors.border,
                backgroundColor: passwordRequirements.minLength ? '#22c55e' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8
              }}>
                {passwordRequirements.minLength && (
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
              <Text style={{
                fontSize: 14,
                color: passwordRequirements.minLength ? '#16a34a' : colors.textSecondary
              }}>
                8 characters minimum
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: passwordRequirements.hasNumber ? '#22c55e' : colors.border,
                backgroundColor: passwordRequirements.hasNumber ? '#22c55e' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8
              }}>
                {passwordRequirements.hasNumber && (
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
              <Text style={{
                fontSize: 14,
                color: passwordRequirements.hasNumber ? '#16a34a' : colors.textSecondary
              }}>
                a number
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: passwordRequirements.hasSymbol ? '#22c55e' : colors.border,
                backgroundColor: passwordRequirements.hasSymbol ? '#22c55e' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8
              }}>
                {passwordRequirements.hasSymbol && (
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
              <Text style={{
                fontSize: 14,
                color: passwordRequirements.hasSymbol ? '#16a34a' : colors.textSecondary
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
            backgroundColor: (isFormValid() && !loading) ? colors.primary : colors.border,
            paddingVertical: 16,
            borderRadius: 25,
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
              fontWeight: '500'
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
