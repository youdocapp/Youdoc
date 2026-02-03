import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Settings, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

// UI Components
import { ScreenWrapper } from './ui/ScreenWrapper';
import BottomNav from './ui/BottomNav';
import { HealthTrackerWidget } from './ui/HealthTrackerWidget';
import { MedicationWidget } from './ui/MedicationWidget';
import { QuickActionsWidget } from './ui/QuickActionsWidget';
import { ArticlesWidget } from './ui/ArticlesWidget';

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
  onSettings,
  onNotifications,
  onProfile,
  onGlossarySearch,
  activeTab = 'home'
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  
  // User Info Logic
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const userName = `${firstName} ${lastName}`.trim() || user?.email?.split('@')[0] || 'User';
  const userInitials = firstName?.[0] && lastName?.[0] 
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : firstName?.[0] 
      ? firstName[0].toUpperCase()
      : user?.email?.[0]?.toUpperCase() || '👤';

  const styles = StyleSheet.create({
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 4,
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
      backgroundColor: colors.primary || '#4F7FFF',
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
      borderColor: colors.border,
      marginBottom: 8
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.textSecondary
    }
  });

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userSection}>
              <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{userInitials}</Text>
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.userName}>{userName}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={onSettings}>
              <Settings size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.searchContainer}
            onPress={() => onGlossarySearch?.('')}
            activeOpacity={0.8}
          >
            <Search size={20} color={colors.textSecondary} />
            <Text style={styles.searchInput}>Search glossary...</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Widget */}
        <QuickActionsWidget 
            onSymptomChecker={onSymptomChecker}
            onMyMedication={onMyMedication}
            onSeeDoctor={onSeeDoctor}
        />

        {/* Health Tracker Widget */}
        <HealthTrackerWidget />

        {/* Medication Widget */}
        <MedicationWidget />

        {/* Articles Widget */}
        <ArticlesWidget />

      </ScrollView>
      
      <BottomNav
        activeTab={activeTab}
        onHome={() => {}} 
        onNotifications={onNotifications}
        onProfile={onProfile}
      />
    </ScreenWrapper>
  );
};

export default DashboardScreen;
