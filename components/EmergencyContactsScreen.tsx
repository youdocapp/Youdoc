import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { ChevronLeft, Plus, Phone, Mail, Star, Edit2, Trash2, X } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useEmergencyContacts, EmergencyContact } from '../contexts/EmergencyContactsContext';

interface EmergencyContactsScreenProps {
  onBack: () => void;
}

const EmergencyContactsScreen: React.FC<EmergencyContactsScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { contacts, addContact, updateContact, deleteContact, setPrimaryContact, canAddMore, remainingSlots } = useEmergencyContacts();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phoneNumber: '',
    email: '',
    isPrimary: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      isPrimary: false
    });
    setEditingContact(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (contact: EmergencyContact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phoneNumber: contact.phoneNumber,
      email: contact.email || '',
      isPrimary: contact.isPrimary
    });
    setEditingContact(contact);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Name and phone number are required');
      return;
    }

    try {
      if (editingContact) {
        await updateContact(editingContact.id, formData);
      } else {
        await addContact(formData);
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save contact');
    }
  };

  const handleDelete = (contact: EmergencyContact) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteContact(contact.id)
        }
      ]
    );
  };

  const handleSetPrimary = (contact: EmergencyContact) => {
    setPrimaryContact(contact.id);
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
      backgroundColor: colors.card,
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
      color: colors.text
    },
    addButton: {
      position: 'absolute' as const,
      right: 20,
      padding: 8
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20
    },
    infoCard: {
      backgroundColor: colors.primaryLight,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20
    },
    contactCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border
    },
    contactHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'flex-start' as const,
      marginBottom: 12
    },
    contactInfo: {
      flex: 1
    },
    contactName: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 4
    },
    contactRelationship: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8
    },
    primaryBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 4
    },
    primaryText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '600' as const
    },
    contactActions: {
      flexDirection: 'row' as const,
      gap: 8
    },
    actionButton: {
      padding: 8
    },
    contactDetails: {
      gap: 8
    },
    detailRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8
    },
    detailText: {
      fontSize: 14,
      color: colors.text
    },
    setPrimaryButton: {
      marginTop: 12,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: 'center' as const
    },
    setPrimaryText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500' as const
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingVertical: 60
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      marginBottom: 20
    },
    addFirstButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24
    },
    addFirstButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600' as const
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end' as const
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 20,
      paddingBottom: 40,
      maxHeight: '90%'
    },
    modalHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 20,
      marginBottom: 20
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: colors.text
    },
    closeButton: {
      padding: 8
    },
    modalBody: {
      paddingHorizontal: 20
    },
    inputGroup: {
      marginBottom: 20
    },
    label: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: colors.text,
      marginBottom: 8
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center' as const,
      marginTop: 20
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600' as const
    },
    saveButtonDisabled: {
      backgroundColor: colors.border
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Emergency Contacts</Text>
        {canAddMore && (
          <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd}>
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Add up to {remainingSlots} more emergency contacts. These contacts will be notified in case of an emergency.
          </Text>
        </View>

        {contacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No emergency contacts added yet.{'\n'}Add your first contact to get started.
            </Text>
            <TouchableOpacity style={styles.addFirstButton} onPress={handleOpenAdd}>
              <Text style={styles.addFirstButtonText}>Add Contact</Text>
            </TouchableOpacity>
          </View>
        ) : (
          contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                  {contact.isPrimary && (
                    <View style={styles.primaryBadge}>
                      <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                      <Text style={styles.primaryText}>Primary</Text>
                    </View>
                  )}
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenEdit(contact)}>
                    <Edit2 size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(contact)}>
                    <Trash2 size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.contactDetails}>
                <View style={styles.detailRow}>
                  <Phone size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{contact.phoneNumber}</Text>
                </View>
                {contact.email && (
                  <View style={styles.detailRow}>
                    <Mail size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>{contact.email}</Text>
                  </View>
                )}
              </View>

              {!contact.isPrimary && (
                <TouchableOpacity style={styles.setPrimaryButton} onPress={() => handleSetPrimary(contact)}>
                  <Text style={styles.setPrimaryText}>Set as Primary</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContact ? 'Edit Contact' : 'Add Contact'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Relationship</Text>
                <TextInput
                  style={styles.input}
                  value={formData.relationship}
                  onChangeText={(text) => setFormData({ ...formData, relationship: text })}
                  placeholder="e.g., Spouse, Parent, Friend"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                  placeholder="Enter phone number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  placeholder="Enter email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!formData.name.trim() || !formData.phoneNumber.trim()) && styles.saveButtonDisabled
                ]}
                onPress={handleSave}
                disabled={!formData.name.trim() || !formData.phoneNumber.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EmergencyContactsScreen;
