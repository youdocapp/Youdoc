import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, Bookmark } from 'lucide-react-native';
import { articles as allArticlesData, categories as categoriesData } from '@/constants/articles';
import { useTheme } from '@/contexts/ThemeContext';

interface HealthArticlesScreenProps {
  onBack: () => void;
  onArticlePress?: (articleId: string) => void;
}

const HealthArticlesScreen: React.FC<HealthArticlesScreenProps> = ({ onBack, onArticlePress }) => {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Articles');

  const filteredArticles = useMemo(() => {
    let filtered = allArticlesData;

    if (selectedCategory !== 'All Articles') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const featuredArticle = allArticlesData.find(article => article.featured);
  const latestArticles = filteredArticles.filter(article => !article.featured);

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
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center'
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
    searchButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center'
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
    featuredSection: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 16
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16
    },
    featuredCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4
    },
    featuredImage: {
      width: '100%',
      height: 200,
      backgroundColor: '#E5E7EB'
    },
    featuredContent: {
      padding: 16
    },
    featuredBadge: {
      alignSelf: 'flex-start',
      backgroundColor: '#EF4444',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginBottom: 12
    },
    featuredBadgeText: {
      fontSize: 11,
      color: '#FFFFFF',
      fontWeight: '700',
      textTransform: 'uppercase'
    },
    featuredTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      lineHeight: 28
    },
    featuredDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 12
    },
    featuredFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    featuredAuthor: {
      fontSize: 13,
      color: '#4F7FFF',
      fontWeight: '600'
    },
    featuredReadTime: {
      fontSize: 13,
      color: '#9CA3AF'
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
    articlesSection: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 100
    },
    articleCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2
    },
    articleCardContent: {
      flexDirection: 'row',
      padding: 12
    },
    articleImage: {
      width: 100,
      height: 100,
      borderRadius: 12,
      backgroundColor: '#E5E7EB',
      marginRight: 12
    },
    articleInfo: {
      flex: 1,
      justifyContent: 'space-between'
    },
    articleTop: {
      flex: 1
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6
    },
    categoryIcon: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#8B5CF6',
      marginRight: 6
    },
    categoryText: {
      fontSize: 12,
      color: '#8B5CF6',
      fontWeight: '600'
    },
    articleTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
      lineHeight: 22
    },
    articleDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 8
    },
    articleFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    articleAuthor: {
      fontSize: 12,
      color: '#4F7FFF',
      fontWeight: '500'
    },
    articleReadTime: {
      fontSize: 12,
      color: '#9CA3AF'
    },
    bookmarkButton: {
      padding: 8
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 16
    }
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Health Articles</Text>
          <View style={styles.searchButton} />
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles, topics, or authors..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!searchQuery && featuredArticle && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured Article</Text>
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => onArticlePress?.(featuredArticle.id)}
            >
              <Image
                source={{ uri: featuredArticle.image }}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>FEATURED</Text>
                </View>
                <Text style={styles.featuredTitle}>{featuredArticle.title}</Text>
                <Text style={styles.featuredDescription}>
                  {featuredArticle.description}
                </Text>
                <View style={styles.featuredFooter}>
                  <Text style={styles.featuredAuthor}>By {featuredArticle.author}</Text>
                  <Text style={styles.featuredReadTime}>{featuredArticle.readTime}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categoriesData.map((category) => (
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

        <View style={styles.articlesSection}>
          <Text style={styles.sectionTitle}>
            Latest Articles ({filteredArticles.length})
          </Text>

          {filteredArticles.length === 0 ? (
            <View style={styles.emptyState}>
              <Search size={48} color={colors.border} />
              <Text style={styles.emptyStateText}>No articles found</Text>
            </View>
          ) : (
            latestArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => onArticlePress?.(article.id)}
              >
                <View style={styles.articleCardContent}>
                  <Image
                    source={{ uri: article.image }}
                    style={styles.articleImage}
                    resizeMode="cover"
                  />
                  <View style={styles.articleInfo}>
                    <View style={styles.articleTop}>
                      <View style={styles.categoryBadge}>
                        <View style={styles.categoryIcon} />
                        <Text style={styles.categoryText}>{article.category}</Text>
                      </View>
                      <Text style={styles.articleTitle} numberOfLines={2}>
                        {article.title}
                      </Text>
                      <Text style={styles.articleDescription} numberOfLines={2}>
                        {article.description}
                      </Text>
                    </View>
                    <View style={styles.articleFooter}>
                      <Text style={styles.articleAuthor}>By {article.author}</Text>
                      <Text style={styles.articleReadTime}>{article.readTime}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.bookmarkButton}>
                    <Bookmark size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthArticlesScreen;
