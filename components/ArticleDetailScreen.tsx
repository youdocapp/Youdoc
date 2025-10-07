import React, { useState, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, Heart, Bookmark, MessageCircle, Send } from 'lucide-react-native';

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

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  content: string;
  publishedDate: string;
}

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ onBack, articleId }) => {
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

  const articles: Article[] = useMemo(() => [
    {
      id: '1',
      title: '5 Ways to Manage Stress Daily',
      description: 'Learn effective techniques to manage daily stress and improve your mental wellbeing.',
      category: 'Mental Health',
      author: 'Dr. Sarah Chen',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
      publishedDate: 'January 15, 2024',
      content: 'Stress is an inevitable part of modern life, but managing it effectively can significantly improve your overall wellbeing. Here are five evidence-based strategies to help you manage stress on a daily basis.\n\n1. Practice Mindfulness Meditation\nTaking just 10 minutes each day to practice mindfulness can reduce stress hormones and improve your ability to handle challenging situations. Focus on your breath and observe your thoughts without judgment.\n\n2. Regular Physical Exercise\nExercise releases endorphins, which are natural mood elevators. Aim for at least 30 minutes of moderate activity most days of the week.\n\n3. Maintain a Consistent Sleep Schedule\nQuality sleep is crucial for stress management. Try to go to bed and wake up at the same time each day, even on weekends.\n\n4. Connect with Others\nSocial support is a powerful stress buffer. Make time to connect with friends and family regularly.\n\n5. Set Boundaries\nLearn to say no to commitments that will overextend you. Protecting your time and energy is essential for managing stress.'
    },
    {
      id: '2',
      title: 'Understanding Heart Health',
      description: 'Essential information about maintaining a healthy heart and preventing cardiovascular disease.',
      category: 'Lifestyle',
      author: 'Dr. Michael Johnson',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
      publishedDate: 'January 12, 2024',
      content: 'Your heart is one of the most vital organs in your body, and taking care of it should be a top priority. Understanding the basics of heart health can help you make informed decisions about your lifestyle and medical care.\n\nThe heart pumps blood throughout your body, delivering oxygen and nutrients to your tissues and removing waste products. Maintaining cardiovascular health involves several key factors including diet, exercise, stress management, and regular medical checkups.\n\nKey factors for heart health include maintaining a healthy weight, eating a balanced diet rich in fruits and vegetables, exercising regularly, managing stress, avoiding smoking, and limiting alcohol consumption.'
    },
    {
      id: '3',
      title: 'Nutrition Basics for Beginners',
      description: 'A comprehensive guide to understanding macronutrients and building a balanced diet.',
      category: 'Nutrition',
      author: 'Dr. Emily Rodriguez',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
      publishedDate: 'January 10, 2024',
      content: 'Understanding nutrition doesn\'t have to be complicated. This guide will help you understand the basics of macronutrients and how to build a balanced diet that supports your health goals.\n\nMacronutrients are the nutrients your body needs in large amounts: carbohydrates, proteins, and fats. Each plays a unique and important role in your body.\n\nCarbohydrates are your body\'s primary energy source. Focus on complex carbs like whole grains, fruits, and vegetables rather than simple sugars.\n\nProteins are essential for building and repairing tissues. Include a variety of protein sources in your diet, including lean meats, fish, legumes, and dairy.\n\nHealthy fats are crucial for hormone production and nutrient absorption. Include sources like avocados, nuts, seeds, and olive oil in your diet.'
    }
  ], []);

  const article = useMemo(() => {
    return articles.find(a => a.id === articleId) || articles[0];
  }, [articleId, articles]);

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
      backgroundColor: '#F9FAFB'
    },
    header: {
      backgroundColor: '#FFFFFF',
      paddingTop: 60,
      paddingBottom: 16,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6'
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
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
      backgroundColor: '#F3F4F6',
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
      backgroundColor: '#FFFFFF',
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
      color: '#1F2937',
      marginBottom: 16,
      lineHeight: 36
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6'
    },
    authorInfo: {
      flex: 1
    },
    authorName: {
      fontSize: 15,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 4
    },
    metaDetails: {
      fontSize: 13,
      color: '#9CA3AF'
    },
    readTime: {
      fontSize: 13,
      color: '#6B7280',
      fontWeight: '500'
    },
    body: {
      fontSize: 16,
      color: '#374151',
      lineHeight: 26,
      marginBottom: 32
    },
    commentsSection: {
      backgroundColor: '#FFFFFF',
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
      color: '#1F2937',
      marginLeft: 8
    },
    commentCard: {
      marginBottom: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6'
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
      color: '#1F2937',
      marginBottom: 2
    },
    commentTimestamp: {
      fontSize: 12,
      color: '#9CA3AF'
    },
    commentText: {
      fontSize: 15,
      color: '#374151',
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
      color: '#6B7280',
      marginLeft: 4
    },
    inputContainer: {
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      paddingHorizontal: 20,
      paddingVertical: 12,
      paddingBottom: Platform.OS === 'ios' ? 32 : 12
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 8
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: '#1F2937',
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
      backgroundColor: '#E5E7EB',
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
            <ChevronLeft size={24} color="#1F2937" />
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
                color="#6B7280" 
                fill={isBookmarked ? '#6B7280' : 'none'}
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
              placeholderTextColor="#9CA3AF"
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
