import React from 'react';
import { router } from 'expo-router';
import HealthArticlesScreen from '../components/HealthArticlesScreen';

export default function HealthArticlesRoute() {
  const handleBack = () => {
    router.back();
  };

  const handleArticlePress = (articleId: string) => {
    router.push({
      pathname: '/article-detail',
      params: { articleId }
    });
  };

  return (
    <HealthArticlesScreen
      onBack={handleBack}
      onArticlePress={handleArticlePress}
    />
  );
}
