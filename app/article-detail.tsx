import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import ArticleDetailScreen from '../components/ArticleDetailScreen';

export default function ArticleDetailRoute() {
  const { articleId } = useLocalSearchParams<{ articleId: string }>();

  const handleBack = () => {
    router.back();
  };

  return (
    <ArticleDetailScreen
      articleId={articleId || ''}
      onBack={handleBack}
    />
  );
}
