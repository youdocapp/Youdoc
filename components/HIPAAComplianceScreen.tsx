import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Shield, Lock, Eye, FileCheck, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface HIPAAComplianceScreenProps {
  onBack: () => void;
}

const HIPAAComplianceScreen: React.FC<HIPAAComplianceScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: colors.background,
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
    heroCard: {
      backgroundColor: '#D1FAE5',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      alignItems: 'center' as const
    },
    heroIcon: {
      marginBottom: 12
    },
    heroTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#10B981',
      marginBottom: 8,
      textAlign: 'center' as const
    },
    heroText: {
      fontSize: 14,
      color: '#059669',
      textAlign: 'center' as const,
      lineHeight: 20
    },
    featureCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const
    },
    featureIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 12
    },
    featureContent: {
      flex: 1
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 4
    },
    featureText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20
    },
    section: {
      marginTop: 24,
      marginBottom: 24
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 12
    },
    sectionText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 24
    },
    bulletPoint: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 24,
      marginLeft: 16,
      marginBottom: 8
    },
    warningCard: {
      backgroundColor: '#FEF3C7',
      borderRadius: 12,
      padding: 16,
      marginTop: 24,
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const
    },
    warningIcon: {
      marginRight: 12,
      marginTop: 2
    },
    warningText: {
      flex: 1,
      fontSize: 14,
      color: '#92400E',
      lineHeight: 20
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>HIPAA Compliance</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.heroCard}>
            <Shield size={48} color="#10B981" style={styles.heroIcon} />
            <Text style={styles.heroTitle}>HIPAA Compliant Platform</Text>
            <Text style={styles.heroText}>
              Your health information is protected in accordance with the Health Insurance Portability and Accountability Act (HIPAA)
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#EEF2FF' }]}>
              <Lock size={20} color="#4F7FFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>End-to-End Encryption</Text>
              <Text style={styles.featureText}>
                All your health data is encrypted both in transit and at rest using industry-standard AES-256 encryption.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#D1FAE5' }]}>
              <Eye size={20} color="#10B981" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Access Controls</Text>
              <Text style={styles.featureText}>
                Strict access controls ensure only authorized personnel can access protected health information.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <FileCheck size={20} color="#F59E0B" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Audit Logs</Text>
              <Text style={styles.featureText}>
                Comprehensive audit trails track all access to your health information for security and compliance.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your HIPAA Rights</Text>
            <Text style={styles.sectionText}>
              Under HIPAA, you have the following rights regarding your Protected Health Information (PHI):
            </Text>
            <Text style={styles.bulletPoint}>• Right to access your health records</Text>
            <Text style={styles.bulletPoint}>• Right to request corrections to your health information</Text>
            <Text style={styles.bulletPoint}>• Right to receive a copy of your privacy notice</Text>
            <Text style={styles.bulletPoint}>• Right to request restrictions on certain uses of your information</Text>
            <Text style={styles.bulletPoint}>• Right to request confidential communications</Text>
            <Text style={styles.bulletPoint}>• Right to file a complaint if you believe your rights have been violated</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How We Protect Your Data</Text>
            <Text style={styles.sectionText}>
              YouDoc implements multiple layers of security to protect your health information:
            </Text>
            <Text style={styles.bulletPoint}>• Secure data centers with 24/7 monitoring</Text>
            <Text style={styles.bulletPoint}>• Regular security audits and penetration testing</Text>
            <Text style={styles.bulletPoint}>• Employee training on HIPAA compliance</Text>
            <Text style={styles.bulletPoint}>• Business Associate Agreements with all third-party vendors</Text>
            <Text style={styles.bulletPoint}>• Incident response procedures for potential breaches</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Breach Notification</Text>
            <Text style={styles.sectionText}>
              In the unlikely event of a breach of your protected health information, we will notify you within 60 days as required by HIPAA regulations.
            </Text>
          </View>

          <View style={styles.warningCard}>
            <AlertCircle size={20} color="#92400E" style={styles.warningIcon} />
            <Text style={styles.warningText}>
              If you believe your HIPAA rights have been violated, you may file a complaint with us at compliance@youdoc.com or with the U.S. Department of Health and Human Services.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HIPAAComplianceScreen;
