import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileScreenProps {
  onBack: () => void;
  onEditProfile?: () => void;
  onHealthRecords?: () => void;
  onMedicalHistory?: () => void;
  onEmergencyContacts?: () => void;
  onSettings?: () => void;
  onHome?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onEditProfile,
  onHealthRecords,
  onMedicalHistory,
  onEmergencyContacts,
  onSettings
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 24
    },
    backButton: {
      fontSize: 24,
      color: colors.text
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: colors.text,
      marginLeft: 16
    },
    profileSection: {
      alignItems: 'center' as const,
      paddingVertical: 32,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 16
    },
    avatarText: {
      fontSize: 32,
      color: 'white',
      fontWeight: 'bold' as const
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: colors.text,
      marginBottom: 4
    },
    email: {
      fontSize: 14,
      color: colors.textSecondary
    },
    menuItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
    },
    menuItemText: {
      fontSize: 16,
      color: colors.text
    },
    arrow: {
      fontSize: 18,
      color: colors.textSecondary
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={onEditProfile}>
          <Text style={styles.menuItemText}>Edit Profile</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={onHealthRecords}>
          <Text style={styles.menuItemText}>Health Records</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={onMedicalHistory}>
          <Text style={styles.menuItemText}>Medical History</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={onEmergencyContacts}>
          <Text style={styles.menuItemText}>Emergency Contacts</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={onSettings}>
          <Text style={styles.menuItemText}>Settings</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
