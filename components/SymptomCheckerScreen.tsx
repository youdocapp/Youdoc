import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import BottomNav from './ui/BottomNav';
import { useTheme } from '@/contexts/ThemeContext';

interface SymptomCheckerScreenProps {
  onBack: () => void;
  onHome?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
}

type ScreenType = 'intro' | 'select' | 'details' | 'results';

interface SymptomData {
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe' | 'extreme' | null;
  duration: string | null;
}

interface CustomSymptomModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (symptom: string) => void;
}

const SYMPTOMS = [
  'Fever',
  'Headache',
  'Cough',
  'Sore Throat',
  'Nausea',
  'Fatigue',
  'Dizziness',
  'Chest Pain',
  'Shortness of Breath',
  'Stomach Pain',
  'Joint Pain',
  'Skin Rash',
];

const SEVERITY_OPTIONS = [
  {
    level: 'mild' as const,
    title: 'Mild',
    description: "Barely noticeable, doesn't affect daily activities",
    color: '#10B981',
  },
  {
    level: 'moderate' as const,
    title: 'Moderate',
    description: 'Noticeable and somewhat bothersome',
    color: '#F59E0B',
  },
  {
    level: 'severe' as const,
    title: 'Severe',
    description: 'Very bothersome, affects daily activities',
    color: '#EF4444',
  },
  {
    level: 'extreme' as const,
    title: 'Extreme',
    description: 'Unbearable, requires immediate attention',
    color: '#DC2626',
  },
];

const DURATION_OPTIONS = [
  'A few hours',
  '1 day',
  '2-7 days',
  '1-4 weeks',
  'More than a month',
];

