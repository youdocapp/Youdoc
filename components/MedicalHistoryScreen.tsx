import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useMedicalHistory, MedicalCondition, Surgery, Allergy } from '../contexts/MedicalHistoryContext';

interface MedicalHistoryScreenProps {
  onBack: () => void;
}

type TabType = 'conditions' | 'surgeries' | 'allergies';

const MedicalHistoryScreen: React.FC<MedicalHistoryScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const {
    conditions,
    surgeries,
    allergies,
    addCondition,
    updateCondition,
    deleteCondition,
    addSurgery,
    updateSurgery,
    deleteSurgery,
    addAllergy,
    updateAllergy,
    deleteAllergy
  } = useMedicalHistory();

  const [activeTab, setActiveTab] = useState<TabType>('conditions');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MedicalCondition | Surgery | Allergy | null>(null);

  const [conditionForm, setConditionForm] = useState({
    name: '',
    diagnosedDate: new Date().toISOString().split('T')[0],
    status: 'active' as MedicalCondition['status'],
    notes: ''
  });

  const [surgeryForm, setSurgeryForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    hospital: '',
    surgeon: '',
    notes: ''
  });

  const [allergyForm, setAllergyForm] = useState({
    allergen: '',
    reaction: '',
    severity: 'moderate' as Allergy['severity'],
    notes: ''
  });

  const resetForms = () => {
    setConditionForm({
      name: '',
      diagnosedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      notes: ''
    });
    setSurgeryForm({
      name: '',
      date: new Date().toISOString().split('T')[0],
      hospital: '',
      surgeon: '',
      notes: ''
    });
    setAllergyForm({
      allergen: '',
      reaction: '',
      severity: 'moderate',
      notes: ''
    });
    setEditingItem(null);
  };

  const handleOpenAdd = () => {
    resetForms();
    setShowModal(true);
  };

  const handleOpenEdit = (item: MedicalCondition | Surgery | Allergy) => {
    setEditingItem(item);
    if (activeTab === 'conditions') {
      const condition = item as MedicalCondition;
      setConditionForm({
        name: condition.name,
        diagnosedDate: condition.diagnosedDate,
        status: condition.status,
        notes: condition.notes || ''
      });
    } else if (activeTab === 'surgeries') {
      const surgery = item as Surgery;
      setSurgeryForm({
        name: surgery.name,
        date: surgery.date,
        hospital: surgery.hospital || '',
        surgeon: surgery.surgeon || '',
        notes: surgery.notes || ''
      });
    } else {
      const allergy = item as Allergy;
      setAllergyForm({
        allergen: allergy.allergen,
        reaction: allergy.reaction,
        severity: allergy.severity,
        notes: allergy.notes || ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (activeTab === 'conditions') {
        if (!conditionForm.name.trim()) {
          Alert.alert('Error', 'Condition name is required');
          return;
        }
        if (editingItem) {
          await updateCondition(editingItem.id, conditionForm);
        } else {
          await addCondition(conditionForm);
        }
      } else if (activeTab === 'surgeries') {
        if (!surgeryForm.name.trim()) {
          Alert.alert('Error', 'Surgery name is required');
          return;
        }
        if (editingItem) {
          await updateSurgery(editingItem.id, surgeryForm);
        } else {
          await addSurgery(surgeryForm);
        }
      } else {
        if (!allergyForm.allergen.trim() || !allergyForm.reaction.trim()) {
          Alert.alert('Error', 'Allergen and reaction are required');
          return;
        }
        if (editingItem) {
          await updateAllergy(editingItem.id, allergyForm);
        } else {
          await addAllergy(allergyForm);
        }
      }
      setShowModal(false);
      resetForms();
    } catch {
      Alert.alert('Error', 'Failed to save');
    }
  };

  const handleDelete = (item: MedicalCondition | Surgery | Allergy, type: TabType) => {
    const name = 'name' in item ? item.name : (item as Allergy).allergen;
    Alert.alert(
      'Delete',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (type === 'conditions') deleteCondition(item.id);
            else if (type === 'surgeries') deleteSurgery(item.id);
            else deleteAllergy(item.id);
          }
        }
      ]
    );
  };

  const getStatusColor = (status: MedicalCondition['status']) => {
    const statusColors: Record<string, string> = {
      active: colors.error,
      resolved: colors.success,
      chronic: colors.warning
    };
    return statusColors[status];
  };

  const getSeverityColor = (severity: Allergy['severity']) => {
    const severityColors: Record<string, string> = {
      mild: colors.success,
      moderate: colors.warning,
      severe: colors.error
    };
    return severityColors[severity];
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
    tabs: {
      flexDirection: 'row' as const,
      paddingHorizontal: 20,
      paddingTop: 16,
      gap: 8,
      backgroundColor: colors.card
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center' as const,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border
    },
    tabActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: colors.text
    },
    tabTextActive: {
      color: '#FFFFFF',
      fontWeight: '600' as const
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20
    },
    card: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border
    },
    cardHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'flex-start' as const,
      marginBottom: 12
    },
    cardInfo: {
      flex: 1
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start' as const,
      marginBottom: 8
    },
    badgeText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '600' as const,
      textTransform: 'capitalize' as const
    },
    cardDate: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8
    },
    cardNotes: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20
    },
    cardActions: {
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
      minHeight: 80,
      textAlignVertical: 'top' as const
    },
    optionSelector: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 8
    },
    option: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card
    },
    optionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary
    },
    optionText: {
      fontSize: 14,
      color: colors.text,
      textTransform: 'capitalize' as const
    },
    optionTextSelected: {
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

  const renderConditions = () => {
    if (conditions.length === 0) {
      return (
        <View style={styles.emptyState}>
          <AlertCircle size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>
            No medical conditions recorded.{'\n'}Add your first condition.
          </Text>
          <TouchableOpacity style={styles.addFirstButton} onPress={handleOpenAdd}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addFirstButtonText}>Add Condition</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return conditions.map((condition) => (
      <View key={condition.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{condition.name}</Text>
            <View style={[styles.badge, { backgroundColor: getStatusColor(condition.status) }]}>
              <Text style={styles.badgeText}>{condition.status}</Text>
            </View>
            <Text style={styles.cardDate}>Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}</Text>
            {condition.notes && <Text style={styles.cardNotes}>{condition.notes}</Text>}
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenEdit(condition)}>
              <Edit2 size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(condition, 'conditions')}>
              <Trash2 size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  };

  const renderSurgeries = () => {
    if (surgeries.length === 0) {
      return (
        <View style={styles.emptyState}>
          <AlertCircle size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>
            No surgeries recorded.{'\n'}Add your first surgery.
          </Text>
          <TouchableOpacity style={styles.addFirstButton} onPress={handleOpenAdd}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addFirstButtonText}>Add Surgery</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return surgeries.map((surgery) => (
      <View key={surgery.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{surgery.name}</Text>
            <Text style={styles.cardDate}>Date: {new Date(surgery.date).toLocaleDateString()}</Text>
            {surgery.hospital && <Text style={styles.cardNotes}>Hospital: {surgery.hospital}</Text>}
            {surgery.surgeon && <Text style={styles.cardNotes}>Surgeon: {surgery.surgeon}</Text>}
            {surgery.notes && <Text style={styles.cardNotes}>{surgery.notes}</Text>}
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenEdit(surgery)}>
              <Edit2 size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(surgery, 'surgeries')}>
              <Trash2 size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  };

  const renderAllergies = () => {
    if (allergies.length === 0) {
      return (
        <View style={styles.emptyState}>
          <AlertCircle size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>
            No allergies recorded.{'\n'}Add your first allergy.
          </Text>
          <TouchableOpacity style={styles.addFirstButton} onPress={handleOpenAdd}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addFirstButtonText}>Add Allergy</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return allergies.map((allergy) => (
      <View key={allergy.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{allergy.allergen}</Text>
            <View style={[styles.badge, { backgroundColor: getSeverityColor(allergy.severity) }]}>
              <Text style={styles.badgeText}>{allergy.severity}</Text>
            </View>
            <Text style={styles.cardNotes}>Reaction: {allergy.reaction}</Text>
            {allergy.notes && <Text style={styles.cardNotes}>{allergy.notes}</Text>}
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenEdit(allergy)}>
              <Edit2 size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(allergy, 'allergies')}>
              <Trash2 size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ));
  };

  const renderModalContent = () => {
    if (activeTab === 'conditions') {
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Condition Name *</Text>
            <TextInput
              style={styles.input}
              value={conditionForm.name}
              onChangeText={(text: string) => setConditionForm({ ...conditionForm, name: text })}
              placeholder="Enter condition name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.optionSelector}>
              {(['active', 'resolved', 'chronic'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[styles.option, conditionForm.status === status && styles.optionSelected]}
                  onPress={() => setConditionForm({ ...conditionForm, status })}
                >
                  <Text style={[styles.optionText, conditionForm.status === status && styles.optionTextSelected]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Diagnosed Date</Text>
            <TextInput
              style={styles.input}
              value={conditionForm.diagnosedDate}
              onChangeText={(text: string) => setConditionForm({ ...conditionForm, diagnosedDate: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={conditionForm.notes}
              onChangeText={(text: string) => setConditionForm({ ...conditionForm, notes: text })}
              placeholder="Additional notes"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>
        </>
      );
    } else if (activeTab === 'surgeries') {
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Surgery Name *</Text>
            <TextInput
              style={styles.input}
              value={surgeryForm.name}
              onChangeText={(text: string) => setSurgeryForm({ ...surgeryForm, name: text })}
              placeholder="Enter surgery name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={surgeryForm.date}
              onChangeText={(text: string) => setSurgeryForm({ ...surgeryForm, date: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hospital</Text>
            <TextInput
              style={styles.input}
              value={surgeryForm.hospital}
              onChangeText={(text: string) => setSurgeryForm({ ...surgeryForm, hospital: text })}
              placeholder="Hospital name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Surgeon</Text>
            <TextInput
              style={styles.input}
              value={surgeryForm.surgeon}
              onChangeText={(text: string) => setSurgeryForm({ ...surgeryForm, surgeon: text })}
              placeholder="Surgeon name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={surgeryForm.notes}
              onChangeText={(text: string) => setSurgeryForm({ ...surgeryForm, notes: text })}
              placeholder="Additional notes"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Allergen *</Text>
            <TextInput
              style={styles.input}
              value={allergyForm.allergen}
              onChangeText={(text: string) => setAllergyForm({ ...allergyForm, allergen: text })}
              placeholder="Enter allergen"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reaction *</Text>
            <TextInput
              style={styles.input}
              value={allergyForm.reaction}
              onChangeText={(text: string) => setAllergyForm({ ...allergyForm, reaction: text })}
              placeholder="Describe reaction"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Severity</Text>
            <View style={styles.optionSelector}>
              {(['mild', 'moderate', 'severe'] as const).map((severity) => (
                <TouchableOpacity
                  key={severity}
                  style={[styles.option, allergyForm.severity === severity && styles.optionSelected]}
                  onPress={() => setAllergyForm({ ...allergyForm, severity })}
                >
                  <Text style={[styles.optionText, allergyForm.severity === severity && styles.optionTextSelected]}>
                    {severity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={allergyForm.notes}
              onChangeText={(text: string) => setAllergyForm({ ...allergyForm, notes: text })}
              placeholder="Additional notes"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>
        </>
      );
    }
  };

  const isFormValid = () => {
    if (activeTab === 'conditions') return conditionForm.name.trim();
    if (activeTab === 'surgeries') return surgeryForm.name.trim();
    return allergyForm.allergen.trim() && allergyForm.reaction.trim();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Medical History</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'conditions' && styles.tabActive]}
          onPress={() => setActiveTab('conditions')}
        >
          <Text style={[styles.tabText, activeTab === 'conditions' && styles.tabTextActive]}>
            Conditions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'surgeries' && styles.tabActive]}
          onPress={() => setActiveTab('surgeries')}
        >
          <Text style={[styles.tabText, activeTab === 'surgeries' && styles.tabTextActive]}>
            Surgeries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'allergies' && styles.tabActive]}
          onPress={() => setActiveTab('allergies')}
        >
          <Text style={[styles.tabText, activeTab === 'allergies' && styles.tabTextActive]}>
            Allergies
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'conditions' && renderConditions()}
        {activeTab === 'surgeries' && renderSurgeries()}
        {activeTab === 'allergies' && renderAllergies()}
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'conditions' ? 'Condition' : activeTab === 'surgeries' ? 'Surgery' : 'Allergy'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {renderModalContent()}

              <TouchableOpacity
                style={[styles.saveButton, !isFormValid() && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!isFormValid()}
              >
                <Text style={styles.saveButtonText}>
                  {editingItem ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MedicalHistoryScreen;
