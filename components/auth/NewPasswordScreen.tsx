import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';

interface NewPasswordScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

const NewPasswordScreen: React.FC<NewPasswordScreenProps> = ({ onSuccess, onBack }) => {
  const { colors } = useAuthTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRequirements = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const getPasswordStrength = () => {
    const validRequirements = Object.values(passwordRequirements).filter(Boolean).length;
    if (validRequirements === 0) return { width: '0%', color: '#d1d5db' };
    if (validRequirements === 1) return { width: '33%', color: '#ef4444' };
    if (validRequirements === 2) return { width: '67%', color: '#eab308' };
    return { width: '100%', color: '#22c55e' };
  };

  const isFormValid = () => {
    return password && 
           confirmPassword &&
           password === confirmPassword &&
           Object.values(passwordRequirements).every(Boolean);
  };

  const handleResetPassword = async () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Form', 'Please ensure passwords match and meet all requirements.');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password reset successfully');
      Alert.alert(
        'Success!',
        'Your password has been reset successfully.',
        [{ text: 'OK', onPress: onSuccess }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 48, paddingBottom: 32 }}>
            <TouchableOpacity onPress={onBack}>
              <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, fontFamily: 'ReadexPro-Medium', marginBottom: 8 }}>
            Create New Password
          </Text>
          <Text style={{ fontSize: 16, color: colors.textSecondary, fontFamily: 'ReadexPro-Medium', marginBottom: 32 }}>
            Your new password must be different from previously used passwords.
          </Text>

          <View style={{ position: 'relative', marginBottom: 16 }}>
            <TextInput
              placeholder="New Password"
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

          <View style={{ position: 'relative', marginBottom: 16 }}>
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
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
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: [{ translateY: -12 }]
              }}
            >
              <Text style={{ fontSize: 20, color: colors.textSecondary }}>
                {confirmPasswordVisible ? '👁️' : '👁️‍🗨️'}
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

          <TouchableOpacity 
            onPress={handleResetPassword}
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
                Reset Password
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewPasswordScreen;
