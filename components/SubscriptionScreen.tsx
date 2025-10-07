import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ChevronLeft, Check, Crown } from 'lucide-react-native';

interface SubscriptionScreenProps {
  onBack: () => void;
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'monthly' | 'yearly'>('free');

  const handleSubscribe = (plan: 'free' | 'monthly' | 'yearly') => {
    if (plan === 'free') {
      Alert.alert('Current Plan', 'You are already on the free plan.');
      return;
    }
    Alert.alert(
      'Subscribe',
      `Subscribe to ${plan === 'monthly' ? 'Monthly' : 'Yearly'} Premium Plan?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Subscribe', onPress: () => {
          setSelectedPlan(plan);
          Alert.alert('Success', 'Subscription activated successfully!');
        }}
      ]
    );
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
      position: 'relative' as const,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB'
    },
    backButton: {
      position: 'absolute' as const,
      left: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      alignItems: 'center' as const,
      justifyContent: 'center' as const
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
    headerCard: {
      backgroundColor: '#EEF2FF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      alignItems: 'center' as const
    },
    headerIcon: {
      marginBottom: 12
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: '#1F2937',
      marginBottom: 8,
      textAlign: 'center' as const
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      textAlign: 'center' as const,
      lineHeight: 20
    },
    planCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2
    },
    planCardSelected: {
      borderColor: '#4F7FFF',
      backgroundColor: '#F9FAFB'
    },
    planHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 12
    },
    planName: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: '#1F2937'
    },
    currentBadge: {
      backgroundColor: '#10B981',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12
    },
    currentBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600' as const
    },
    planPrice: {
      fontSize: 36,
      fontWeight: '700' as const,
      color: '#4F7FFF',
      marginBottom: 4
    },
    planPeriod: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 16
    },
    saveBadge: {
      backgroundColor: '#FEF3C7',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start' as const,
      marginBottom: 16
    },
    saveBadgeText: {
      color: '#F59E0B',
      fontSize: 12,
      fontWeight: '600' as const
    },
    featuresContainer: {
      marginBottom: 16
    },
    planFeature: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 10
    },
    featureIcon: {
      marginRight: 12
    },
    featureText: {
      fontSize: 14,
      color: '#1F2937',
      flex: 1
    },
    subscribeButton: {
      backgroundColor: '#4F7FFF',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center' as const
    },
    subscribeButtonDisabled: {
      backgroundColor: '#E5E7EB'
    },
    subscribeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600' as const
    },
    subscribeButtonTextDisabled: {
      color: '#9CA3AF'
    },
    footer: {
      padding: 20,
      alignItems: 'center' as const
    },
    footerText: {
      fontSize: 13,
      color: '#9CA3AF',
      textAlign: 'center' as const,
      lineHeight: 18
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Subscription Plans</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.headerIcon}>
            <Crown size={48} color="#4F7FFF" />
          </View>
          <Text style={styles.headerTitle}>Upgrade to Premium</Text>
          <Text style={styles.headerSubtitle}>
            Get access to exclusive features and take your health journey to the next level
          </Text>
        </View>

        <View style={[styles.planCard, selectedPlan === 'free' && styles.planCardSelected]}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Free Plan</Text>
            {selectedPlan === 'free' && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
          </View>
          <Text style={styles.planPrice}>$0</Text>
          <Text style={styles.planPeriod}>Forever free</Text>
          <View style={styles.featuresContainer}>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>Basic health tracking</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>Medication reminders</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>Health articles</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>Symptom checker</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.subscribeButton, styles.subscribeButtonDisabled]} 
            disabled={true}
          >
            <Text style={[styles.subscribeButtonText, styles.subscribeButtonTextDisabled]}>
              Current Plan
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Monthly Premium</Text>
            {selectedPlan === 'monthly' && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
          </View>
          <Text style={styles.planPrice}>$9.99</Text>
          <Text style={styles.planPeriod}>per month</Text>
          <View style={styles.featuresContainer}>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>All Free features</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>Video consultations with doctors</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>Priority 24/7 support</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>Advanced health insights & analytics</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>Unlimited health records storage</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>AI-powered health recommendations</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.subscribeButton} 
            onPress={() => handleSubscribe('monthly')}
          >
            <Text style={styles.subscribeButtonText}>Subscribe Monthly</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Yearly Premium</Text>
            {selectedPlan === 'yearly' && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
          </View>
          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>Save 40%</Text>
          </View>
          <Text style={styles.planPrice}>$59.99</Text>
          <Text style={styles.planPeriod}>per year ($5/month)</Text>
          <View style={styles.featuresContainer}>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>All Monthly Premium features</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>2 months free (40% savings)</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>Exclusive yearly member perks</Text>
            </View>
            <View style={styles.planFeature}>
              <Check size={20} color="#10B981" style={styles.featureIcon} />
              <Text style={styles.featureText}>Early access to new features</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.subscribeButton} 
            onPress={() => handleSubscribe('yearly')}
          >
            <Text style={styles.subscribeButtonText}>Subscribe Yearly</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            All subscriptions auto-renew. Cancel anytime from your account settings. Terms and conditions apply.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;
