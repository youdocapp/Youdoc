import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { ChevronLeft, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

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

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: colors.card,
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
      color: colors.text
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 24
    },
    infoCard: {
      backgroundColor: colors.primaryLight,
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
      color: colors.primary,
      lineHeight: 20
    },
    inputGroup: {
      marginBottom: 20
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8
    },
    inputContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      height: 52
    },
    inputIcon: {
      marginRight: 12
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text
    },
    eyeButton: {
      padding: 4
    },
    requirementsCard: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border
    },
    requirementsTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 12
    },
    requirement: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 8
    },
    requirementText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 8
    },
    requirementMet: {
      color: '#10B981'
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 52,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginTop: 8
    },
    saveButtonDisabled: {
      backgroundColor: colors.border
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#FFFFFF'
    },
    saveButtonTextDisabled: {
      color: colors.textSecondary
    }
  });

  const isFormValid = currentPassword && newPassword && confirmPassword && 
                      validatePassword(newPassword) && newPassword === confirmPassword;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Lock size={20} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Choose a strong password to keep your account secure. We recommend using a mix of letters, numbers, and symbols.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                placeholderTextColor={colors.textSecondary}
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
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor={colors.textSecondary}
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
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor={colors.textSecondary}
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
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Password Requirements</Text>
            <View style={styles.requirement}>
              <CheckCircle 
                size={16} 
                color={newPassword.length >= 8 ? '#10B981' : colors.textSecondary} 
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
                color={newPassword === confirmPassword && newPassword ? '#10B981' : colors.textSecondary} 
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
