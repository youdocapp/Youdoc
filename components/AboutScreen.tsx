import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { ChevronLeft, ChevronRight, Heart, Users, Target, Award, Globe, Github, Twitter, Linkedin } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AboutScreenProps {
  onBack: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  
  const handleWebsite = () => {
    Linking.openURL('https://youdoc.com');
  };

  const handleTwitter = () => {
    Linking.openURL('https://twitter.com/youdoc');
  };

  const handleLinkedIn = () => {
    Linking.openURL('https://linkedin.com/company/youdoc');
  };

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
    logoSection: {
      alignItems: 'center' as const,
      paddingVertical: 40,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#4F7FFF',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 16
    },
    logoText: {
      fontSize: 36,
      fontWeight: '700' as const,
      color: '#FFFFFF'
    },
    appName: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 8
    },
    version: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4
    },
    tagline: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      paddingHorizontal: 40
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
    infoCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border
    },
    infoCardHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 12
    },
    infoIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 12
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text
    },
    infoText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22
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
    socialContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      gap: 16,
      paddingVertical: 24
    },
    socialButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.background,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2
    },
    footer: {
      alignItems: 'center' as const,
      paddingVertical: 24,
      paddingHorizontal: 40
    },
    footerText: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      lineHeight: 20
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>About YouDoc</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>YD</Text>
          </View>
          <Text style={styles.appName}>YouDoc</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.tagline}>Your Personal Health Companion</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <View style={[styles.infoIconContainer, { backgroundColor: '#EEF2FF' }]}>
                <Heart size={20} color="#4F7FFF" />
              </View>
              <Text style={styles.infoTitle}>Our Mission</Text>
            </View>
            <Text style={styles.infoText}>
              To empower individuals to take control of their health through innovative technology, making healthcare accessible, manageable, and personalized for everyone.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <View style={[styles.infoIconContainer, { backgroundColor: '#D1FAE5' }]}>
                <Target size={20} color="#10B981" />
              </View>
              <Text style={styles.infoTitle}>Our Vision</Text>
            </View>
            <Text style={styles.infoText}>
              A world where everyone has the tools and knowledge to manage their health effectively, leading to healthier, happier lives.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <View style={[styles.infoIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Award size={20} color="#F59E0B" />
              </View>
              <Text style={styles.infoTitle}>Our Values</Text>
            </View>
            <Text style={styles.infoText}>
              Privacy, security, and user empowerment are at the core of everything we do. We&apos;re committed to protecting your health data while providing you with the best possible experience.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COMPANY</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} onPress={handleWebsite}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <Globe size={20} color="#3B82F6" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Website</Text>
                  <Text style={styles.menuItemSubtext}>Visit youdoc.com</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <Users size={20} color="#A855F7" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Our Team</Text>
                  <Text style={styles.menuItemSubtext}>Meet the people behind YouDoc</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <Award size={20} color="#EF4444" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Careers</Text>
                  <Text style={styles.menuItemSubtext}>Join our team</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONNECT WITH US</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleTwitter}>
              <Twitter size={20} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={handleLinkedIn}>
              <Linkedin size={20} color="#0A66C2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Github size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 YouDoc. All rights reserved.{'\n'}
            Made with ❤️ for your health and wellness.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
