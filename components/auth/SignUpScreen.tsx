import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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
  const { register, user } = useAuth();
  const router = useRouter();
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

  useEffect(() => {
    if (user) {
      console.log('✅ User authenticated, navigating to dashboard');
      router.replace('/dashboard');
    }
  }, [user]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const passwordsMatch = formData.password && formData.repeatPassword && formData.password === formData.repeatPassword;

  const isFormValid = () => {
    return (
      formData.firstName.trim().length > 0 &&
      formData.lastName.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      formData.password.trim().length >= 8 &&
      formData.password === formData.repeatPassword
    );
  };

  const handleCreateAccount = async () => {
    console.log('🔘 Sign up button pressed');
    console.log('📋 Form valid:', isFormValid());
    console.log('📋 Form data:', { ...formData, password: '***', repeatPassword: '***' });
    
    // Validate form fields
    if (!formData.firstName.trim()) {
      Alert.alert('Missing Information', 'Please enter your first name.');
      return;
    }
    
    if (!formData.lastName.trim()) {
      Alert.alert('Missing Information', 'Please enter your last name.');
      return;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Missing Information', 'Please enter your email address.');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    
    if (formData.password.length < 8) {
      Alert.alert('Password Too Short', 'Password must be at least 8 characters long.');
      return;
    }
    
    if (formData.password !== formData.repeatPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    try {
      console.log('🚀 Starting signup process for:', formData.email);
      
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.repeatPassword,
        mobile: formData.mobile || undefined,
      });

      if (!result.success) {
        console.error('❌ Signup failed with error:', result.error || result.message);
        console.error('❌ Signup error details:', result.details || 'No details');
        console.error('❌ Full result:', result);
        
        const errorMessage = result.error || result.message || 'Failed to create account. Please try again.';
        const errorDetails = result.details || {};
        
        // Helper function to get user-friendly field names
        const getFieldName = (field: string): string => {
          const fieldMap: Record<string, string> = {
            'email': 'Email',
            'first_name': 'First Name',
            'last_name': 'Last Name',
            'password': 'Password',
            'password_confirm': 'Confirm Password',
            'mobile': 'Mobile Number',
          };
          return fieldMap[field] || field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        };
        
        // Check for email already exists
        if (errorMessage.toLowerCase().includes('already exists') || 
            errorMessage.toLowerCase().includes('already registered') ||
            (errorDetails.email && Array.isArray(errorDetails.email) && errorDetails.email.some((e: string) => e.toLowerCase().includes('exists')))) {
          Alert.alert(
            'Email Already Exists',
            'This email address is already registered. Please sign in instead or use a different email address.',
            [{ text: 'OK', style: 'default' }]
          );
          return;
        }
        
        // Check for validation errors
        if (errorDetails && Object.keys(errorDetails).length > 0) {
          const validationMessages: string[] = [];
          
          Object.entries(errorDetails).forEach(([field, errors]) => {
            const fieldName = getFieldName(field);
            const errorArray = Array.isArray(errors) ? errors : [errors];
            
            errorArray.forEach((error: string) => {
              // Refine error messages
              let refinedError = error;
              
              if (error.toLowerCase().includes('required')) {
                refinedError = `${fieldName} is required.`;
              } else if (error.toLowerCase().includes('too short')) {
                refinedError = `${fieldName} is too short.`;
              } else if (error.toLowerCase().includes('too common')) {
                refinedError = 'Password is too common. Please choose a stronger password.';
              } else if (error.toLowerCase().includes('invalid')) {
                refinedError = `${fieldName} is invalid.`;
              } else if (error.toLowerCase().includes('does not match')) {
                refinedError = 'Passwords do not match.';
              } else if (error.toLowerCase().includes('already exists')) {
                refinedError = `${fieldName} already exists.`;
              } else {
                refinedError = `${fieldName}: ${error}`;
              }
              
              validationMessages.push(refinedError);
            });
          });
          
          if (validationMessages.length > 0) {
            Alert.alert(
              'Validation Error',
              validationMessages.join('\n\n'),
              [{ text: 'OK', style: 'default' }]
            );
            return;
          }
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
        
        // Check for password errors
        if (errorMessage.toLowerCase().includes('password')) {
          Alert.alert(
            'Password Error',
            'Please check your password. It must be at least 8 characters long and not too common.',
            [{ text: 'OK', style: 'default' }]
          );
          return;
        }
        
        // Generic error with refined message
        let refinedMessage = errorMessage;
        if (errorMessage.toLowerCase().includes('registration failed')) {
          refinedMessage = 'Registration failed. Please check your information and try again.';
        } else if (errorMessage.toLowerCase().includes('server error')) {
          refinedMessage = 'Server error. Please try again in a moment.';
        }
        
        Alert.alert(
          'Sign Up Failed',
          refinedMessage,
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      console.log('✅ Signup completed, proceeding to verification');
      onNext(formData);
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert(
        'Unexpected Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
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
          <Text style={{ fontSize: 15, color: '#6B7280', marginBottom: 32 }}>
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
            Mobile Number (Optional)
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
              placeholder="Enter your password (min. 8 characters)"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              autoComplete="password-new"
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
            Confirm Password
          </Text>
          <View style={{ position: 'relative', marginBottom: 16 }}>
            <Lock size={20} color="#9CA3AF" style={{ position: 'absolute', left: 16, top: 16, zIndex: 1 }} />
            <TextInput
              placeholder="Repeat your password"
              value={formData.repeatPassword}
              onChangeText={(value) => handleInputChange('repeatPassword', value)}
              secureTextEntry={!repeatPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              autoComplete="password-new"
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

          {formData.repeatPassword.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
              <View style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                borderWidth: 2,
                borderColor: passwordsMatch ? '#10B981' : '#EF4444',
                backgroundColor: passwordsMatch ? '#10B981' : '#EF4444',
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                  {passwordsMatch ? '✓' : '✕'}
                </Text>
              </View>
              <Text style={{ color: passwordsMatch ? '#10B981' : '#EF4444', fontSize: 14 }}>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            onPress={handleCreateAccount}
            activeOpacity={0.8}
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
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          {/* GOOGLE AUTH COMMENTED OUT - Uncomment when ready to re-enable
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
              onPress={onGooglePress}
            >
              <Text style={{ fontSize: 24 }}>G</Text>
            </TouchableOpacity>
          </View>
          */}

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
