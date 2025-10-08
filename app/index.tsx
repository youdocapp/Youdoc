import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, SafeAreaView } from 'react-native';

export default function Index() {
  const router = useRouter();
  const segments = useSegments();
  const { user, loading } = useAuth();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!loading && !hasNavigated) {
      const inAuthGroup = segments[0] === '(auth)';
      
      if (user && !inAuthGroup) {
        console.log('✅ User authenticated, navigating to dashboard');
        router.replace('/dashboard');
        setHasNavigated(true);
      } else if (!user && !inAuthGroup) {
        console.log('❌ No user, navigating to onboarding');
        router.replace('/onboarding');
        setHasNavigated(true);
      }
    }
  }, [user, loading, segments, hasNavigated, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F7FFF" />
      </View>
    </SafeAreaView>
  );
}
