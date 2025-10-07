import React from 'react';
import { router, Stack } from 'expo-router';
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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HealthArticlesScreen
        onBack={handleBack}
        onArticlePress={handleArticlePress}
      />
    </>
  );
}
