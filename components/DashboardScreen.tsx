import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Settings, Search, Stethoscope, Syringe, MapPin, Moon, Flame, Heart, Footprints, TrendingUp } from 'lucide-react-native';
import BottomNav from './ui/BottomNav';
import { useMedication } from '@/contexts/MedicationContext';
import { useHealthTracker } from '@/contexts/HealthTrackerContext';
import { useRouter } from 'expo-router';
import { articles } from '@/constants/articles';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DashboardScreenProps {
  onSymptomChecker?: () => void;
  onMyMedication?: () => void;
  onSeeDoctor?: () => void;
  onHealthArticles?: () => void;
  onSettings?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  onGlossarySearch?: (query: string) => void;

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
  onGlossarySearch,

  activeTab = 'home'
}) => {
  const { colors } = useTheme();
  const { medications, toggleMedicationTaken } = useMedication();
  const { healthData } = useHealthTracker();
  const router = useRouter();
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const storedProfile = await AsyncStorage.getItem('userProfile');
        
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          if (profile.avatar_url) {
            setProfileImage(profile.avatar_url);
          }
          if (profile.full_name) {
            setUserName(profile.full_name);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    loadProfile();
  }, []);

  const todayMedications = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return medications.filter(med => med.dateAdded === today);
  }, [medications]);

  const featuredArticles = useMemo(() => articles.slice(0, 3), []);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
      backgroundColor: colors.card
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
    avatarImage: {
      width: 48,
      height: 48,
      borderRadius: 24
    },
    welcomeText: {
      fontSize: 14,
      color: colors.textSecondary
    },
    userName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text
    },
    settingsButton: {
      padding: 8
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 20,
      gap: 12
    },
    actionCard: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 120,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border
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
      color: colors.text,
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      paddingHorizontal: 20,
      marginBottom: 16
    },
    healthTrackerContainer: {
      paddingHorizontal: 20,
      marginBottom: 24
    },
    healthTrackerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    viewAllButton: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600'
    },
    healthTrackerGrid: {
      gap: 12
    },
    trackerRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12
    },
    trackerCardLarge: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: colors.border
    },
    trackerCardSmall: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: colors.border
    },
    trackerCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    },
    trackerIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center'
    },
    trackerBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    },
    trackerBadgeText: {
      fontSize: 11,
      fontWeight: '600'
    },
    trackerValueContainer: {
      marginBottom: 8
    },
    trackerValue: {
      fontSize: 36,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -1
    },
    trackerUnit: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textSecondary,
      marginLeft: 4
    },
    trackerLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
      marginBottom: 8
    },
    trackerProgress: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      overflow: 'hidden',
      marginTop: 8
    },
    trackerProgressFill: {
      height: '100%',
      borderRadius: 3
    },
    trackerSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8
    },
    heartRateGradient: {
      backgroundColor: '#FEE2E2'
    },
    stepsGradient: {
      backgroundColor: '#DBEAFE'
    },
    sleepGradient: {
      backgroundColor: '#E0E7FF'
    },
    caloriesGradient: {
      backgroundColor: '#FED7AA'
    },
    medicationSection: {
      paddingHorizontal: 20,
      marginBottom: 24
    },
    medicationCard: {
      backgroundColor: colors.background,
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
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border
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
      color: colors.text,
      marginBottom: 2
    },
    medicationNameTaken: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 2,
      textDecorationLine: 'line-through'
    },
    medicationDose: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4
    },
    medicationDoseTaken: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
      textDecorationLine: 'line-through'
    },
    medicationTime: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '500'
    },
    medicationTimeTaken: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
      textDecorationLine: 'line-through'
    },
    takeButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20
    },
    takenButton: {
      backgroundColor: colors.success,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20
    },
    takeButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600'
    },
    emptyMedicationText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingVertical: 20
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
      backgroundColor: colors.background,
      borderRadius: 16,
      overflow: 'hidden',
      marginRight: 16,
      width: 280,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border
    },
    articleImage: {
      width: '100%',
      height: 160,
      backgroundColor: '#E5E7EB'
    },
    articleContent: {
      padding: 16
    },
    articleTag: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8
    },
    categoryIcon: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#8B5CF6',
      marginRight: 6
    },
    articleTagText: {
      fontSize: 12,
      color: '#8B5CF6',
      fontWeight: '600'
    },
    articleTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      lineHeight: 22
    },
    articleDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 12
    },
    articleFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    articleAuthor: {
      fontSize: 12,
      color: '#4F7FFF',
      fontWeight: '500'
    },
    articleReadTime: {
      fontSize: 12,
      color: colors.textSecondary
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userSection}>
              <View style={styles.avatar}>
                {isLoadingProfile ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>
                    {userName ? userName.charAt(0).toUpperCase() : (user?.firstName ? user.firstName.charAt(0).toUpperCase() : '👤')}
                  </Text>
                )}
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.userName}>
                  {userName || user?.firstName || 'User'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={onSettings}>
              <Settings size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.searchContainer}
            onPress={() => onGlossarySearch?.('')}
          >
            <Search size={20} color={colors.textSecondary} />
            <Text style={[styles.searchInput, { color: colors.textSecondary }]}>Search glossary</Text>
          </TouchableOpacity>
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



        <View style={styles.healthTrackerContainer}>
          <View style={styles.healthTrackerHeader}>
            <Text style={styles.sectionTitle}>Health Tracker</Text>
            <TouchableOpacity onPress={() => router.push('/connected-devices')}>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.healthTrackerGrid}>
            <View style={styles.trackerRow}>
              <View style={styles.trackerCardLarge}>
                <View style={styles.trackerCardHeader}>
                  <View style={[styles.trackerIconContainer, styles.heartRateGradient]}>
                    <Heart size={24} color="#EF4444" fill="#EF4444" />
                  </View>
                  <View style={[styles.trackerBadge, { backgroundColor: '#FEE2E2' }]}>
                    <TrendingUp size={12} color="#EF4444" />
                    <Text style={[styles.trackerBadgeText, { color: '#EF4444' }]}>Normal</Text>
                  </View>
                </View>
                <Text style={styles.trackerLabel}>Heart Rate</Text>
                <View style={styles.trackerValueContainer}>
                  <Text style={styles.trackerValue}>
                    {healthData.heartRate}
                    <Text style={styles.trackerUnit}> bpm</Text>
                  </Text>
                </View>
                <View style={styles.trackerProgress}>
                  <View style={[styles.trackerProgressFill, { width: `${(healthData.heartRate / 120) * 100}%`, backgroundColor: '#EF4444' }]} />
                </View>
                <Text style={styles.trackerSubtext}>Resting: 60-100 bpm</Text>
              </View>

              <View style={styles.trackerCardSmall}>
                <View style={[styles.trackerIconContainer, styles.stepsGradient]}>
                  <Footprints size={24} color="#3B82F6" />
                </View>
                <Text style={[styles.trackerLabel, { marginTop: 12 }]}>Steps</Text>
                <Text style={[styles.trackerValue, { fontSize: 28 }]}>
                  {healthData.steps.toLocaleString()}
                </Text>
                <View style={[styles.trackerProgress, { marginTop: 12 }]}>
                  <View style={[styles.trackerProgressFill, { width: `${(healthData.steps / 10000) * 100}%`, backgroundColor: '#3B82F6' }]} />
                </View>
                <Text style={styles.trackerSubtext}>Goal: 10,000</Text>
              </View>
            </View>

            <View style={styles.trackerRow}>
              <View style={styles.trackerCardSmall}>
                <View style={[styles.trackerIconContainer, styles.sleepGradient]}>
                  <Moon size={24} color="#6366F1" />
                </View>
                <Text style={[styles.trackerLabel, { marginTop: 12 }]}>Sleep</Text>
                <Text style={[styles.trackerValue, { fontSize: 28 }]}>
                  {healthData.sleep.toFixed(1)}
                  <Text style={[styles.trackerUnit, { fontSize: 16 }]}> hrs</Text>
                </Text>
                <View style={[styles.trackerProgress, { marginTop: 12 }]}>
                  <View style={[styles.trackerProgressFill, { width: `${(healthData.sleep / 8) * 100}%`, backgroundColor: '#6366F1' }]} />
                </View>
                <Text style={styles.trackerSubtext}>Goal: 8 hrs</Text>
              </View>

              <View style={styles.trackerCardSmall}>
                <View style={[styles.trackerIconContainer, styles.caloriesGradient]}>
                  <Flame size={24} color="#F97316" />
                </View>
                <Text style={[styles.trackerLabel, { marginTop: 12 }]}>Calories</Text>
                <Text style={[styles.trackerValue, { fontSize: 28 }]}>
                  {healthData.calories}
                </Text>
                <View style={[styles.trackerProgress, { marginTop: 12 }]}>
                  <View style={[styles.trackerProgressFill, { width: `${(healthData.calories / 2000) * 100}%`, backgroundColor: '#F97316' }]} />
                </View>
                <Text style={styles.trackerSubtext}>Goal: 2,000</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.medicationSection}>
          <Text style={styles.sectionTitle}>Daily Medication</Text>
          
          {todayMedications.length === 0 ? (
            <Text style={styles.emptyMedicationText}>No medications scheduled for today</Text>
          ) : (
            todayMedications.map((med) => (
              <View key={med.id} style={styles.medicationCard}>
                <View style={styles.medicationLeft}>
                  <Text style={styles.pillIcon}>💊</Text>
                  <View style={styles.medicationInfo}>
                    <Text style={med.taken ? styles.medicationNameTaken : styles.medicationName}>
                      {med.name}
                    </Text>
                    <Text style={med.taken ? styles.medicationDoseTaken : styles.medicationDose}>
                      {med.dosage}
                    </Text>
                    <Text style={med.taken ? styles.medicationTimeTaken : styles.medicationTime}>
                      Scheduled: {med.time.join(', ')}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={med.taken ? styles.takenButton : styles.takeButton}
                  onPress={() => toggleMedicationTaken(med.id)}
                >
                  <Text style={styles.takeButtonText}>
                    {med.taken ? 'Taken' : 'Take Medication'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.articlesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Tips & Articles</Text>
            <TouchableOpacity onPress={onHealthArticles}>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => router.push(`/article-detail?articleId=${article.id}`)}
              >
                {article.image ? (
                  <Image
                    source={{ uri: article.image }}
                    style={styles.articleImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.articleImage} />
                )}
                <View style={styles.articleContent}>
                  <View style={styles.articleTag}>
                    <View style={styles.categoryIcon} />
                    <Text style={styles.articleTagText}>{article.category}</Text>
                  </View>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text style={styles.articleDescription} numberOfLines={2}>
                    {article.description}
                  </Text>
                  <View style={styles.articleFooter}>
                    <Text style={styles.articleAuthor}>By {article.author}</Text>
                    <Text style={styles.articleReadTime}>{article.readTime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

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
