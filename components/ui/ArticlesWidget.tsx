import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from './Card';
import { router } from 'expo-router';

import { articles } from '@/constants/articles';

const DISPLAY_ARTICLES = articles.slice(0, 5);

export const ArticlesWidget: React.FC = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
    viewAll: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600'
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16
    },
    articleCard: {
        width: 260,
        padding: 0,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: 140,
        backgroundColor: colors.border
    },
    content: {
        padding: 16
    },
    category: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
        marginBottom: 4
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
        lineHeight: 22
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    duration: {
        fontSize: 12,
        color: colors.textSecondary
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Articles</Text>
        <TouchableOpacity onPress={() => router.push('/health-articles')}>
            <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DISPLAY_ARTICLES.map(article => (
            <Card key={article.id} style={styles.articleCard} onPress={() => router.push({ pathname: '/article-detail', params: { articleId: article.id } })}>
                <Image source={{ uri: article.image }} style={styles.image} resizeMode="cover" />
                <View style={styles.content}>
                    <Text style={styles.category}>{article.category.toUpperCase()}</Text>
                    <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                    <View style={styles.footer}>
                        <Text style={styles.duration}>{article.readTime}</Text>
                    </View>
                </View>
            </Card>
        ))}
      </ScrollView>
    </View>
  );
};
