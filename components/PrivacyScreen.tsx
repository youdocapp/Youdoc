import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { ChevronLeft, ChevronRight, Lock, Eye, EyeOff, Shield, FileText, Scale, Key, Download, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface PrivacyScreenProps {
  onBack: () => void;
  onChangePassword?: () => void;
  onPrivacyPolicy?: () => void;
  onTermsOfService?: () => void;
  onHIPAACompliance?: () => void;
  onDownloadData?: () => void;
  onDeleteData?: () => void;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ 
  onBack,
  onChangePassword,
  onPrivacyPolicy,
  onTermsOfService,
  onHIPAACompliance,
  onDownloadData,
  onDeleteData
}) => {
  const { colors } = useTheme();
  const [shareHealthData, setShareHealthData] = useState<boolean>(false);
  const [shareAnalytics, setShareAnalytics] = useState<boolean>(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);

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
    dangerText: {
      color: '#EF4444'
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy & Security</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA PRIVACY</Text>
          <View style={styles.card}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <Eye size={20} color="#3B82F6" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Share Health Data</Text>
                  <Text style={styles.menuItemSubtext}>Share anonymized data for research</Text>
                </View>
              </View>
              <Switch
                value={shareHealthData}
                onValueChange={setShareHealthData}
                trackColor={{ false: colors.border, true: '#4F7FFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.menuItem, styles.menuItemLast]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <EyeOff size={20} color="#A855F7" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Share Analytics</Text>
                  <Text style={styles.menuItemSubtext}>Help us improve the app</Text>
                </View>
              </View>
              <Switch
                value={shareAnalytics}
                onValueChange={setShareAnalytics}
                trackColor={{ false: colors.border, true: '#4F7FFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SECURITY</Text>
          <View style={styles.card}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <Key size={20} color="#10B981" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Two-Factor Authentication</Text>
                  <Text style={styles.menuItemSubtext}>Add an extra layer of security</Text>
                </View>
              </View>
              <Switch
                value={twoFactorAuth}
                onValueChange={setTwoFactorAuth}
                trackColor={{ false: colors.border, true: '#4F7FFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={onChangePassword}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <Lock size={20} color="#F59E0B" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Change Password</Text>
                  <Text style={styles.menuItemSubtext}>Update your account password</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEGAL & COMPLIANCE</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} onPress={onPrivacyPolicy}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
                  <FileText size={20} color="#4F7FFF" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Privacy Policy</Text>
                  <Text style={styles.menuItemSubtext}>How we handle your data</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onTermsOfService}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <Scale size={20} color="#A855F7" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Terms of Service</Text>
                  <Text style={styles.menuItemSubtext}>Our terms and conditions</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={onHIPAACompliance}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <Shield size={20} color="#10B981" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>HIPAA Compliance</Text>
                  <Text style={styles.menuItemSubtext}>Healthcare data protection</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} onPress={onDownloadData}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <Download size={20} color="#3B82F6" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Download My Data</Text>
                  <Text style={styles.menuItemSubtext}>Export all your health data</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={onDeleteData}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <Trash2 size={20} color="#EF4444" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, styles.dangerText]}>Delete All Data</Text>
                  <Text style={styles.menuItemSubtext}>Permanently remove all your data</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyScreen;
