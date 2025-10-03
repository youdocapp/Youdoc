import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Settings, Search, Stethoscope, Syringe, MapPin, Activity, Moon, Flame } from 'lucide-react-native';
import BottomNav from './ui/BottomNav';

interface DashboardScreenProps {
  onSymptomChecker?: () => void;
  onMyMedication?: () => void;
  onSeeDoctor?: () => void;
  onHealthArticles?: () => void;
  onSettings?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  activeTab?: string;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onSymptomChecker,
  onMyMedication,
  onSeeDoctor,
  onHealthArticles,
  onSettings,
  onNotifications,
  onProfile,
  activeTab = 'home'
}) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB'
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
      backgroundColor: '#FFFFFF'
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#4F7FFF',
      alignItems: 'center',
      justifyContent: 'center'
    },
    avatarText: {
      fontSize: 20,
      color: '#FFFFFF',
      fontWeight: '600'
    },
    welcomeText: {
      fontSize: 14,
      color: '#6B7280'
    },
    userName: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1F2937'
    },
    settingsButton: {
      padding: 8
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: '#1F2937'
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 20,
      gap: 12
    },
    actionCard: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 120,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#EEF2FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12
    },
    actionLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#1F2937',
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#1F2937',
      paddingHorizontal: 20,
      marginBottom: 16
    },
    healthTrackerGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 24
    },
    trackerCard: {
      width: '48%',
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2
    },
    trackerIcon: {
      marginBottom: 12
    },
    trackerValue: {
      fontSize: 28,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 4
    },
    trackerLabel: {
      fontSize: 13,
      color: '#9CA3AF'
    },
    medicationSection: {
      paddingHorizontal: 20,
      marginBottom: 24
    },
    medicationCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2
    },
    medicationLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1
    },
    pillIcon: {
      fontSize: 24
    },
    medicationInfo: {
      flex: 1
    },
    medicationName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 2
    },
    medicationDose: {
      fontSize: 13,
      color: '#6B7280',
      marginBottom: 4
    },
    medicationTime: {
      fontSize: 13,
      color: '#4F7FFF',
      fontWeight: '500'
    },
    takeButton: {
      backgroundColor: '#4F7FFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20
    },
    takeButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600'
    },
    articlesSection: {
      paddingHorizontal: 20,
      marginBottom: 24
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    seeAllButton: {
      fontSize: 15,
      color: '#4F7FFF',
      fontWeight: '600'
    },
    articleCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      overflow: 'hidden',
      marginRight: 16,
      width: 280,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2
    },
    articleImage: {
      width: '100%',
      height: 140,
      backgroundColor: '#E5E7EB'
    },
    articleContent: {
      padding: 16
    },
    articleTag: {
      alignSelf: 'flex-start',
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginBottom: 8
    },
    articleTagText: {
      fontSize: 11,
      color: '#6B7280',
      fontWeight: '500'
    },
    articleTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 8,
      lineHeight: 22
    },
    articleDescription: {
      fontSize: 13,
      color: '#6B7280',
      lineHeight: 18,
      marginBottom: 8
    },
    articleReadTime: {
      fontSize: 12,
      color: '#9CA3AF'
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.userName}>User</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={onSettings}>
              <Settings size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search glossary"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={onSymptomChecker}>
            <View style={styles.actionIcon}>
              <Stethoscope size={24} color="#4F7FFF" />
            </View>
            <Text style={styles.actionLabel}>Symptom{'\n'}checker</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={onMyMedication}>
            <View style={styles.actionIcon}>
              <Syringe size={24} color="#4F7FFF" />
            </View>
            <Text style={styles.actionLabel}>My Meds</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={onSeeDoctor}>
            <View style={styles.actionIcon}>
              <MapPin size={24} color="#4F7FFF" />
            </View>
            <Text style={styles.actionLabel}>See a{'\n'}Doctor</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Health Tracker</Text>
        <View style={styles.healthTrackerGrid}>
          <View style={styles.trackerCard}>
            <Activity size={24} color="#EF4444" style={styles.trackerIcon} />
            <Text style={styles.trackerValue}>734 <Text style={{ fontSize: 16, fontWeight: '400' }}>bpm</Text></Text>
            <Text style={styles.trackerLabel}>Heart Rate</Text>
          </View>

          <View style={styles.trackerCard}>
            <Activity size={24} color="#4F7FFF" style={styles.trackerIcon} />
            <Text style={styles.trackerValue}>12,6 <Text style={{ fontSize: 16, fontWeight: '400' }}>km</Text></Text>
            <Text style={styles.trackerLabel}>Distance</Text>
          </View>

          <View style={styles.trackerCard}>
            <Moon size={24} color="#4F7FFF" style={styles.trackerIcon} />
            <Text style={styles.trackerValue}>12 <Text style={{ fontSize: 16, fontWeight: '400' }}>hrs</Text></Text>
            <Text style={styles.trackerLabel}>Sleep</Text>
          </View>

          <View style={styles.trackerCard}>
            <Flame size={24} color="#F97316" style={styles.trackerIcon} />
            <Text style={styles.trackerValue}>540 <Text style={{ fontSize: 16, fontWeight: '400' }}>cals</Text></Text>
            <Text style={styles.trackerLabel}>Calories</Text>
          </View>
        </View>

        <View style={styles.medicationSection}>
          <Text style={styles.sectionTitle}>Daily Medication</Text>
          
          <View style={styles.medicationCard}>
            <View style={styles.medicationLeft}>
              <Text style={styles.pillIcon}>💊</Text>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>Aspirin</Text>
                <Text style={styles.medicationDose}>100mg pill, 100mg mg</Text>
                <Text style={styles.medicationTime}>Scheduled: 08:00</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.takeButton}>
              <Text style={styles.takeButtonText}>Take Medication</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.medicationCard}>
            <View style={styles.medicationLeft}>
              <Text style={styles.pillIcon}>💊</Text>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>Vitamin D</Text>
                <Text style={styles.medicationDose}>1000 IU, 1000 IU IU</Text>
                <Text style={styles.medicationTime}>Scheduled: 09:00</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.takeButton}>
              <Text style={styles.takeButtonText}>Take Medication</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.articlesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Tips & Articles</Text>
            <TouchableOpacity onPress={onHealthArticles}>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.articleCard}>
              <View style={styles.articleImage} />
              <View style={styles.articleContent}>
                <View style={styles.articleTag}>
                  <Text style={styles.articleTagText}>Mental Health</Text>
                </View>
                <Text style={styles.articleTitle}>5 Ways to Manage Stress Daily</Text>
                <Text style={styles.articleDescription}>
                  Learn effective techniques to manage daily stress and improve your mental wellbeing.
                </Text>
                <Text style={styles.articleReadTime}>5 min read</Text>
              </View>
            </View>

            <View style={styles.articleCard}>
              <View style={styles.articleImage} />
              <View style={styles.articleContent}>
                <View style={styles.articleTag}>
                  <Text style={styles.articleTagText}>Lifestyle</Text>
                </View>
                <Text style={styles.articleTitle}>10 Healthy Habits to Start Today</Text>
                <Text style={styles.articleDescription}>
                  Discover simple yet significant lifestyle changes for better health.
                </Text>
                <Text style={styles.articleReadTime}>8 min read</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <BottomNav
        activeTab={activeTab}
        onHome={() => {}}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;