const SymptomCheckerScreen: React.FC<SymptomCheckerScreenProps> = ({ 
  onBack, 
  onHome, 
  onNotifications, 
  onProfile 
}) => {
  const { colors } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('intro');
  const [symptomData, setSymptomData] = useState<SymptomData>({
    symptoms: [],
    severity: null,
    duration: null,
  });
  const [showCustomSymptomModal, setShowCustomSymptomModal] = useState<boolean>(false);
  const [customSymptom, setCustomSymptom] = useState<string>('');

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
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    screenContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 120,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: 32,
      marginTop: 40,
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#4F7FFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconInner: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
    },
    mainTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    description: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 32,
    },
    disclaimerBox: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.border,
    },
    disclaimerText: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    primaryButton: {
      backgroundColor: '#4F7FFF',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#4F7FFF',
      marginTop: 12,
      marginBottom: 24,
    },
    secondaryButtonText: {
      color: '#4F7FFF',
      fontSize: 16,
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    symptomsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    symptomButton: {
      backgroundColor: colors.background,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: '47%',
    },
    symptomButtonSelected: {
      backgroundColor: '#EEF2FF',
      borderColor: '#4F7FFF',
    },
    symptomButtonText: {
      fontSize: 15,
      color: colors.text,
      fontWeight: '500',
      textAlign: 'center',
    },
    symptomButtonTextSelected: {
      color: '#4F7FFF',
    },
    symptomButtonDashed: {
      backgroundColor: colors.background,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
      minWidth: '47%',
    },
    symptomButtonDashedText: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: '500',
      textAlign: 'center',
    },
    optionsContainer: {
      gap: 12,
    },
    optionCard: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    optionCardSelected: {
      borderColor: '#4F7FFF',
      backgroundColor: '#EEF2FF',
    },
    optionDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 12,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    optionDescription: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    durationButton: {
      backgroundColor: colors.background,
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    durationButtonSelected: {
      backgroundColor: '#EEF2FF',
      borderColor: '#4F7FFF',
    },
    durationButtonText: {
      fontSize: 15,
      color: colors.text,
      fontWeight: '500',
      textAlign: 'center',
    },
    durationButtonTextSelected: {
      color: '#4F7FFF',
    },
    alertBox: {
      backgroundColor: '#FFFBEB',
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderWidth: 1,
      marginBottom: 24,
    },
    alertIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    alertIconText: {
      fontSize: 20,
      color: '#FFFFFF',
    },
    alertContent: {
      flex: 1,
    },
    alertTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    alertDescription: {
      fontSize: 14,
      color: colors.text,
    },
    resultsTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    symptomsTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    symptomTag: {
      backgroundColor: colors.background,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    symptomTagIcon: {
      fontSize: 16,
    },
    symptomTagText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    metaText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    recommendationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    recommendationNumber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#4F7FFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    recommendationNumberText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    recommendationText: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
      paddingTop: 4,
    },
    conditionsPlaceholder: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    modalCancelButton: {
      flex: 1,
      backgroundColor: colors.card,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalCancelText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    modalAddButton: {
      flex: 1,
      backgroundColor: '#4F7FFF',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    modalAddText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  const handleSymptomToggle = (symptom: string) => {
    setSymptomData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim()) {
      setSymptomData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, customSymptom.trim()],
      }));
      setCustomSymptom('');
      setShowCustomSymptomModal(false);
    }
  };

  const handleSeveritySelect = (severity: 'mild' | 'moderate' | 'severe' | 'extreme') => {
    setSymptomData(prev => ({ ...prev, severity }));
  };

  const handleDurationSelect = (duration: string) => {
    setSymptomData(prev => ({ ...prev, duration }));
  };

  const handleStartAssessment = () => {
    setCurrentScreen('select');
  };

  const handleContinueToDetails = () => {
    if (symptomData.symptoms.length > 0) {
      setCurrentScreen('details');
    }
  };

  const handleViewResults = () => {
    if (symptomData.severity && symptomData.duration) {
      setCurrentScreen('results');
    }
  };

  const handleNewAssessment = () => {
    setSymptomData({ symptoms: [], severity: null, duration: null });
    setCurrentScreen('intro');
  };

  const renderIntroScreen = () => (
    <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <View style={styles.iconInner} />
        </View>
      </View>

      <Text style={styles.mainTitle}>AI-Powered Health Assistant</Text>
      <Text style={styles.description}>
        Get personalized health insights by describing your symptoms. Our AI will help assess your condition and guide next steps.
      </Text>

      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerText}>
          This tool is for information only and does not replace professional medical advice. For emergencies, call 911.
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleStartAssessment}>
        <Text style={styles.primaryButtonText}>Start Symptom Assessment</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSelectScreen = () => (
    <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
      <Text style={styles.sectionTitle}>Select all symptoms you're currently experiencing:</Text>

      <View style={styles.symptomsGrid}>
        {SYMPTOMS.map((symptom) => (
          <TouchableOpacity
            key={symptom}
            style={[
              styles.symptomButton,
              symptomData.symptoms.includes(symptom) && styles.symptomButtonSelected,
            ]}
            onPress={() => handleSymptomToggle(symptom)}
          >
            <Text
              style={[
                styles.symptomButtonText,
                symptomData.symptoms.includes(symptom) && styles.symptomButtonTextSelected,
              ]}
            >
              {symptom}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.symptomButtonDashed}
          onPress={() => setShowCustomSymptomModal(true)}
        >
          <Text style={styles.symptomButtonDashedText}>+ Others</Text>
        </TouchableOpacity>
      </View>

      {symptomData.symptoms.length > 0 && (
        <TouchableOpacity style={styles.primaryButton} onPress={handleContinueToDetails}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderDetailsScreen = () => (
    <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
      <Text style={styles.sectionTitle}>How severe are your symptoms?</Text>

      <View style={styles.optionsContainer}>
        {SEVERITY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.level}
            style={[
              styles.optionCard,
              symptomData.severity === option.level && styles.optionCardSelected,
            ]}
            onPress={() => handleSeveritySelect(option.level)}
          >
            <View style={[styles.optionDot, { backgroundColor: option.color }]} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 32 }]}>How long have you had these symptoms?</Text>

      <View style={styles.optionsContainer}>
        {DURATION_OPTIONS.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.durationButton,
              symptomData.duration === duration && styles.durationButtonSelected,
            ]}
            onPress={() => handleDurationSelect(duration)}
          >
            <Text
              style={[
                styles.durationButtonText,
                symptomData.duration === duration && styles.durationButtonTextSelected,
              ]}
            >
              {duration}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {symptomData.severity && symptomData.duration && (
        <TouchableOpacity style={[styles.primaryButton, { marginTop: 24 }]} onPress={handleViewResults}>
          <Text style={styles.primaryButtonText}>View Results</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderResultsScreen = () => {
    const severityColor = SEVERITY_OPTIONS.find(s => s.level === symptomData.severity)?.color || '#F59E0B';
    
    return (
      <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
        <View style={[styles.alertBox, { borderColor: severityColor }]}>
          <View style={[styles.alertIcon, { backgroundColor: severityColor }]}>
            <Text style={styles.alertIconText}>⚠</Text>
          </View>
          <View style={styles.alertContent}>
            <Text style={[styles.alertTitle, { color: severityColor }]}>Consider Medical Consultation</Text>
            <Text style={styles.alertDescription}>Your symptoms may benefit from medical evaluation.</Text>
          </View>
        </View>

        <Text style={styles.resultsTitle}>Your Symptoms</Text>
        <View style={styles.symptomsTagsContainer}>
          {symptomData.symptoms.map((symptom) => (
            <View key={symptom} style={styles.symptomTag}>
              <Text style={styles.symptomTagIcon}>😵</Text>
              <Text style={styles.symptomTagText}>{symptom}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.metaText}>
          Severity: {symptomData.severity?.charAt(0).toUpperCase()}{symptomData.severity?.slice(1)} • Duration: {symptomData.duration}
        </Text>

        <Text style={styles.resultsTitle}>Recommendations</Text>

        <View style={styles.recommendationItem}>
          <View style={styles.recommendationNumber}>
            <Text style={styles.recommendationNumberText}>1</Text>
          </View>
          <Text style={styles.recommendationText}>Monitor your symptoms closely</Text>
        </View>

        <View style={styles.recommendationItem}>
          <View style={styles.recommendationNumber}>
            <Text style={styles.recommendationNumberText}>2</Text>
          </View>
          <Text style={styles.recommendationText}>Get plenty of rest and stay hydrated</Text>
        </View>

        <View style={styles.recommendationItem}>
          <View style={styles.recommendationNumber}>
            <Text style={styles.recommendationNumberText}>3</Text>
          </View>
          <Text style={styles.recommendationText}>Contact your healthcare provider if symptoms persist</Text>
        </View>

        <Text style={styles.resultsTitle}>Possible Conditions</Text>
        <Text style={styles.conditionsPlaceholder}>Based on your symptoms, several conditions may be possible...</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => {}}>
          <Text style={styles.primaryButtonText}>Schedule Provider Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleNewAssessment}>
          <Text style={styles.secondaryButtonText}>Start New Assessment</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CustomSymptomModal: React.FC<CustomSymptomModalProps> = ({ visible, onClose, onAdd }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Custom Symptom</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter symptom name"
            value={customSymptom}
            onChangeText={setCustomSymptom}
            autoFocus
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={onClose}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalAddButton} 
              onPress={handleAddCustomSymptom}
            >
              <Text style={styles.modalAddText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomSymptomModal 
        visible={showCustomSymptomModal}
        onClose={() => {
          setShowCustomSymptomModal(false);
          setCustomSymptom('');
        }}
        onAdd={handleAddCustomSymptom}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={currentScreen === 'intro' ? onBack : () => {
          if (currentScreen === 'select') setCurrentScreen('intro');
          else if (currentScreen === 'details') setCurrentScreen('select');
          else if (currentScreen === 'results') setCurrentScreen('details');
        }}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentScreen === 'intro' && 'AI Symptom Checker'}
          {currentScreen === 'select' && 'Select Symptoms'}
          {currentScreen === 'details' && 'Select Symptoms'}
          {currentScreen === 'results' && 'Assessment Results'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {currentScreen === 'intro' && renderIntroScreen()}
        {currentScreen === 'select' && renderSelectScreen()}
        {currentScreen === 'details' && renderDetailsScreen()}
        {currentScreen === 'results' && renderResultsScreen()}
      </ScrollView>

      <BottomNav
        activeTab="home"
        onHome={onHome}
        onNotifications={onNotifications}
        onProfile={onProfile}
      />
    </SafeAreaView>
  );
};

export default SymptomCheckerScreen;
