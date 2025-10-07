import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { ChevronLeft, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react-native';

interface ChangePasswordScreenProps {
  onBack: () => void;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ onBack }) => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Your password has been changed successfully', [
        { text: 'OK', onPress: onBack }
      ]);
    }, 1500);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB'
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: '#FFFFFF',
      position: 'relative' as const
    },
    backButton: {
      position: 'absolute' as const,
      left: 20,
      padding: 8
    },
    title: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: '#1F2937'
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 24
    },
    infoCard: {
      backgroundColor: '#EEF2FF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const
    },
    infoIcon: {
      marginRight: 12,
      marginTop: 2
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: '#4F7FFF',
      lineHeight: 20
    },
    inputGroup: {
      marginBottom: 20
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: '#1F2937',
      marginBottom: 8
    },
    inputContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 16,
      height: 52
    },
    inputIcon: {
      marginRight: 12
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#1F2937'
    },
    eyeButton: {
      padding: 4
    },
    requirementsCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24
    },
    requirementsTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: '#1F2937',
      marginBottom: 12
    },
    requirement: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 8
    },
    requirementText: {
      fontSize: 14,
      color: '#6B7280',
      marginLeft: 8
    },
    requirementMet: {
      color: '#10B981'
    },
    saveButton: {
      backgroundColor: '#4F7FFF',
      borderRadius: 12,
      height: 52,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginTop: 8
    },
    saveButtonDisabled: {
      backgroundColor: '#E5E7EB'
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#FFFFFF'
    },
    saveButtonTextDisabled: {
      color: '#9CA3AF'
    }
  });

  const isFormValid = currentPassword && newPassword && confirmPassword && 
                      validatePassword(newPassword) && newPassword === confirmPassword;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Lock size={20} color="#4F7FFF" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Choose a strong password to keep your account secure. We recommend using a mix of letters, numbers, and symbols.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Password Requirements</Text>
            <View style={styles.requirement}>
              <CheckCircle 
                size={16} 
                color={newPassword.length >= 8 ? '#10B981' : '#9CA3AF'} 
              />
              <Text style={[
                styles.requirementText,
                newPassword.length >= 8 && styles.requirementMet
              ]}>
                At least 8 characters
              </Text>
            </View>
            <View style={styles.requirement}>
              <CheckCircle 
                size={16} 
                color={newPassword === confirmPassword && newPassword ? '#10B981' : '#9CA3AF'} 
              />
              <Text style={[
                styles.requirementText,
                newPassword === confirmPassword && newPassword && styles.requirementMet
              ]}>
                Passwords match
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, (!isFormValid || isLoading) && styles.saveButtonDisabled]}
            onPress={handleChangePassword}
            disabled={!isFormValid || isLoading}
          >
            <Text style={[
              styles.saveButtonText,
              (!isFormValid || isLoading) && styles.saveButtonTextDisabled
            ]}>
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
