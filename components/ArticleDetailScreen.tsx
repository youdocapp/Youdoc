import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, Heart, Bookmark, MessageCircle, Send } from 'lucide-react-native';
import { articles as allArticlesData } from '@/constants/articles';
import { useTheme } from '@/contexts/ThemeContext';

interface ArticleDetailScreenProps {
  onBack: () => void;
  articleId?: string;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ onBack, articleId }) => {
  const { colors } = useTheme();
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?img=12',
      text: 'Great article! Very informative and helpful.',
      timestamp: '2 hours ago',
      likes: 5
    },
    {
      id: '2',
      author: 'Emily Johnson',
      avatar: 'https://i.pravatar.cc/150?img=45',
      text: 'Thanks for sharing this. I learned a lot from reading it.',
      timestamp: '5 hours ago',
      likes: 3
    },
    {
      id: '3',
      author: 'Michael Brown',
      avatar: 'https://i.pravatar.cc/150?img=33',
      text: 'Could you provide more information about the research mentioned?',
      timestamp: '1 day ago',
      likes: 2
    }
  ]);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const article = useMemo(() => {
    return allArticlesData.find(a => a.id === articleId) || allArticlesData[0];
  }, [articleId]);

  const handleSendComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: 'You',
        avatar: 'https://i.pravatar.cc/150?img=68',
        text: commentText.trim(),
        timestamp: 'Just now',
        likes: 0
      };
      setComments([newComment, ...comments]);
      setCommentText('');
    }
  };

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
    commentsSection: {
      backgroundColor: colors.background,
      marginTop: 8,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 24
    },
    commentsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20
    },
    commentsTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginLeft: 8
    },
    commentCard: {
      marginBottom: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
    },
    commentHeader: {
      flexDirection: 'row',
      marginBottom: 12
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#E5E7EB',
      marginRight: 12
    },
    commentInfo: {
      flex: 1
    },
    commentAuthor: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2
    },
    commentTimestamp: {
      fontSize: 12,
      color: colors.textSecondary
    },
    commentText: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 8
    },
    commentFooter: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    likeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginLeft: -8
    },
    likeCount: {
      fontSize: 13,
      color: colors.textSecondary,
      marginLeft: 4
    },
    inputContainer: {
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: 20,
      paddingVertical: 12,
      paddingBottom: Platform.OS === 'ios' ? 32 : 12
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 8
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      paddingVertical: 8,
      maxHeight: 100
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#4F7FFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8
    },
    sendButtonDisabled: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8
    }
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

          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <MessageCircle size={24} color="#4F7FFF" />
              <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
            </View>

            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Image
                    source={{ uri: comment.avatar }}
                    style={styles.avatar}
                  />
                  <View style={styles.commentInfo}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                  </View>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
                <View style={styles.commentFooter}>
                  <TouchableOpacity style={styles.likeButton}>
                    <Heart size={16} color="#9CA3AF" />
                    <Text style={styles.likeCount}>{comment.likes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity 
              style={commentText.trim() ? styles.sendButton : styles.sendButtonDisabled}
              onPress={handleSendComment}
              disabled={!commentText.trim()}
            >
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ArticleDetailScreen;
