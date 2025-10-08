import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  console.log('🔍 Index - Loading:', loading, 'User:', user ? 'exists' : 'null');

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <ActivityIndicator size="large" color="#4F7FFF" />
        <Text style={{ fontSize: 16, color: '#6B7280' }}>Loading...</Text>
      </View>
    );
  }

  if (user) {
    console.log('✅ User authenticated, redirecting to dashboard');
    return <Redirect href="/dashboard" />;
  }

  console.log('❌ No user, redirecting to onboarding');
  return <Redirect href="/onboarding" />;
}
