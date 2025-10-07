import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronLeft, User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react-native';

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
  const { signUp } = useAuth();
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
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const passwordRequirements = {
    minLength: formData.password.length >= 8
  };

  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName &&
           formData.email && 
           formData.mobile &&
           formData.password && 
           formData.password.length >= 8 &&
           formData.repeatPassword &&
           formData.password === formData.repeatPassword &&
           agreeToTerms;
  };

  const handleCreateAccount = async () => {
    if (!isFormValid()) {
      if (formData.password !== formData.repeatPassword) {
        Alert.alert('Password Mismatch', 'Passwords do not match.');
        return;
      }
      Alert.alert('Invalid Form', 'Please fill in all fields correctly.');
      return;
    }

    setLoading(true);
    try {
      console.log('🚀 Starting signup process for:', formData.email);
      
      const { error } = await signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          mobile: formData.mobile,
        }
      );

      if (error) {
        if (error.message.includes('already registered')) {
          Alert.alert('Account Exists', 'This email is already registered. Please sign in instead.');
        } else {
          Alert.alert('Signup Error', error.message || 'Failed to create account. Please try again.');
        }
        return;
      }

      console.log('✅ Signup completed, proceeding to verification');
      Alert.alert(
        'Verify Your Email',
        'We\'ve sent a verification code to your email. Please check your inbox.',
        [{ text: 'OK', onPress: () => onNext(formData) }]
      );
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
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
              Create an account
            </Text>
            <Text style={{ fontSize: 28, marginLeft: 8 }}>✨</Text>
          </View>
          <Text style={{ fontSize: 15, color: '#9CA3AF', marginBottom: 32 }}>
            Welcome! Please enter your details.
          </Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            First Name
          </Text>
          <View style={{ position: 'relative', marginBottom: 20 }}>
            <User size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
            <TextInput
              placeholder="Enter your first name"
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
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
            Last Name
          </Text>
          <View style={{ position: 'relative', marginBottom: 20 }}>
            <User size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
            <TextInput
              placeholder="Enter your last name"
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
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
            Email
          </Text>
          <View style={{ position: 'relative', marginBottom: 20 }}>
            <Mail size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
            <TextInput
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
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
            Mobile Number
          </Text>
          <View style={{ position: 'relative', marginBottom: 20 }}>
            <Phone size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
            <TextInput
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChangeText={(value) => handleInputChange('mobile', value)}
              keyboardType="phone-pad"
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
          <View style={{ position: 'relative', marginBottom: 20 }}>
            <Lock size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
            <TextInput
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
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

          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Repeat Password
          </Text>
          <View style={{ position: 'relative', marginBottom: 16 }}>
            <Lock size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
            <TextInput
              placeholder="••••••••"
              value={formData.repeatPassword}
              onChangeText={(value) => handleInputChange('repeatPassword', value)}
              secureTextEntry={!repeatPasswordVisible}
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
              onPress={() => setRepeatPasswordVisible(!repeatPasswordVisible)}
              style={{
                position: 'absolute',
                right: 16,
                top: 16,
                zIndex: 1
              }}
            >
              {repeatPasswordVisible ? (
                <Eye size={20} color="#9CA3AF" />
              ) : (
                <EyeOff size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => setAgreeToTerms(!agreeToTerms)}
            style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 32 }}
          >
            <View style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: agreeToTerms ? '#3B82F6' : '#D1D5DB',
              backgroundColor: agreeToTerms ? '#3B82F6' : 'transparent',
              marginRight: 8,
              marginTop: 2,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {agreeToTerms && (
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
              )}
            </View>
            <Text style={{ color: '#6B7280', fontSize: 14, flex: 1 }}>
              Must be at least 8 characters
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleCreateAccount}
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
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
            <Text style={{ marginHorizontal: 16, color: '#9CA3AF', fontSize: 13 }}>
              Or sign up with
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
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={onBack}>
              <Text style={{ color: '#3B82F6', fontSize: 14, fontWeight: '600' }}>
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
