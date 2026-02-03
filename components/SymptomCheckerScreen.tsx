import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  const styles = useMemo(() => StyleSheet.create({
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
    optionTitleSelected: {
      color: '#4F7FFF',
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
      color: '#000000',
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
  }), [colors]);

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

  const [searchText, setSearchText] = useState('');

  const filteredSymptoms = useMemo(() => {
    if (!searchText) return SYMPTOMS;
    return SYMPTOMS.filter(s => s.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText]);

  const handleAddSearchSymptom = () => {
    if (searchText.trim()) {
       // Check if it's already in the list to avoid duplicates
       const existing = symptomData.symptoms.find(s => s.toLowerCase() === searchText.trim().toLowerCase());
       if (!existing) {
          handleSymptomToggle(searchText.trim());
       }
       setSearchText('');
    }
  };

  const renderSelectScreen = () => (
    <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
      <Text style={styles.sectionTitle}>What are your symptoms?</Text>
      
      {/* Search Bar */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: colors.background, 
        borderWidth: 1, 
        borderColor: colors.border, 
        borderRadius: 12, 
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 24
      }}>
        <TextInput
            style={{ flex: 1, fontSize: 16, color: colors.text }}
            placeholder="Type your symptoms (e.g. 'Headache')"
            placeholderTextColor="#FFFFFF"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleAddSearchSymptom}
            blurOnSubmit={false}
        />
        {searchText.length > 0 && (
            <TouchableOpacity onPress={handleAddSearchSymptom}>
                <Text style={{ color: '#4F7FFF', fontWeight: '600' }}>Add</Text>
            </TouchableOpacity>
        )}
      </View>

      {/* Selected Symptoms Chips */}
      {symptomData.symptoms.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {symptomData.symptoms.map(s => (
            <TouchableOpacity 
              key={s} 
              onPress={() => handleSymptomToggle(s)}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: '#EEF2FF', 
                borderRadius: 20, 
                paddingHorizontal: 12, 
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: '#4F7FFF'
              }}
            >
              <Text style={{ color: '#4F7FFF', fontWeight: '500', marginRight: 4 }}>{s}</Text>
              <Text style={{ color: '#4F7FFF', fontSize: 16 }}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={[styles.sectionTitle, { fontSize: 14, color: colors.textSecondary }]}>Suggested Symptoms:</Text>

      <View style={styles.symptomsGrid}>
        {filteredSymptoms.map((symptom) => (
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

        {/* Show "Add custom" if search text doesn't match any existing symptoms exactly */}
        {searchText && !filteredSymptoms.includes(searchText) && (
             <TouchableOpacity 
              style={styles.symptomButtonDashed}
              onPress={handleAddSearchSymptom}
            >
              <Text style={styles.symptomButtonDashedText}>+ Add "{searchText}"</Text>
            </TouchableOpacity>
        )}

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
              <Text style={[
                styles.optionTitle,
                symptomData.severity === option.level && styles.optionTitleSelected
              ]}>{option.title}</Text>
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

  const determineConditions = (symptoms: string[], severity: string | null, duration: string | null) => {
    // database of conditions with weighted symptoms
    const conditionsDB = [
      {
        name: 'Common Cold',
        primary: ['Cough', 'Sore Throat', 'Runny Nose', 'Sneezing'],
        secondary: ['Fever', 'Fatigue', 'Headache'],
        description: 'A viral infection of your nose and throat (upper respiratory tract).',
        minMatch: 2
      },
      {
        name: 'Influenza (Flu)',
        primary: ['Fever', 'Fatigue', 'Body Aches', 'Chills'],
        secondary: ['Cough', 'Sore Throat', 'Headache'],
        description: 'A viral infection that attacks your respiratory system.',
        minMatch: 3
      },
      {
        name: 'Migraine',
        primary: ['Headache', 'Nausea', 'Sensitivity to Light'],
        secondary: ['Dizziness', 'Vision Changes'],
        description: 'A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.',
        requiredSeverity: ['severe', 'extreme'],
        minMatch: 2
      },
      {
        name: 'Tension Headache',
        primary: ['Headache'],
        secondary: ['Neck Pain', 'Fatigue'],
        description: 'A mild to moderate pain often described as feeling like a tight band around your head.',
        requiredSeverity: ['mild', 'moderate'],
        minMatch: 1
      },
      {
        name: 'Gastroenteritis (Stomach Flu)',
        primary: ['Stomach Pain', 'Nausea', 'Vomiting', 'Diarrhea'],
        secondary: ['Fever', 'Headache', 'Cough'],
        description: 'Intestinal infection marked by diarrhea, cramps, nausea, vomiting, and fever.',
        minMatch: 2
      },
      {
        name: 'COVID-19',
        primary: ['Fever', 'Cough', 'Loss of Taste or Smell', 'Shortness of Breath'],
        secondary: ['Fatigue', 'Body Aches', 'Sore Throat'],
        description: 'A respiratory illness caused by the coronavirus SARS-CoV-2.',
        minMatch: 2
      },
      {
        name: 'Angina (Heart Related)',
        primary: ['Chest Pain', 'Shortness of Breath'],
        secondary: ['Nausea', 'Dizziness', 'Sweating', 'Pain in Arm'],
        description: 'Chest pain caused by reduced blood flow to the heart.',
        isUrgent: true,
        minMatch: 2
      },
      {
        name: 'Allergic Rhinitis (Hay Fever)',
        primary: ['Sneezing', 'Runny Nose', 'Itchy Eyes'],
        secondary: ['Cough', 'Sore Throat', 'Fatigue'],
        description: 'An allergic response to specific allergens like pollen, dust mites, or pets.',
        duration: ['More than a month', '2-7 days', '1-4 weeks'],
        minMatch: 2
      },
      {
         name: 'Pneumonia',
         primary: ['Cough', 'Fever', 'Shortness of Breath'],
         secondary: ['Chest Pain', 'Fatigue', 'Nausea'],
         description: 'An infection that inflames the air sacs in one or both lungs.',
         isUrgent: true,
         minMatch: 3
      }
    ];

    const normalizedSymptoms = symptoms.map(s => s.toLowerCase());
    
    // Helper to calculate score
    const calculateScore = (condition: any) => {
        let score = 0;
        let matches = 0;
        let primaryMatches = 0;

        // Check primary symptoms (Weight: 2)
        condition.primary.forEach((s: string) => {
            if (normalizedSymptoms.some(ns => ns.includes(s.toLowerCase()))) {
                score += 2;
                matches++;
                primaryMatches++;
            }
        });

        // Check secondary symptoms (Weight: 1)
        condition.secondary.forEach((s: string) => {
            if (normalizedSymptoms.some(ns => ns.includes(s.toLowerCase()))) {
                score += 1;
                matches++;
            }
        });

        // Severity Adjustments
        if (severity && condition.requiredSeverity) {
             if (condition.requiredSeverity.includes(severity)) {
                 score += 1; // Bonus for matching severity
             } else {
                 score -= 1; // Penalty for mismatching severity
             }
        }

        // Urgency weight (if symptoms match urgent condition, boost it slightly to ensure visibility)
        if (condition.isUrgent && primaryMatches >= 1) {
            score += 0.5;
        }

        return { score, matches };
    };

    const results = conditionsDB.map(condition => {
        const { score, matches } = calculateScore(condition);
        
        let probability = 'Low';
        const maxPossibleScore = (condition.primary.length * 2) + condition.secondary.length;
        const confidence = score / maxPossibleScore;

        if (confidence > 0.6 || (matches >= condition.minMatch + 1)) probability = 'High';
        else if (confidence > 0.3 || matches >= condition.minMatch) probability = 'Moderate';
        
        return {
            ...condition,
            score,
            matches,
            probability
        };
    })
    .filter(c => c.matches >= 1 && c.score > 0) // Must match at least one thing
    .filter(c => c.matches >= (c.minMatch || 1)) // Enforce minimum match count
    .sort((a, b) => b.score - a.score); // Sort by highest score first

    // Fallback if no specific conditions match well but symptoms exist
    if (results.length === 0 && symptoms.length > 0) {
        if (normalizedSymptoms.some(s => s.includes('pain'))) {
             results.push({
                 name: 'General Pain / Discomfort',
                 probability: 'Moderate',
                 description: 'Your symptoms suggest localized pain. Please monitor severity.',
                 primary: [], secondary: [], minMatch: 0 // structural fillers
             });
        } else {
             results.push({
                name: 'Undetermined Viral Infection',
                probability: 'Low',
                description: 'Symptoms are non-specific. Ensure plenty of rest and hydration.',
                primary: [], secondary: [], minMatch: 0
             });
        }
    }

    return results.slice(0, 3); // Return top 3 results
  };

  const renderResultsScreen = () => {
    const severityColor = SEVERITY_OPTIONS.find(s => s.level === symptomData.severity)?.color || '#F59E0B';
    const conditions = determineConditions(symptomData.symptoms, symptomData.severity, symptomData.duration);
    const isUrgent = conditions.some(c => c.isUrgent && (c.probability === 'High' || c.probability === 'Moderate'));

    return (
      <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
        <View style={[styles.alertBox, { borderColor: isUrgent ? '#DC2626' : severityColor, backgroundColor: isUrgent ? '#FEF2F2' : '#FFFBEB' }]}>
          <View style={[styles.alertIcon, { backgroundColor: isUrgent ? '#DC2626' : severityColor }]}>
            <Text style={styles.alertIconText}>⚠</Text>
          </View>
          <View style={styles.alertContent}>
            <Text style={[styles.alertTitle, { color: isUrgent ? '#DC2626' : severityColor }]}>
              {isUrgent ? 'Seek Immediate Medical Attention' : 'Consider Medical Consultation'}
            </Text>
            <Text style={styles.alertDescription}>
              {isUrgent 
                ? 'Your symptoms indicate a potentially serious condition (e.g., heart or lung related). Please visit an emergency room or call emergency services.' 
                : 'Your symptoms may benefit from medical evaluation.'}
            </Text>
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

        <Text style={styles.resultsTitle}>Possible Conditions (AI Analysis)</Text>
        
        {conditions.length > 0 ? conditions.map((condition, index) => (
          <View key={index} style={{ marginBottom: 16, backgroundColor: colors.background, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>{condition.name}</Text>
                <View style={{ backgroundColor: condition.probability === 'High' ? '#FEE2E2' : (condition.probability === 'Moderate' ? '#FEF3C7' : '#ECFDF5'), paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: condition.probability === 'High' ? '#DC2626' : (condition.probability === 'Moderate' ? '#D97706' : '#059669') }}>{condition.probability}</Text>
                </View>
             </View>
             <Text style={{ fontSize: 14, color: colors.textSecondary }}>{condition.description}</Text>
          </View>
        )) : (
            <Text style={{ color: colors.textSecondary, fontStyle: 'italic', marginBottom: 16 }}>
                Not enough data to determine specific conditions.
            </Text>
        )}

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
          <Text style={styles.recommendationText}>Contact your healthcare provider if symptoms persist or worsen</Text>
        </View>

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
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Custom Symptom</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter symptom name (e.g. 'Back pain')"
            value={customSymptom}
            onChangeText={setCustomSymptom}
            autoFocus
            onSubmitEditing={handleAddCustomSymptom}
            returnKeyType="done"
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
      </KeyboardAvoidingView>
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
        keyboardShouldPersistTaps="handled"
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
