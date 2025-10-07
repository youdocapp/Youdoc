import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Linking, Modal } from 'react-native';
import { ChevronLeft, ChevronRight, MessageCircle, Mail, Phone, FileQuestion, CreditCard } from 'lucide-react-native';
import { router } from 'expo-router';

interface HealthSupportScreenProps {
  onBack: () => void;
}

const HealthSupportScreen: React.FC<HealthSupportScreenProps> = ({ onBack }) => {
  const [showLiveChat, setShowLiveChat] = useState(false);
  
  const handleEmail = () => {
    Linking.openURL('mailto:support@youdoc.com');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleLiveChat = () => {
    setShowLiveChat(true);
  };

  const handleSubscription = () => {
    router.push('/subscription');
  };

  const handleFAQ = () => {
    console.log('Navigate to FAQ');
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
      color: '#1F2937'
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: '#9CA3AF',
      marginBottom: 12,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      overflow: 'hidden' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2
    },
    menuItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6'
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
      color: '#1F2937',
      marginBottom: 2
    },
    menuItemSubtext: {
      fontSize: 13,
      color: '#9CA3AF'
    },
    menuItemRight: {
      marginLeft: 12
    },
    infoCard: {
      backgroundColor: '#EEF2FF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#1F2937',
      marginBottom: 8
    },
    infoText: {
      fontSize: 14,
      color: '#6B7280',
      lineHeight: 20
    },
    contactInfo: {
      fontSize: 14,
      color: '#4F7FFF',
      fontWeight: '500' as const,
      marginTop: 4
    },
    chatContainer: {
      flex: 1,
      backgroundColor: '#F9FAFB'
    },
    chatHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB'
    },
    chatBackButton: {
      width: 40,
      height: 40,
      alignItems: 'center' as const,
      justifyContent: 'center' as const
    },
    chatTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#1F2937'
    },
    chatMessages: {
      flex: 1,
      padding: 20
    },
    chatBubbleContainer: {
      marginBottom: 16
    },
    supportBubble: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      borderTopLeftRadius: 4,
      padding: 12,
      maxWidth: '80%',
      alignSelf: 'flex-start' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2
    },
    supportBubbleText: {
      fontSize: 15,
      color: '#1F2937',
      lineHeight: 20
    },
    bubbleTime: {
      fontSize: 11,
      color: '#9CA3AF',
      marginTop: 4
    },
    infoMessage: {
      backgroundColor: '#EEF2FF',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16
    },
    infoMessageText: {
      fontSize: 13,
      color: '#6B7280',
      textAlign: 'center' as const,
      lineHeight: 18
    },
    chatInputContainer: {
      flexDirection: 'row' as const,
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      gap: 12
    },
    chatInput: {
      flex: 1,
      backgroundColor: '#F9FAFB',
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      justifyContent: 'center' as const
    },
    chatInputPlaceholder: {
      fontSize: 15,
      color: '#9CA3AF'
    },
    sendButton: {
      backgroundColor: '#4F7FFF',
      borderRadius: 24,
      paddingHorizontal: 24,
      paddingVertical: 12,
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    },
    sendButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '600' as const
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>We&apos;re here to help!</Text>
            <Text style={styles.infoText}>
              Our support team is available 24/7 to assist you with any questions or concerns about your health journey.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT US</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEmail}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <Mail size={20} color="#EF4444" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Email Support</Text>
                  <Text style={styles.contactInfo}>support@youdoc.com</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handlePhone}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <Phone size={20} color="#10B981" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Phone Support</Text>
                  <Text style={styles.contactInfo}>+1 (234) 567-890</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={handleLiveChat}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <MessageCircle size={20} color="#3B82F6" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Live Chat</Text>
                  <Text style={styles.menuItemSubtext}>Chat with our support team</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RESOURCES</Text>
          <View style={styles.card}>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={handleFAQ}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <FileQuestion size={20} color="#F59E0B" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>FAQs</Text>
                  <Text style={styles.menuItemSubtext}>Find answers to common questions</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
          <View style={styles.card}>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={handleSubscription}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <CreditCard size={20} color="#F59E0B" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Manage Subscription</Text>
                  <Text style={styles.menuItemSubtext}>View and manage your subscription</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FEEDBACK</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#D1FAE5' }]}>
                  <MessageCircle size={20} color="#10B981" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Send Feedback</Text>
                  <Text style={styles.menuItemSubtext}>Help us improve YouDoc</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" style={styles.menuItemRight} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <FileQuestion size={20} color="#F59E0B" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemText}>Report a Problem</Text>
                  <Text style={styles.menuItemSubtext}>Let us know about any issues</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" style={styles.menuItemRight} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        visible={showLiveChat}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowLiveChat(false)}
      >
        <SafeAreaView style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setShowLiveChat(false)} style={styles.chatBackButton}>
              <ChevronLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.chatTitle}>Live Chat</Text>
            <View style={{ width: 40 }} />
          </View>
          <ScrollView style={styles.chatMessages}>
            <View style={styles.chatBubbleContainer}>
              <View style={styles.supportBubble}>
                <Text style={styles.supportBubbleText}>
                  Hello! Welcome to YouDoc support. How can I help you today?
                </Text>
                <Text style={styles.bubbleTime}>Just now</Text>
              </View>
            </View>
            <View style={styles.infoMessage}>
              <Text style={styles.infoMessageText}>
                Our support team typically responds within 2-5 minutes during business hours (9 AM - 6 PM EST).
              </Text>
            </View>
          </ScrollView>
          <View style={styles.chatInputContainer}>
            <TouchableOpacity style={styles.chatInput}>
              <Text style={styles.chatInputPlaceholder}>Type your message...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default HealthSupportScreen;
