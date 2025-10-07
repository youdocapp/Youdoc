import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { ChevronLeft, Search, BookOpen } from 'lucide-react-native';
import { glossaryTerms, glossaryCategories, GlossaryTerm } from '@/constants/glossary';
import { useTheme } from '@/contexts/ThemeContext';

interface HealthGlossaryScreenProps {
  onBack: () => void;
  initialSearchQuery?: string;
}

const HealthGlossaryScreen: React.FC<HealthGlossaryScreenProps> = ({ onBack, initialSearchQuery = '' }) => {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Terms');
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    let filtered = glossaryTerms;

    if (selectedCategory !== 'All Terms') {
      filtered = filtered.filter(term => term.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(term => 
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query) ||
        term.category.toLowerCase().includes(query) ||
        term.relatedTerms?.some(related => related.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => a.term.localeCompare(b.term));
  }, [selectedCategory, searchQuery]);

  const groupedTerms = useMemo(() => {
    const groups: { [key: string]: GlossaryTerm[] } = {};
    
    filteredTerms.forEach(term => {
      const firstLetter = term.term[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });

    return groups;
  }, [filteredTerms]);

  const alphabetLetters = Object.keys(groupedTerms).sort();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      backgroundColor: colors.background,
      paddingTop: 16,
      paddingBottom: 20,
      paddingHorizontal: 20
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center'
    },
    placeholder: {
      width: 44,
      height: 44
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text
    },
    content: {
      flex: 1
    },
    categoriesSection: {
      paddingVertical: 16,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border
    },
    categoriesScroll: {
      paddingHorizontal: 20
    },
    categoryChip: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      marginRight: 12
    },
    categoryChipActive: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: '#4F7FFF',
      marginRight: 12
    },
    categoryChipText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600'
    },
    categoryChipTextActive: {
      fontSize: 14,
      color: '#FFFFFF',
      fontWeight: '600'
    },
    termsSection: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 100
    },
    resultsCount: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 20,
      fontWeight: '500'
    },
    alphabetGroup: {
      marginBottom: 24
    },
    alphabetLetter: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 12
    },
    termCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2
    },
    termHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 12
    },
    termIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#EEF2FF',
      alignItems: 'center',
      justifyContent: 'center'
    },
    termInfo: {
      flex: 1
    },
    termName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4
    },
    termCategory: {
      fontSize: 13,
      color: '#4F7FFF',
      fontWeight: '500'
    },
    termDefinition: {
      paddingHorizontal: 16,
      paddingBottom: 16
    },
    definitionText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 12
    },
    relatedTermsContainer: {
      marginTop: 8
    },
    relatedTermsLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8
    },
    relatedTermsChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8
    },
    relatedTermChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: isDark ? '#374151' : '#F3F4F6'
    },
    relatedTermText: {
      fontSize: 12,
      color: '#4F7FFF',
      fontWeight: '500'
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60
    },
    emptyStateIcon: {
      marginBottom: 16
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center'
    }
  });

  const toggleTerm = (termId: string) => {
    setExpandedTermId(expandedTermId === termId ? null : termId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Health Glossary</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medical terms..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {glossaryCategories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={selectedCategory === category.name ? styles.categoryChipActive : styles.categoryChip}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Text style={selectedCategory === category.name ? styles.categoryChipTextActive : styles.categoryChipText}>
                {category.name} ({category.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.termsSection}>
          <Text style={styles.resultsCount}>
            {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'} found
          </Text>

          {filteredTerms.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={48} color={colors.border} style={styles.emptyStateIcon} />
              <Text style={styles.emptyStateText}>
                No terms found.{'\n'}Try a different search or category.
              </Text>
            </View>
          ) : (
            alphabetLetters.map((letter) => (
              <View key={letter} style={styles.alphabetGroup}>
                <Text style={styles.alphabetLetter}>{letter}</Text>
                {groupedTerms[letter].map((term) => (
                  <TouchableOpacity
                    key={term.id}
                    style={styles.termCard}
                    onPress={() => toggleTerm(term.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.termHeader}>
                      <View style={styles.termIconContainer}>
                        <BookOpen size={20} color="#4F7FFF" />
                      </View>
                      <View style={styles.termInfo}>
                        <Text style={styles.termName}>{term.term}</Text>
                        <Text style={styles.termCategory}>{term.category}</Text>
                      </View>
                    </View>
                    
                    {expandedTermId === term.id && (
                      <View style={styles.termDefinition}>
                        <Text style={styles.definitionText}>{term.definition}</Text>
                        
                        {term.relatedTerms && term.relatedTerms.length > 0 && (
                          <View style={styles.relatedTermsContainer}>
                            <Text style={styles.relatedTermsLabel}>Related Terms:</Text>
                            <View style={styles.relatedTermsChips}>
                              {term.relatedTerms.map((relatedTerm, index) => (
                                <View key={index} style={styles.relatedTermChip}>
                                  <Text style={styles.relatedTermText}>{relatedTerm}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthGlossaryScreen;
