import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Index() {
  const [mounted, setMounted] = React.useState(false);
  const { user, loading } = useAuth();

  React.useEffect(() => {
    setMounted(true);
    console.log('🔍 Index mounted');
    console.log('🔍 Index - Loading:', loading, 'User:', user ? 'exists' : 'null');
    console.log('🔍 Environment check:');
    console.log('  SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
    console.log('  SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  }, [loading, user]);

  if (!mounted || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4F7FFF" />
        <Text style={styles.loadingText}>Loading...</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
