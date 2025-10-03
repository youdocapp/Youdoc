import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Home, Bell, User, Camera, Mail, Phone, Calendar, Smile, Heart, Hand, Target, MapPin, FileText, Clock, Settings } from 'lucide-react-native';

interface ProfileScreenProps {
  onBack: () => void;
  onEditProfile?: () => void;
  onHealthRecords?: () => void;
  onMedicalHistory?: () => void;
  onEmergencyContacts?: () => void;
  onSettings?: () => void;
  onHome?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onEditProfile,
  onHealthRecords,
  onMedicalHistory,
  onEmergencyContacts,
  onSettings,
  onHome,
  onNotifications,
  onProfile
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.cameraButton}>
              <Camera size={16} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>demo@youdoc.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#DBEAFE' }]}>
                <User size={20} color="#4F7FFF" />
              </View>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>John Doe</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#D1FAE5' }]}>
                <Mail size={20} color="#10B981" />
              </View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>demo@youdoc.com</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#FEF3C7' }]}>
                <Phone size={20} color="#F59E0B" />
              </View>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#E0E7FF' }]}>
                <Calendar size={20} color="#6366F1" />
              </View>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>05/15/1990</Text>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#FEE2E2' }]}>
                <Smile size={20} color="#EF4444" />
              </View>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>Male</Text>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          <View style={styles.infoCard}>
            <TouchableOpacity style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#FEE2E2' }]}>
                <Heart size={20} color="#EF4444" />
              </View>
              <Text style={styles.infoLabel}>Blood Type</Text>
              <Text style={styles.infoValue}>O+</Text>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#DBEAFE' }]}>
                <Hand size={20} color="#3B82F6" />
              </View>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>5'7"</Text>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#D1FAE5' }]}>
                <Target size={20} color="#10B981" />
              </View>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>165 lbs</Text>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#F3F4F6' }]}>
                <MapPin size={20} color="#6B7280" />
              </View>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>
                123 Main Street, New York, NY 10001
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.infoCard}>
            <TouchableOpacity style={styles.actionRow} onPress={onHealthRecords}>
              <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
                <FileText size={24} color="#4F7FFF" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Health Records</Text>
                <Text style={styles.actionSubtitle}>View your medical documents</Text>
              </View>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionRow} onPress={onMedicalHistory}>
              <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
                <Clock size={24} color="#10B981" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Medical History</Text>
                <Text style={styles.actionSubtitle}>Track your health journey</Text>
              </View>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionRow} onPress={onEmergencyContacts}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
                <Phone size={24} color="#EF4444" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Emergency Contacts</Text>
                <Text style={styles.actionSubtitle}>Manage emergency information</Text>
              </View>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionRow} onPress={onSettings}>
              <View style={[styles.actionIcon, { backgroundColor: '#E0E7FF' }]}>
                <Settings size={24} color="#6366F1" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Settings</Text>
                <Text style={styles.actionSubtitle}>App preferences and privacy</Text>
              </View>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={onHome}>
          <Home size={24} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={onNotifications}>
          <View>
            <Bell size={24} color="#9CA3AF" />
            <View style={styles.notificationDot} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={onProfile}>
          <User size={24} color="#4F7FFF" fill="#4F7FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    backgroundColor: '#4F7FFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4F7FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  navItem: {
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});

export default ProfileScreen;
