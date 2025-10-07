import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Platform, Image, Alert } from 'react-native';
import { ChevronLeft, User, Camera, Mail, Phone, Calendar, Smile, Heart, Hand, Target, MapPin, FileText, Clock, Settings } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from './ui/BottomNav';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('John Doe');
  const [email, setEmail] = useState<string>('demo@youdoc.com');
  const [phone, setPhone] = useState<string>('+1 (555) 123-4567');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(1990, 4, 15));
  const [showGenderModal, setShowGenderModal] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [gender, setGender] = useState<string>('Male');
  const [bloodType, setBloodType] = useState<string>('O+');
  const [height, setHeight] = useState<string>('5\'7"');
  const [weight, setWeight] = useState<string>('165 lbs');
  const [address, setAddress] = useState<string>('123 Main Street, New York, NY 10001');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showBloodTypeModal, setShowBloodTypeModal] = useState<boolean>(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  const pickImage = async () => {
    if (!isEditing) return;
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const DatePickerModal = ({ visible, onClose, onSelect, currentDate }: { visible: boolean; onClose: () => void; onSelect: (date: Date) => void; currentDate: Date }) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentYear = new Date().getFullYear();
    
    const [selectedDay, setSelectedDay] = useState<number>(currentDate.getDate());
    const [selectedMonth, setSelectedMonth] = useState<string>(currentDate.toLocaleDateString('en-US', { month: 'long' }));
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

    const dayScrollRef = React.useRef<ScrollView>(null);
    const monthScrollRef = React.useRef<ScrollView>(null);
    const yearScrollRef = React.useRef<ScrollView>(null);

    const ITEM_HEIGHT = 44;

    const monthIndex = months.indexOf(selectedMonth);
    const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const years = Array.from({ length: 200 }, (_, i) => currentYear + 50 - i);

    React.useEffect(() => {
      if (visible) {
        setSelectedDay(currentDate.getDate());
        setSelectedMonth(currentDate.toLocaleDateString('en-US', { month: 'long' }));
        setSelectedYear(currentDate.getFullYear());
        
        setTimeout(() => {
          const monthIdx = months.indexOf(currentDate.toLocaleDateString('en-US', { month: 'long' }));
          const yearIdx = years.indexOf(currentDate.getFullYear());
          
          dayScrollRef.current?.scrollTo({ y: (currentDate.getDate() - 1) * ITEM_HEIGHT, animated: false });
          monthScrollRef.current?.scrollTo({ y: monthIdx * ITEM_HEIGHT, animated: false });
          yearScrollRef.current?.scrollTo({ y: yearIdx * ITEM_HEIGHT, animated: false });
        }, 100);
      }
    }, [visible, currentDate, months, years]);

    const handleDayScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const day = days[index];
      if (day && day !== selectedDay) {
        setSelectedDay(day);
      }
    };

    const handleMonthScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const month = months[index];
      if (month && month !== selectedMonth) {
        setSelectedMonth(month);
      }
    };

    const handleYearScroll = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const year = years[index];
      if (year && year !== selectedYear) {
        setSelectedYear(year);
      }
    };

    const handleConfirm = () => {
      const monthIdx = months.indexOf(selectedMonth);
      const daysInSelectedMonth = new Date(selectedYear, monthIdx + 1, 0).getDate();
      const validDay = Math.min(selectedDay, daysInSelectedMonth);
      const newDate = new Date(selectedYear, monthIdx, validDay);
      onSelect(newDate);
      onClose();
    };

    const renderWheelItem = (item: number | string, isSelected: boolean) => {
      return (
        <View style={[datePickerStyles.wheelItem, { height: ITEM_HEIGHT }]}>
          <Text style={[
            datePickerStyles.wheelItemText,
            isSelected && datePickerStyles.wheelItemTextSelected
          ]}>
            {item}
          </Text>
        </View>
      );
    };

    const datePickerStyles = StyleSheet.create({
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
      },
      modalContent: {
        backgroundColor: colors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      },
      modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: colors.text,
      },
      cancelText: {
        fontSize: 17,
        color: '#4F7FFF',
        fontWeight: '400',
      },
      doneText: {
        fontSize: 17,
        color: '#4F7FFF',
        fontWeight: '600',
      },
      pickerContainer: {
        position: 'relative',
        backgroundColor: colors.background,
        marginTop: 1,
      },
      selectionIndicator: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 44,
        marginTop: -22,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
        zIndex: 1,
        pointerEvents: 'none',
      },
      wheelContainer: {
        flexDirection: 'row',
        height: 220,
        paddingHorizontal: 20,
      },
      wheelColumn: {
        flex: 1,
        overflow: 'hidden',
      },
      wheelItem: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
      },
      wheelItemText: {
        fontSize: 20,
        color: colors.textSecondary,
      },
      wheelItemTextSelected: {
        fontSize: 23,
        fontWeight: '500',
        color: colors.text,
      },
    });

    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={datePickerStyles.modalOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            activeOpacity={1} 
            onPress={onClose}
          />
          <View style={datePickerStyles.modalContent}>
            <View style={datePickerStyles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={datePickerStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={datePickerStyles.modalTitle}>Date of Birth</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={datePickerStyles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={datePickerStyles.pickerContainer}>
              <View style={datePickerStyles.selectionIndicator} />
              
              <View style={datePickerStyles.wheelContainer}>
                <View style={datePickerStyles.wheelColumn}>
                  <ScrollView 
                    ref={monthScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleMonthScroll}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  >
                    {months.map((month) => renderWheelItem(month, selectedMonth === month))}
                  </ScrollView>
                </View>

                <View style={datePickerStyles.wheelColumn}>
                  <ScrollView 
                    ref={dayScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleDayScroll}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  >
                    {days.map((day) => renderWheelItem(day, selectedDay === day))}
                  </ScrollView>
                </View>

                <View style={datePickerStyles.wheelColumn}>
                  <ScrollView 
                    ref={yearScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleYearScroll}
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
                  >
                    {years.map((year) => renderWheelItem(year, selectedYear === year))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.card,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
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
      backgroundColor: colors.card,
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
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
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
      color: colors.text,
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
    },
    infoCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.textSecondary,
      flex: 1,
    },
    infoValue: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginRight: 8,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
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
      color: colors.text,
      marginBottom: 2,
    },
    actionSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    infoInput: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.card,
      minWidth: 120,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    genderModal: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 24,
      width: '80%',
      maxWidth: 300,
    },
    genderModalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    genderOption: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: colors.card,
      marginBottom: 12,
    },
    genderOptionSelected: {
      backgroundColor: '#4F7FFF',
    },
    genderOptionText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    genderOptionTextSelected: {
      color: '#FFFFFF',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage} disabled={!isEditing}>
              <View style={styles.avatar}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>JD</Text>
                )}
              </View>
              {isEditing && (
                <View style={styles.cameraButton}>
                  <Camera size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
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
                  placeholderTextColor={colors.textSecondary}
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
                  placeholderTextColor={colors.textSecondary}
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
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{phone}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => isEditing && setShowDatePicker(true)}
              disabled={!isEditing}
            >
              <View style={[styles.infoIcon, { backgroundColor: '#E0E7FF' }]}>
                <Calendar size={20} color="#6366F1" />
              </View>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{dateOfBirth.toLocaleDateString('en-US')}</Text>
              {isEditing && <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />}
            </TouchableOpacity>

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
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => isEditing && setShowBloodTypeModal(true)}
              disabled={!isEditing}
            >
              <View style={[styles.infoIcon, { backgroundColor: '#FEE2E2' }]}>
                <Heart size={20} color="#EF4444" />
              </View>
              <Text style={styles.infoLabel}>Blood Type</Text>
              <Text style={styles.infoValue}>{bloodType}</Text>
              {isEditing && <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.infoRow}
              disabled={!isEditing}
            >
              <View style={[styles.infoIcon, { backgroundColor: '#DBEAFE' }]}>
                <Hand size={20} color="#3B82F6" />
              </View>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>{height}</Text>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.infoRow}
              disabled={!isEditing}
            >
              <View style={[styles.infoIcon, { backgroundColor: '#D1FAE5' }]}>
                <Target size={20} color="#10B981" />
              </View>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{weight}</Text>
              <ChevronLeft size={20} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>

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
                  placeholderTextColor={colors.textSecondary}
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

      {showDatePicker && (
        <DatePickerModal
          visible={true}
          onClose={() => setShowDatePicker(false)}
          onSelect={(date) => {
            setDateOfBirth(date);
            setShowDatePicker(false);
          }}
          currentDate={dateOfBirth}
        />
      )}

      <Modal
        visible={showBloodTypeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBloodTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.genderModal}>
            <Text style={styles.genderModalTitle}>Select Blood Type</Text>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.genderOption,
                  bloodType === option && styles.genderOptionSelected
                ]}
                onPress={() => {
                  setBloodType(option);
                  setShowBloodTypeModal(false);
                }}
              >
                <Text style={[
                  styles.genderOptionText,
                  bloodType === option && styles.genderOptionTextSelected
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

export default ProfileScreen;
