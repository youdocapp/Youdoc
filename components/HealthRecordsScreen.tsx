import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, FileText, Calendar, Edit2, Trash2, X, Upload } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { type HealthRecord } from '../lib/api';

interface HealthRecordsScreenProps {
  onBack: () => void;
}

const recordTypes = [
  { value: 'lab_result', label: 'Lab Result' },
  { value: 'prescription', label: 'Prescription' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'other', label: 'Other' }
] as const;

const HealthRecordsScreen: React.FC<HealthRecordsScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { records, isLoading, addRecord, updateRecord, deleteRecord } = useHealthRecords();
  // Ensure records is always an array to prevent map errors
  const safeRecords = Array.isArray(records) ? records : [];
  
  // Debug logging
  React.useEffect(() => {
    console.log('🔍 Health Records Screen State:', {
      isLoading,
      recordsCount: records.length,
      records,
      safeRecordsCount: safeRecords.length,
      safeRecords,
    })
  }, [isLoading, records, safeRecords])
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'other' as HealthRecord['type'],
    date: new Date().toISOString().split('T')[0],
    description: '',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'other',
      date: new Date().toISOString().split('T')[0],
      description: '',
      notes: ''
    });
    setEditingRecord(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (record: HealthRecord) => {
    setFormData({
      title: record.title,
      type: record.type,
      date: record.date,
      description: record.description || '',
      notes: record.notes || ''
    });
    setEditingRecord(record);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    try {
      if (editingRecord) {
        await updateRecord(editingRecord.id, formData);
      } else {
        await addRecord(formData);
      }
      setShowAddModal(false);
      resetForm();
    } catch {
      Alert.alert('Error', 'Failed to save record');
    }
  };

  const handleDelete = (record: HealthRecord) => {
    Alert.alert(
      'Delete Record',
      `Are you sure you want to delete "${record.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRecord(record.id)
        }
      ]
    );
  };

  const getTypeLabel = (type: HealthRecord['type']) => {
    return recordTypes.find(t => t.value === type)?.label || type;
  };

  const getTypeColor = (type: HealthRecord['type']): string => {
    const colors_map: Record<HealthRecord['type'], string> = {
      lab_result: '#3B82F6',
      prescription: '#10B981',
      imaging: '#8B5CF6',
      vaccination: '#F59E0B',
      other: '#6B7280'
    };
    return colors_map[type] || '#6B7280';
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
    recordCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border
    },
    recordHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'flex-start' as const,
      marginBottom: 12
    },
    recordInfo: {
      flex: 1
    },
    recordTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8
    },
    typeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start' as const,
      marginBottom: 8
    },
    typeText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '600' as const
    },
    recordDate: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8
    },
    recordDescription: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20
    },
    recordActions: {
      flexDirection: 'row' as const,
      gap: 8
    },
    actionButton: {
      padding: 8
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingVertical: 60
    },
    emptyIcon: {
      marginBottom: 16
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
      borderRadius: 24,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8
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
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top' as const
    },
    typeSelector: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 8
    },
    typeOption: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card
    },
    typeOptionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary
    },
    typeOptionText: {
      fontSize: 14,
      color: colors.text
    },
    typeOptionTextSelected: {
      color: '#FFFFFF',
      fontWeight: '600' as const
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
        <Text style={styles.title}>Health Records</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.emptyText, { marginTop: 16 }]}>Loading health records...</Text>
          </View>
        ) : safeRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={64} color={colors.textSecondary} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>
              No health records yet.{'\n'}Add your first record to get started.
            </Text>
            <TouchableOpacity style={styles.addFirstButton} onPress={handleOpenAdd}>
              <Upload size={20} color="#FFFFFF" />
              <Text style={styles.addFirstButtonText}>Add Record</Text>
            </TouchableOpacity>
          </View>
        ) : (
          safeRecords.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordTitle}>{record.title}</Text>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeColor(record.type) }]}>
                    <Text style={styles.typeText}>{getTypeLabel(record.type)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Calendar size={14} color={colors.textSecondary} />
                    <Text style={styles.recordDate}>{new Date(record.date).toLocaleDateString()}</Text>
                  </View>
                  {record.description && (
                    <Text style={styles.recordDescription}>{record.description}</Text>
                  )}
                </View>
                <View style={styles.recordActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenEdit(record)}>
                    <Edit2 size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(record)}>
                    <Trash2 size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
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
                {editingRecord ? 'Edit Record' : 'Add Record'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(text: string) => setFormData({ ...formData, title: text })}
                  placeholder="Enter record title"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.typeSelector}>
                  {recordTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        formData.type === type.value && styles.typeOptionSelected
                      ]}
                      onPress={() => setFormData({ ...formData, type: type.value })}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        formData.type === type.value && styles.typeOptionTextSelected
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={formData.date}
                  onChangeText={(text: string) => setFormData({ ...formData, date: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.description}
                  onChangeText={(text: string) => setFormData({ ...formData, description: text })}
                  placeholder="Enter description"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(text: string) => setFormData({ ...formData, notes: text })}
                  placeholder="Additional notes"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !formData.title.trim() && styles.saveButtonDisabled
                ]}
                onPress={handleSave}
                disabled={!formData.title.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {editingRecord ? 'Update Record' : 'Add Record'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HealthRecordsScreen;
