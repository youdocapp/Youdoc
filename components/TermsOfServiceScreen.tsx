import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface TermsOfServiceScreenProps {
  onBack: () => void;
}

const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ onBack }) => {
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
    lastUpdated: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 24
    },
    section: {
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
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Terms of Service</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: January 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
            <Text style={styles.sectionText}>
              By accessing and using YouDoc, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Use of Service</Text>
            <Text style={styles.sectionText}>
              You agree to use the service only for lawful purposes and in accordance with these Terms. You must not:
            </Text>
            <Text style={styles.bulletPoint}>• Use the service in any way that violates applicable laws</Text>
            <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>
            <Text style={styles.bulletPoint}>• Interfere with or disrupt the service</Text>
            <Text style={styles.bulletPoint}>• Share your account credentials with others</Text>
            <Text style={styles.bulletPoint}>• Use the service for any commercial purpose without permission</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical Disclaimer</Text>
            <Text style={styles.sectionText}>
              YouDoc is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Accounts</Text>
            <Text style={styles.sectionText}>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intellectual Property</Text>
            <Text style={styles.sectionText}>
              The service and its original content, features, and functionality are owned by YouDoc and are protected by international copyright, trademark, and other intellectual property laws.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Limitation of Liability</Text>
            <Text style={styles.sectionText}>
              YouDoc shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Termination</Text>
            <Text style={styles.sectionText}>
              We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including breach of these Terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to Terms</Text>
            <Text style={styles.sectionText}>
              We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have questions about these Terms, please contact us at legal@youdoc.com
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfServiceScreen;
