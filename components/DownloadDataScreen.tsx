import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ChevronLeft, Download, FileText, CheckCircle, Calendar, Activity, Pill, FileCheck } from 'lucide-react-native';

interface DownloadDataScreenProps {
  onBack: () => void;
}

interface DataCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
}

const DownloadDataScreen: React.FC<DownloadDataScreenProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<DataCategory[]>([
    {
      id: 'profile',
      name: 'Profile Information',
      description: 'Personal details, contact info',
      icon: <FileText size={20} color="#4F7FFF" />,
      selected: true
    },
    {
      id: 'medications',
      name: 'Medications',
      description: 'All medication records and schedules',
      icon: <Pill size={20} color="#10B981" />,
      selected: true
    },
    {
      id: 'appointments',
      name: 'Appointments',
      description: 'Past and upcoming appointments',
      icon: <Calendar size={20} color="#F59E0B" />,
      selected: true
    },
    {
      id: 'health-records',
      name: 'Health Records',
      description: 'Medical history and documents',
      icon: <FileCheck size={20} color="#EF4444" />,
      selected: true
    },
    {
      id: 'activity',
      name: 'Activity Data',
      description: 'App usage and activity logs',
      icon: <Activity size={20} color="#A855F7" />,
      selected: false
    }
  ]);

  const toggleCategory = (id: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, selected: !cat.selected } : cat
    ));
  };

  const handleDownload = () => {
    const selectedCategories = categories.filter(cat => cat.selected);
    
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one data category to download');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Download Started',
        'Your data is being prepared. You will receive an email with a download link within 24 hours.',
        [{ text: 'OK', onPress: onBack }]
      );
    }, 2000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB'
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: '#FFFFFF',
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
      color: '#1F2937'
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 24
    },
    infoCard: {
      backgroundColor: '#EEF2FF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#4F7FFF',
      marginBottom: 8
    },
    infoText: {
      fontSize: 14,
      color: '#4F7FFF',
      lineHeight: 20
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: '#9CA3AF',
      marginBottom: 12,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5
    },
    categoryCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      marginBottom: 12,
      overflow: 'hidden' as const,
      borderWidth: 2,
      borderColor: '#E5E7EB'
    },
    categoryCardSelected: {
      borderColor: '#4F7FFF'
    },
    categoryContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      padding: 16
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: 12
    },
    categoryInfo: {
      flex: 1
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#1F2937',
      marginBottom: 2
    },
    categoryDescription: {
      fontSize: 13,
      color: '#9CA3AF'
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#E5E7EB',
      alignItems: 'center' as const,
      justifyContent: 'center' as const
    },
    checkboxSelected: {
      backgroundColor: '#4F7FFF',
      borderColor: '#4F7FFF'
    },
    formatCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginTop: 24,
      marginBottom: 24
    },
    formatTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: '#1F2937',
      marginBottom: 8
    },
    formatText: {
      fontSize: 14,
      color: '#6B7280',
      lineHeight: 20
    },
    downloadButton: {
      backgroundColor: '#4F7FFF',
      borderRadius: 12,
      height: 52,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginTop: 8
    },
    downloadButtonDisabled: {
      backgroundColor: '#E5E7EB'
    },
    downloadButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#FFFFFF',
      marginLeft: 8
    },
    downloadButtonTextDisabled: {
      color: '#9CA3AF'
    }
  });

  const selectedCount = categories.filter(cat => cat.selected).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Download My Data</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Data Export</Text>
            <Text style={styles.infoText}>
              Select the data you want to download. Your data will be prepared and sent to your registered email address within 24 hours.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>SELECT DATA TO DOWNLOAD</Text>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                category.selected && styles.categoryCardSelected
              ]}
              onPress={() => toggleCategory(category.id)}
            >
              <View style={styles.categoryContent}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: category.selected ? '#EEF2FF' : '#F9FAFB' }
                ]}>
                  {category.icon}
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  category.selected && styles.checkboxSelected
                ]}>
                  {category.selected && (
                    <CheckCircle size={16} color="#FFFFFF" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.formatCard}>
            <Text style={styles.formatTitle}>Export Format</Text>
            <Text style={styles.formatText}>
              Your data will be exported as a ZIP file containing JSON and PDF files for easy viewing and portability.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.downloadButton,
              (selectedCount === 0 || isLoading) && styles.downloadButtonDisabled
            ]}
            onPress={handleDownload}
            disabled={selectedCount === 0 || isLoading}
          >
            <Download size={20} color={selectedCount === 0 || isLoading ? '#9CA3AF' : '#FFFFFF'} />
            <Text style={[
              styles.downloadButtonText,
              (selectedCount === 0 || isLoading) && styles.downloadButtonTextDisabled
            ]}>
              {isLoading ? 'Preparing Download...' : `Download ${selectedCount} ${selectedCount === 1 ? 'Category' : 'Categories'}`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DownloadDataScreen;
