import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Linking, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, ChevronRight, MessageCircle, Mail, Phone, FileQuestion, CreditCard, Send } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

interface HealthSupportScreenProps {
  onBack: () => void;
}

const HealthSupportScreen: React.FC<HealthSupportScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: 'user' | 'support'; time: string }>>([{
    id: '1',
    text: 'Hello! Welcome to YouDoc support. How can I help you today?',
    sender: 'support',
    time: 'Just now'
  }]);
  
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

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: chatMessage,
        sender: 'user' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setChatMessage('');
      
      setTimeout(() => {
        const supportReply = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message. Our support team will respond shortly.',
          sender: 'support' as const,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, supportReply]);
      }, 1000);
    }
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
    infoCard: {
      backgroundColor: colors.primaryLight,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
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
      backgroundColor: colors.card
    },
    chatHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
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
      color: colors.text
    },
    chatMessages: {
      flex: 1,
      padding: 20
    },
    chatBubbleContainer: {
      marginBottom: 16
    },
    supportBubble: {
      backgroundColor: colors.background,
      borderRadius: 16,
      borderTopLeftRadius: 4,
      padding: 12,
      maxWidth: '80%',
      alignSelf: 'flex-start' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      borderTopRightRadius: 4,
      padding: 12,
      maxWidth: '80%',
      alignSelf: 'flex-end' as const
    },
    supportBubbleText: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 20
    },
    userBubbleText: {
      fontSize: 15,
      color: '#FFFFFF',
      lineHeight: 20
    },
    bubbleTime: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 4
    },
    userBubbleTime: {
      fontSize: 11,
      color: 'rgba(255, 255, 255, 0.8)',
      marginTop: 4
    },
    infoMessage: {
      backgroundColor: colors.primaryLight,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16
    },
    infoMessageText: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      lineHeight: 18
    },
    chatInputContainer: {
      flexDirection: 'row' as const,
      padding: 16,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 12,
      alignItems: 'center' as const
    },
    chatInput: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      maxHeight: 100
    },
    sendButton: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      width: 48,
      height: 48,
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    },
    sendButtonDisabled: {
      backgroundColor: colors.border,
      borderRadius: 24,
      width: 48,
      height: 48,
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
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
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
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
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
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
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
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
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
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
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
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
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
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
              <ChevronRight size={20} color={colors.textSecondary} style={styles.menuItemRight} />
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
          <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
          >
            <View style={styles.chatHeader}>
              <TouchableOpacity onPress={() => setShowLiveChat(false)} style={styles.chatBackButton}>
                <ChevronLeft size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.chatTitle}>Live Chat</Text>
              <View style={{ width: 40 }} />
            </View>
            <ScrollView 
              style={styles.chatMessages}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {messages.map((message) => (
                <View key={message.id} style={styles.chatBubbleContainer}>
                  <View style={message.sender === 'support' ? styles.supportBubble : styles.userBubble}>
                    <Text style={message.sender === 'support' ? styles.supportBubbleText : styles.userBubbleText}>
                      {message.text}
                    </Text>
                    <Text style={message.sender === 'support' ? styles.bubbleTime : styles.userBubbleTime}>
                      {message.time}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={styles.infoMessage}>
                <Text style={styles.infoMessageText}>
                  Our support team typically responds within 2-5 minutes during business hours (9 AM - 6 PM EST).
                </Text>
              </View>
            </ScrollView>
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type your message..."
                placeholderTextColor={colors.textSecondary}
                value={chatMessage}
                onChangeText={setChatMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={chatMessage.trim() ? styles.sendButton : styles.sendButtonDisabled}
                onPress={handleSendMessage}
                disabled={!chatMessage.trim()}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default HealthSupportScreen;
