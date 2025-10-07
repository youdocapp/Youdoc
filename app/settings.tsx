import React from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import SettingsScreen from '../components/SettingsScreen';
import { useUser } from '../contexts/UserContext';

export default function SettingsRoute() {
  const { logout } = useUser();

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

  const handleSignOut = () => {
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
          onPress: () => {
            console.log('User signed out');
            logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
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
                  onPress: () => {
                    console.log('Account deleted');
                    logout();
                    router.replace('/');
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
