import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { ChevronLeft, User, Camera, Mail, Phone, Calendar, Smile, Heart, Hand, Target, MapPin, FileText, Clock, Settings } from 'lucide-react-native';
import BottomNav from './ui/BottomNav';
import WheelDatePicker from './ui/WheelDatePicker';

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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('John Doe');
  const [email, setEmail] = useState<string>('demo@youdoc.com');
  const [phone, setPhone] = useState<string>('+1 (555) 123-4567');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(1990, 4, 15));
  const [showGenderModal, setShowGenderModal] = useState<boolean>(false);
  const [gender, setGender] = useState<string>('Male');
  const [bloodType, setBloodType] = useState<string>('O+');
  const [height, setHeight] = useState<string>('5\'7"');
  const [weight, setWeight] = useState<string>('165 lbs');
  const [address, setAddress] = useState<string>('123 Main Street, New York, NY 10001');

  const handleSave = () => {
    setIsEditing(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
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
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#DBEAFE' }]}>
                <User size={20} color="#4F7FFF" />
              </View>
              <Text style={styles.infoLabel}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter name"
                />
              ) : (
                <Text style={styles.infoValue}>{name}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#D1FAE5' }]}>
                <Mail size={20} color="#10B981" />
              </View>
              <Text style={styles.infoLabel}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{email}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#FEF3C7' }]}>
                <Phone size={20} color="#F59E0B" />
              </View>
              <Text style={styles.infoLabel}>Phone</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{phone}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#E0E7FF' }]}>
                <Calendar size={20} color="#6366F1" />
              </View>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              {isEditing ? (
                <View style={{ flex: 1 }}>
                  <WheelDatePicker
                    value={dateOfBirth}
                    onChange={setDateOfBirth}
                    label=""
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.infoValue}>{dateOfBirth.toLocaleDateString('en-US')}</Text>
                  <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                </>
              )}
            </View>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => isEditing && setShowGenderModal(true)}
              disabled={!isEditing}
            >
              <View style={[styles.infoIcon, { backgroundColor: '#FEE2E2' }]}>
                <Smile size={20} color="#EF4444" />
              </View>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{gender}</Text>
              {isEditing && <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#FEE2E2' }]}>
                <Heart size={20} color="#EF4444" />
              </View>
              <Text style={styles.infoLabel}>Blood Type</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={bloodType}
                  onChangeText={setBloodType}
                  placeholder="Enter blood type"
                />
              ) : (
                <>
                  <Text style={styles.infoValue}>{bloodType}</Text>
                  <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                </>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#DBEAFE' }]}>
                <Hand size={20} color="#3B82F6" />
              </View>
              <Text style={styles.infoLabel}>Height</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="Enter height"
                />
              ) : (
                <>
                  <Text style={styles.infoValue}>{height}</Text>
                  <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                </>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#D1FAE5' }]}>
                <Target size={20} color="#10B981" />
              </View>
              <Text style={styles.infoLabel}>Weight</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="Enter weight"
                />
              ) : (
                <>
                  <Text style={styles.infoValue}>{weight}</Text>
                  <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
                </>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: '#F3F4F6' }]}>
                <MapPin size={20} color="#6B7280" />
              </View>
              <Text style={styles.infoLabel}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.infoInput, { flex: 1 }]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter address"
                  multiline
                />
              ) : (
                <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>
                  {address}
                </Text>
              )}
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

        <View style={{ height: 140 }} />
      </ScrollView>

      <BottomNav
        activeTab="profile"
        onHome={onHome}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />

      <Modal
        visible={showGenderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.genderModal}>
            <Text style={styles.genderModalTitle}>Select Gender</Text>
            {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.genderOption,
                  gender === option && styles.genderOptionSelected
                ]}
                onPress={() => {
                  setGender(option);
                  setShowGenderModal(false);
                }}
              >
                <Text style={[
                  styles.genderOptionText,
                  gender === option && styles.genderOptionTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
  infoInput: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    minWidth: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  genderModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  genderOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  genderOptionSelected: {
    backgroundColor: '#4F7FFF',
  },
  genderOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  genderOptionTextSelected: {
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
