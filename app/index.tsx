import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, SafeAreaView } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('🔍 Index - Loading:', loading, 'User:', user ? 'exists' : 'null');
    if (!loading) {
      if (user) {
        console.log('✅ User authenticated, navigating to dashboard');
        router.replace('/dashboard');
      } else {
        console.log('❌ No user, navigating to onboarding');
        router.replace('/onboarding');
      }
    }
  }, [user, loading]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F7FFF" />
      </View>
    </SafeAreaView>
  );
}
