import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Image as ImageIcon, ArrowLeft, Info, Sparkles, Clock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CalorieCheckScreenProps {
  onBack?: () => void;
}

const MOCK_ANALYSIS = {
  calories: 620,
  macros: [
    { label: 'Carbs', value: 78, unit: 'g', color: '#FBBF24' },
    { label: 'Protein', value: 32, unit: 'g', color: '#34D399' },
    { label: 'Fat', value: 18, unit: 'g', color: '#F87171' },
  ],
  micronutrients: [
    { label: 'Fiber', value: '12 g' },
    { label: 'Sugar', value: '8 g' },
    { label: 'Sodium', value: '620 mg' },
  ],
  tags: ['High protein', 'Whole grains', 'Includes veggies'],
  suggestions: [
    'Add leafy greens to boost iron and fiber',
    'Swap creamy dressing for vinaigrette to reduce saturated fat',
  ],
};

const CalorieCheckScreen: React.FC<CalorieCheckScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const [mealPhoto, setMealPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [analysis, setAnalysis] = useState<typeof MOCK_ANALYSIS | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedDish, setDetectedDish] = useState<string>('—');
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>(['—']);

  const sampleIngredients = ['Lettuce', 'Parmesan', 'Cherry Tomatoes', 'Croutons'];
  const isDarkTheme = colors.background !== '#FFFFFF';
  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollContent: {
          paddingHorizontal: 20,
          paddingBottom: 120,
        },
        heroCard: {
          borderRadius: 28,
          padding: 20,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 20,
        },
        heroImage: {
          width: '100%',
          height: 320,
          borderRadius: 24,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        },
        ingredientTag: {
          position: 'absolute',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 16,
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        },
        ingredientText: {
          color: colors.text,
          fontWeight: '600',
          fontSize: 12,
        },
        photoActions: {
          flexDirection: 'row',
          gap: 12,
          marginTop: 14,
        },
        actionButton: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: 12,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
        },
        primaryActionButton: {
          flex: 1,
          borderRadius: 16,
          overflow: 'hidden',
        },
        analyzeButton: {
          marginTop: 14,
          borderRadius: 20,
          overflow: 'hidden',
        },
        analyzeButtonInner: {
          paddingVertical: 16,
          alignItems: 'center',
          justifyContent: 'center',
        },
        analyzeButtonText: {
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
        helperCard: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
          padding: 16,
          borderRadius: 18,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        },
        helperText: {
          flex: 1,
          color: colors.textSecondary,
          fontSize: 13,
          lineHeight: 20,
        },
        resultsWrapper: {
          marginTop: 22,
          padding: 18,
          borderRadius: 24,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        },
        resultHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        },
        caloriesValue: {
          fontSize: 42,
          fontWeight: '800',
          color: colors.text,
        },
        macroRow: {
          flexDirection: 'row',
          gap: 10,
          marginTop: 10,
        },
        macroBadge: {
          flex: 1,
          borderRadius: 16,
          padding: 12,
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
        },
        macroLabel: {
          fontSize: 12,
          fontWeight: '600',
        },
        macroValue: {
          marginTop: 6,
          fontSize: 20,
          fontWeight: '700',
          color: colors.text,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.text,
          marginTop: 18,
          marginBottom: 8,
        },
        nutrientRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 6,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        nutrientLabel: {
          color: colors.textSecondary,
        },
        nutrientValue: {
          color: colors.text,
          fontWeight: '600',
        },
        ingredientRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 8,
          alignItems: 'center',
        },
        ingredientName: {
          color: colors.text,
          fontWeight: '600',
        },
        ingredientMeta: {
          color: colors.textSecondary,
          fontSize: 12,
        },
        ingredientActions: {
          flexDirection: 'row',
          gap: 12,
          marginTop: 12,
        },
        pillButton: {
          flex: 1,
          paddingVertical: 12,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        },
        pillButtonText: {
          color: colors.text,
          fontWeight: '600',
        },
        solidButton: {
          flex: 1,
          borderRadius: 14,
          overflow: 'hidden',
        },
        solidButtonInner: {
          paddingVertical: 12,
          alignItems: 'center',
          justifyContent: 'center',
        },
        solidButtonText: {
          color: '#FFFFFF',
          fontWeight: '700',
        },
        errorText: {
          marginTop: 12,
          color: '#F87171',
          fontSize: 13,
          textAlign: 'center',
        },
      }),
    [colors, mealPhoto],
  );

  const handlePickPhoto = async (source: 'camera' | 'library') => {
    try {
      setError(null);
      const permissions =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissions.status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera and photo permissions to continue.');
        return;
      }

      const pickerResult =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({
              quality: 0.7,
              allowsEditing: true,
            })
          : await ImagePicker.launchImageLibraryAsync({
              quality: 0.7,
              allowsEditing: true,
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

      if (!pickerResult.canceled) {
        setMealPhoto(pickerResult.assets[0]);
        setAnalysis(null);
      }
    } catch (pickError) {
      console.error('❌ Calorie check image picker error:', pickError);
      setError('Unable to select photo. Please try again.');
    }
  };

  const handleAnalyze = async () => {
    if (!mealPhoto) {
      setError('Add a meal photo before analyzing.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    await new Promise((resolve) => setTimeout(resolve, 1600));

    // very lightweight heuristic to vary results by filename/uri hints
    const uriHint = mealPhoto?.uri?.toLowerCase() || '';
    let dish = 'Mixed Salad';
    let ingredients = sampleIngredients;
    let calories = 620;
    if (uriHint.includes('burger')) {
      dish = 'Beef Burger';
      ingredients = ['Bun', 'Beef Patty', 'Cheddar', 'Lettuce', 'Tomato'];
      calories = 750;
    } else if (uriHint.includes('pizza')) {
      dish = 'Margherita Pizza';
      ingredients = ['Crust', 'Mozzarella', 'Tomato', 'Basil', 'Olive Oil'];
      calories = 690;
    } else if (uriHint.includes('pasta')) {
      dish = 'Creamy Pasta';
      ingredients = ['Penne', 'Parmesan', 'Cream', 'Garlic', 'Parsley'];
      calories = 580;
    } else if (uriHint.includes('salad')) {
      dish = 'Caesar Salad';
      ingredients = ['Romaine', 'Parmesan', 'Croutons', 'Caesar Dressing', 'Tomatoes'];
      calories = 330;
    }

    setDetectedDish(dish);
    setDetectedIngredients(ingredients);

    setAnalysis({
      ...MOCK_ANALYSIS,
      calories,
      tags: ['AI detected', dish, 'Review ingredients'],
    });

    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setMealPhoto(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View>
            {mealPhoto ? (
              <Image source={{ uri: mealPhoto.uri }} style={styles.heroImage} resizeMode="cover" />
            ) : (
              <View style={styles.heroImage}>
                <ImageIcon size={56} color={colors.textSecondary} />
                <Text style={styles.placeholderTitle}>Add your meal photo</Text>
                <Text style={styles.placeholderHint}>Use a clear, top-down angle for best detection.</Text>
              </View>
            )}
          </View>

          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handlePickPhoto('camera')}>
              <Camera size={18} color={colors.text} />
              <Text style={{ fontWeight: '600', color: colors.text }}>Scan Food</Text>
            </TouchableOpacity>
            <LinearGradient colors={['#7C3AED', '#4F46E5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primaryActionButton}>
              <TouchableOpacity style={[styles.actionButton, { borderColor: 'transparent', backgroundColor: 'transparent' }]} onPress={() => handlePickPhoto('library')}>
                <ImageIcon size={18} color="#FFFFFF" />
                <Text style={{ fontWeight: '600', color: '#FFFFFF' }}>Library</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <LinearGradient colors={['#FF7E5F', '#9F7AEA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.analyzeButton, (isAnalyzing || !mealPhoto) && { opacity: 0.5 }]}>
            <TouchableOpacity style={styles.analyzeButtonInner} onPress={handleAnalyze} disabled={isAnalyzing || !mealPhoto}>
              {isAnalyzing ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.analyzeButtonText}>Analyze meal</Text>}
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.helperCard}>
          <Info size={18} color={colors.textSecondary} />
          <Text style={styles.helperText}>
            Snap a clear top-down photo. We’ll estimate calories, macros, and ingredients. Always confirm for clinical or dietary decisions.
          </Text>
        </View>

          {analysis && (
          <View style={styles.resultsWrapper}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{detectedDish}</Text>
                <Text style={styles.caloriesValue}>{analysis.calories}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={16} color="#F59E0B" />
                  <Text style={{ color: colors.text, fontWeight: '600' }}>Balanced</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 }}>
                  <Clock size={14} color={colors.textSecondary} />
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Just now</Text>
                </View>
              </View>
            </View>

            <View style={styles.macroRow}>
              {analysis.macros.map((macro) => (
                <View key={macro.label} style={[styles.macroBadge, { borderColor: `${macro.color}33` }]}>
                  <Text style={[styles.macroLabel, { color: macro.color }]}>{macro.label}</Text>
                  <Text style={styles.macroValue}>
                    {macro.value}
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}> {macro.unit}</Text>
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Micronutrients</Text>
            {analysis.micronutrients.map((nutrient) => (
              <View key={nutrient.label} style={styles.nutrientRow}>
                <Text style={styles.nutrientLabel}>{nutrient.label}</Text>
                <Text style={styles.nutrientValue}>{nutrient.value}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Ingredients</Text>
            {detectedIngredients.map((item) => (
              <View key={item} style={styles.ingredientRow}>
                <View>
                  <Text style={styles.ingredientName}>{item}</Text>
                  <Text style={styles.ingredientMeta}>Portion: 1 serving</Text>
                </View>
                <Text style={styles.ingredientMeta}>~20 cal</Text>
              </View>
            ))}

            <View style={styles.ingredientActions}>
              <TouchableOpacity style={styles.pillButton}>
                <Text style={styles.pillButtonText}>Fix Results</Text>
              </TouchableOpacity>
              <LinearGradient colors={['#111827', '#1F2937']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.solidButton}>
                <TouchableOpacity style={styles.solidButtonInner}>
                  <Text style={styles.solidButtonText}>Done</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        )}
        </ScrollView>
    </SafeAreaView>
  );
};

export default CalorieCheckScreen;

