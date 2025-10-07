import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { ChevronLeft, ChevronRight, User, Lock, Fingerprint, Bell, Mail, Activity, Clock, Sun, Smartphone, DollarSign, HelpCircle, Info, LogOut, Trash2 } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsScreenProps {
  onBack: () => void;
  onProfile?: () => void;
  onPrivacy?: () => void;
  onHelp?: () => void;
  onAbout?: () => void;
  onSubscription?: () => void;
  onConnectedDevices?: () => void;
  onSignOut?: () => void;
  onDeleteAccount?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onProfile,
  onPrivacy,
  onHelp,
  onAbout,
  onSubscription,
  onConnectedDevices,
  onSignOut,
  onDeleteAccount
}) => {
  const { isDark, toggleTheme, colors } = useTheme();
  const [biometricAuth, setBiometricAuth] = useState<boolean>(false);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [medicationReminders, setMedicationReminders] = useState<boolean>(true);
  const [appointmentReminders, setAppointmentReminders] = useState<boolean>(true);
  const [dataSharing, setDataSharing] = useState<boolean>(false);

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
      backgroundColor: colors.background,
      position: 'relative' as const,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
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
    section: {
      marginTop: 24,
      paddingHorizontal: 20
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: colors.textSecondary,
      marginBottom: 12,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5
    },
    card: {
      backgroundColor: colors.background,
      borderRadius: 16,
      overflow: 'hidden' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border
    },
    menuItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
    },
    menuItemLast: {
      borderBottomWidth: 0
    },
    menuItemLeft: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      flex: 1
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 12
    },
    menuItemContent: {
      flex: 1
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: '500' as const,
      color: colors.text,
      marginBottom: 2
    },
    menuItemSubtext: {
      fontSize: 13,
      color: colors.textSecondary
    },
    menuItemRight: {
      marginLeft: 12
    },
    signOutText: {
      color: colors.error
    },
    deleteText: {
      color: colors.error
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} onPress={onProfile}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
                  <User size={20} color="#4F7FFF" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Profile</Text>
                  <Text style={styles.menuItemSubtext}>Manage your personal information</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onPrivacy}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <Lock size={20} color="#10B981" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Privacy & Security</Text>
                  <Text style={styles.menuItemSubtext}>Control your data and security settings</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>

            <View style={[styles.menuItem, styles.menuItemLast]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <Fingerprint size={20} color="#A855F7" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Biometric Authentication</Text>
                  <Text style={styles.menuItemSubtext}>Use fingerprint or face ID to unlock</Text>
                </View>
              </View>
              <Switch
                value={biometricAuth}
                onValueChange={setBiometricAuth}
                trackColor={{ false: '#E5E7EB', true: '#4F7FFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.card}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <Bell size={20} color="#F59E0B" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Push Notifications</Text>
                  <Text style={styles.menuItemSubtext}>Receive notifications on your device</Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#E5E7EB', true: '#4F7FFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <Mail size={20} color="#EF4444" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Email Notifications</Text>
                  <Text style={styles.menuItemSubtext}>Get updates via email</Text>
                </View>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#E5E7EB', true: '#4F7FFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <Activity size={20} color="#3B82F6" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Medication Reminders</Text>
                  <Text style={styles.menuItemSubtext}>Never miss your medications</Text>
                </View>
              </View>
              <Switch
                value={medicationReminders}
                onValueChange={setMedicationReminders}
                trackColor={{ false: '#E5E7EB', true: '#4F7FFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.menuItem, styles.menuItemLast]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <Clock size={20} color="#10B981" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Appointment Reminders</Text>
                  <Text style={styles.menuItemSubtext}>Get notified about upcoming appointments</Text>
                </View>
              </View>
              <Switch
                value={appointmentReminders}
                onValueChange={setAppointmentReminders}
                trackColor={{ false: '#E5E7EB', true: '#4F7FFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP PREFERENCES</Text>
          <View style={styles.card}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
                  <Sun size={20} color="#4F7FFF" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Dark Mode</Text>
                  <Text style={styles.menuItemSubtext}>Switch to dark theme</Text>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#E5E7EB', true: '#4F7FFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <Smartphone size={20} color="#F59E0B" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Data Sharing</Text>
                  <Text style={styles.menuItemSubtext}>Share anonymized data for research</Text>
                </View>
              </View>
              <Switch
                value={dataSharing}
                onValueChange={setDataSharing}
                trackColor={{ false: '#E5E7EB', true: '#4F7FFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={onConnectedDevices}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <Smartphone size={20} color="#10B981" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Connected Devices</Text>
                  <Text style={styles.menuItemSubtext}>Manage your connected health devices</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
          <View style={styles.card}>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={onSubscription}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <DollarSign size={20} color="#F59E0B" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Manage Subscription</Text>
                  <Text style={styles.menuItemSubtext}>View and manage your YouDoc Pro subscription</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} onPress={onHelp}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <HelpCircle size={20} color="#3B82F6" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Help & Support</Text>
                  <Text style={styles.menuItemSubtext}>Get help and contact support</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={onAbout}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <Info size={20} color="#A855F7" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>About YouDoc</Text>
                  <Text style={styles.menuItemSubtext}>Version 1.0.0</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} onPress={onSignOut}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <LogOut size={20} color="#EF4444" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, styles.signOutText]}>Sign Out</Text>
                  <Text style={styles.menuItemSubtext}>Sign out of your account</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={onDeleteAccount}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <Trash2 size={20} color="#EF4444" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, styles.deleteText]}>Delete Account</Text>
                  <Text style={styles.menuItemSubtext}>Permanently delete your account</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
