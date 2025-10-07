import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useMockAuth } from '../../contexts/MockAuthContext';
import { ArrowLeft, Eye, EyeOff, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SignUpScreenProps {
  onNext: (formData: any) => void;
  onBack: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  password: string;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNext, onBack }) => {

  const { signUp } = useMockAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    birthDate: '',
    phoneNumber: '',
    password: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return formData.fullName && 
           formData.email && 
           formData.birthDate && 
           formData.phoneNumber && 
           formData.password;
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
          full_name: formData.fullName,
          birth_date: formData.birthDate,
          phone_number: formData.phoneNumber,
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

  return (
    <LinearGradient
      colors={['#2563EB', '#06B6D4']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <ArrowLeft size={24} color="#000000" />
            </TouchableOpacity>

            <Text style={styles.title}>Sign up</Text>
            
            <View style={styles.loginPrompt}>
              <Text style={styles.promptText}>Already have an account? </Text>
              <TouchableOpacity onPress={onBack}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                placeholder="Lois Becket"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Loisbecket@gmail.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.label}>Birth of date</Text>
              <View style={styles.dateContainer}>
                <TextInput
                  placeholder="18/03/2024"
                  value={formData.birthDate}
                  onChangeText={(value) => handleInputChange('birthDate', value)}
                  style={styles.dateInput}
                  placeholderTextColor="#9CA3AF"
                />
                <Calendar size={20} color="#9CA3AF" style={styles.calendarIcon} />
              </View>

              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.flag}>🇨🇭</Text>
                  <Text style={styles.arrow}>▼</Text>
                </View>
                <TextInput
                  placeholder="(454) 726-0592"
                  value={formData.phoneNumber}
                  onChangeText={(value) => handleInputChange('phoneNumber', value)}
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <Text style={styles.label}>Set Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!passwordVisible}
                  style={styles.passwordInput}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIcon}
                >
                  {passwordVisible ? (
                    <Eye size={20} color="#9CA3AF" />
                  ) : (
                    <EyeOff size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                onPress={handleCreateAccount}
                style={[
                  styles.registerButton,
                  (!isFormValid() || loading) && styles.registerButtonDisabled
                ]}
                disabled={!isFormValid() || loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.registerButtonText}>Register</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  promptText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    marginBottom: 20,
    fontSize: 15,
  },
  dateContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  dateInput: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontSize: 15,
  },
  calendarIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  flag: {
    fontSize: 20,
    marginRight: 4,
  },
  arrow: {
    fontSize: 10,
    color: '#6B7280',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontSize: 15,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  passwordInput: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontSize: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: '#93C5FD',
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUpScreen;
