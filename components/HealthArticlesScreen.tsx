import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { ChevronLeft, Search, Bookmark } from 'lucide-react-native';

interface HealthArticlesScreenProps {
  onBack: () => void;
  onArticlePress?: (articleId: string) => void;
}

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const HealthArticlesScreen: React.FC<HealthArticlesScreenProps> = ({ onBack, onArticlePress }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Articles');

  const categories = [
    { name: 'All Articles', count: 24 },
    { name: 'Nutrition', count: 8 },
    { name: 'Fitness', count: 6 },
    { name: 'Mental Health', count: 5 },
    { name: 'Lifestyle', count: 5 }
  ];

  const allArticles: Article[] = [
    {
      id: '1',
      title: '5 Ways to Manage Stress Daily',
      description: 'Learn effective techniques to manage daily stress and improve your mental wellbeing.',
      category: 'Mental Health',
      author: 'Dr. Sarah Chen',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
      featured: true
    },
    {
      id: '2',
      title: 'Understanding Heart Health',
      description: 'Essential information about maintaining a healthy heart and preventing cardiovascular disease.',
      category: 'Lifestyle',
      author: 'Dr. Michael Johnson',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80'
    },
    {
      id: '3',
      title: 'Nutrition Basics for Beginners',
      description: 'A comprehensive guide to understanding macronutrients and building a balanced diet.',
      category: 'Nutrition',
      author: 'Dr. Emily Rodriguez',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80'
    },
    {
      id: '4',
      title: '10 Healthy Habits to Start Today',
      description: 'Discover simple yet significant lifestyle changes for better health.',
      category: 'Lifestyle',
      author: 'Dr. James Wilson',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
    },
    {
      id: '5',
      title: 'The Benefits of Regular Exercise',
      description: 'How consistent physical activity can transform your health and wellbeing.',
      category: 'Fitness',
      author: 'Dr. Lisa Anderson',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'
    },
    {
      id: '6',
      title: 'Sleep Hygiene: Better Rest Tonight',
      description: 'Practical tips for improving your sleep quality and establishing healthy sleep patterns.',
      category: 'Mental Health',
      author: 'Dr. Robert Taylor',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80'
    },
    {
      id: '7',
      title: 'Meal Prep Made Simple',
      description: 'Time-saving strategies for preparing healthy meals throughout the week.',
      category: 'Nutrition',
      author: 'Dr. Amanda Lee',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80'
    },
    {
      id: '8',
      title: 'Yoga for Beginners',
      description: 'Start your yoga journey with these foundational poses and breathing techniques.',
      category: 'Fitness',
      author: 'Dr. Sarah Chen',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
    }
  ];

  const filteredArticles = useMemo(() => {
    let filtered = allArticles;

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

  const featuredArticle = allArticles.find(article => article.featured);
  const latestArticles = filteredArticles.filter(article => !article.featured);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB'
    },
    header: {
      backgroundColor: '#FFFFFF',
      paddingTop: 60,
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
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1F2937',
      position: 'absolute',
      left: 0,
      right: 0,
      textAlign: 'center'
    },
    searchButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center'
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: '#1F2937'
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
      color: '#1F2937',
      marginBottom: 16
    },
    featuredCard: {
      backgroundColor: '#FFFFFF',
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
      color: '#1F2937',
      marginBottom: 8,
      lineHeight: 28
    },
    featuredDescription: {
      fontSize: 14,
      color: '#6B7280',
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
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#F3F4F6'
    },
    categoriesScroll: {
      paddingHorizontal: 20
    },
    categoryChip: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
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
      color: '#6B7280',
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
      backgroundColor: '#FFFFFF',
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
      color: '#1F2937',
      marginBottom: 4,
      lineHeight: 22
    },
    articleDescription: {
      fontSize: 13,
      color: '#6B7280',
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
      color: '#9CA3AF',
      marginTop: 16
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Health Articles</Text>
          <View style={styles.searchButton} />
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles, topics, or authors..."
            placeholderTextColor="#9CA3AF"
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
            {categories.map((category) => (
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
              <Search size={48} color="#D1D5DB" />
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
                    <Bookmark size={20} color="#9CA3AF" />
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
