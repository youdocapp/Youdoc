import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ArticleDetailScreenProps {
  onBack: () => void;
  articleId?: string;
}

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ onBack, articleId }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 24,
      paddingTop: 48,
      paddingBottom: 24
    },
    backButton: {
      fontSize: 24,
      color: colors.text
    },
    content: {
      paddingHorizontal: 24
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      color: colors.text,
      marginBottom: 16
    },
    meta: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24
    },
    body: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Health Article</Text>
        <Text style={styles.meta}>Published on January 1, 2024</Text>
        <Text style={styles.body}>
          This is a placeholder for the article content. The actual article content would be loaded based on the articleId: {articleId}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleDetailScreen;
