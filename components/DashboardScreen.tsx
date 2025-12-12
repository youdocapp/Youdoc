import React, { useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Settings, Search, Stethoscope, Syringe, MapPin, Moon, Flame, Heart, Footprints, TrendingUp } from 'lucide-react-native';
import BottomNav from './ui/BottomNav';
import { useMedication } from '@/contexts/MedicationContext';
import { useHealthTracker } from '@/contexts/HealthTrackerContext';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { articles as articleList } from '@/constants/articles';

interface DashboardScreenProps {
  onSymptomChecker?: () => void;
  onMyMedication?: () => void;
  onSeeDoctor?: () => void;
  onCalorieCheck?: () => void;
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
  onCalorieCheck,
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
  const { user } = useAuth();
  const topArticles = useMemo(() => articleList.slice(0, 3), []);
  
  // Get user's full name from auth context
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const userName = `${firstName} ${lastName}`.trim() || user?.email?.split('@')[0] || 'User';
  const userInitials = firstName?.[0] && lastName?.[0] 
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : firstName?.[0] 
      ? firstName[0].toUpperCase()
      : user?.email?.[0]?.toUpperCase() || '👤';

  const todayMedications = useMemo(() => {
    if (!medications || !Array.isArray(medications)) {
      return [];
    }
    const today = new Date().toISOString().split('T')[0];
    return medications.filter(med => med.dateAdded === today);
  }, [medications]);
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
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      paddingVertical: 20,
      gap: 12,
      rowGap: 12,
      justifyContent: 'space-between'
    },
    actionCard: {
      flexBasis: '48%',
      maxWidth: '48%',
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
                  <Text style={styles.avatarText}>
                  {userInitials}
                  </Text>
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.userName}>
                  {userName || 'User'}
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

          <TouchableOpacity style={styles.actionCard} onPress={onCalorieCheck}>
            <View style={styles.actionIcon}>
              <Flame size={24} color="#F97316" />
            </View>
            <Text style={styles.actionLabel}>Calorie{'\n'}Check</Text>
          </TouchableOpacity>
        </View>



        <View style={styles.healthTrackerContainer}>
          <View style={styles.healthTrackerHeader}>
            <Text style={styles.sectionTitle}>Health Tracker</Text>
          </View>

          {!healthData ? (
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              marginTop: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#F3F4F6',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Heart size={32} color="#9CA3AF" />
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#111827',
                marginBottom: 8,
                textAlign: 'center',
              }}>
                Connect Health Device
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: 20,
                lineHeight: 20,
              }}>
                Connect Google Fit or Apple Health to track your heart rate, steps, sleep, and calories.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/connected-devices')}
                style={{
                  backgroundColor: '#3B82F6',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  Connect Device
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
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
                      {healthData?.heartRate ?? '--'}
                    <Text style={styles.trackerUnit}> bpm</Text>
                  </Text>
                </View>
                <View style={styles.trackerProgress}>
                    <View style={[styles.trackerProgressFill, { width: `${((healthData?.heartRate ?? 0) / 120) * 100}%`, backgroundColor: '#EF4444' }]} />
                </View>
                <Text style={styles.trackerSubtext}>Resting: 60-100 bpm</Text>
              </View>

              <View style={styles.trackerCardSmall}>
                <View style={[styles.trackerIconContainer, styles.stepsGradient]}>
                  <Footprints size={24} color="#3B82F6" />
                </View>
                <Text style={[styles.trackerLabel, { marginTop: 12 }]}>Steps</Text>
                <Text style={[styles.trackerValue, { fontSize: 28 }]}>
                    {(healthData?.steps ?? 0).toLocaleString()}
                </Text>
                <View style={[styles.trackerProgress, { marginTop: 12 }]}>
                    <View style={[styles.trackerProgressFill, { width: `${((healthData?.steps ?? 0) / 10000) * 100}%`, backgroundColor: '#3B82F6' }]} />
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
                    {(healthData?.sleep ?? 0).toFixed(1)}
                  <Text style={[styles.trackerUnit, { fontSize: 16 }]}> hrs</Text>
                </Text>
                <View style={[styles.trackerProgress, { marginTop: 12 }]}>
                    <View style={[styles.trackerProgressFill, { width: `${((healthData?.sleep ?? 0) / 8) * 100}%`, backgroundColor: '#6366F1' }]} />
                </View>
                <Text style={styles.trackerSubtext}>Goal: 8 hrs</Text>
              </View>

              <View style={styles.trackerCardSmall}>
                <View style={[styles.trackerIconContainer, styles.caloriesGradient]}>
                  <Flame size={24} color="#F97316" />
                </View>
                <Text style={[styles.trackerLabel, { marginTop: 12 }]}>Calories</Text>
                <Text style={[styles.trackerValue, { fontSize: 28 }]}>
                    {healthData?.calories ?? '--'}
                </Text>
                <View style={[styles.trackerProgress, { marginTop: 12 }]}>
                    <View style={[styles.trackerProgressFill, { width: `${((healthData?.calories ?? 0) / 2000) * 100}%`, backgroundColor: '#F97316' }]} />
                </View>
                <Text style={styles.trackerSubtext}>Goal: 2,000</Text>
              </View>
            </View>
          </View>
          )}
        </View>

        <View style={styles.medicationSection}>
          <Text style={styles.sectionTitle}>Daily Medication</Text>
          
          {!todayMedications || todayMedications.length === 0 ? (
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
                      {med.dosage_display || `${med.dosage_amount} ${med.dosage_unit}`}
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
            <Text style={styles.sectionTitle}>Latest Articles</Text>
            <TouchableOpacity onPress={onHealthArticles}>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          {topArticles.length === 0 ? (
            <Text style={styles.emptyMedicationText}>Articles are coming soon.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {topArticles.map(article => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleCard}
                  onPress={onHealthArticles}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: article.image }} style={styles.articleImage} />
                  <View style={styles.articleContent}>
                    <View style={styles.articleTag}>
                      <View style={styles.categoryIcon} />
                      <Text style={styles.articleTagText}>{article.category}</Text>
                    </View>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    <Text style={styles.articleDescription} numberOfLines={3}>
                      {article.description}
                    </Text>
                    <View style={styles.articleFooter}>
                      <Text style={styles.articleAuthor}>{article.author}</Text>
                      <Text style={styles.articleReadTime}>{article.readTime}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
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
