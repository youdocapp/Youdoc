import React from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import SettingsScreen from '../components/SettingsScreen';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsRoute() {
  const { signOut, deleteAccount } = useAuth();

  const handleBack = () => {
    router.replace('/dashboard');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handlePrivacy = () => {
    router.push('/privacy');
  };

  const handleHelp = () => {
    router.push('/health-support');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const handleSubscription = () => {
    router.push('/subscription');
  };

  const handleConnectedDevices = () => {
    router.push('/connected-devices');
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚀 Signing out user...');
              await signOut();
              console.log('✅ User signed out successfully');
              router.replace('/');
            } catch (error) {
              console.error('❌ Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'This is your final warning. Your account and all associated data will be permanently deleted. Do you want to proceed?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      console.log('🚀 Deleting account...');
                      const { error } = await deleteAccount();
                      
                      if (error) {
                        console.error('❌ Delete account error:', error);
                        Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
                        return;
                      }
                      
                      console.log('✅ Account deleted successfully');
                      Alert.alert(
                        'Account Deleted',
                        'Your account has been permanently deleted.',
                        [{ text: 'OK', onPress: () => router.replace('/') }]
                      );
                    } catch (error) {
                      console.error('❌ Unexpected delete account error:', error);
                      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <SettingsScreen
      onBack={handleBack}
      onProfile={handleProfile}
      onPrivacy={handlePrivacy}
      onHelp={handleHelp}
      onAbout={handleAbout}
      onSubscription={handleSubscription}
      onConnectedDevices={handleConnectedDevices}
      onSignOut={handleSignOut}
      onDeleteAccount={handleDeleteAccount}
    />
  );
}
