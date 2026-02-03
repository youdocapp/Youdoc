import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, Heart, Bookmark } from 'lucide-react-native';
import { articles as allArticlesData } from '@/constants/articles';
import { useTheme } from '@/contexts/ThemeContext';

interface ArticleDetailScreenProps {
  onBack: () => void;
  articleId?: string;
}

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ onBack, articleId }) => {
  const { colors } = useTheme();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const article = useMemo(() => {
    return allArticlesData.find(a => a.id === articleId) || allArticlesData[0];
  }, [articleId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.card
    },
    header: {
      backgroundColor: colors.background,
      paddingTop: 60,
      paddingBottom: 16,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: colors.border
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center'
    },
    actionButtonActive: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FEE2E2',
      alignItems: 'center',
      justifyContent: 'center'
    },
    scrollContent: {
      paddingBottom: 100
    },
    heroImage: {
      width: '100%',
      height: 250,
      backgroundColor: '#E5E7EB'
    },
    articleContent: {
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 32
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12
    },
    categoryIcon: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#8B5CF6',
      marginRight: 6
    },
    categoryText: {
      fontSize: 13,
      color: '#8B5CF6',
      fontWeight: '600'
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      lineHeight: 36
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
    },
    authorInfo: {
      flex: 1
    },
    authorName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4
    },
    metaDetails: {
      fontSize: 13,
      color: colors.textSecondary
    },
    readTime: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500'
    },
    body: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 26,
      marginBottom: 32
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={isLiked ? styles.actionButtonActive : styles.actionButton}
              onPress={() => setIsLiked(!isLiked)}
            >
              <Heart 
                size={20} 
                color={isLiked ? '#EF4444' : '#6B7280'} 
                fill={isLiked ? '#EF4444' : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark 
                size={20} 
                color={colors.textSecondary} 
                fill={isBookmarked ? colors.textSecondary : 'none'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Image
            source={{ uri: article.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.articleContent}>
            <View style={styles.categoryBadge}>
              <View style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{article.category}</Text>
            </View>

            <Text style={styles.title}>{article.title}</Text>

            <View style={styles.meta}>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{article.author}</Text>
                <Text style={styles.metaDetails}>{article.publishedDate}</Text>
              </View>
              <Text style={styles.readTime}>{article.readTime}</Text>
            </View>

            <Text style={styles.body}>{article.content}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ArticleDetailScreen;
