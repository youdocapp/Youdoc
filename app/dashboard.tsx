import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from 'expo-router';

export default function DashboardPage() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48 }}>
        <Text style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: 16
        }}>
          Dashboard
        </Text>

        <Text style={{
          fontSize: 16,
          color: colors.textSecondary,
          marginBottom: 32
        }}>
          Welcome to YouDoc! Your health dashboard is coming soon.
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/onboarding')}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 16
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            View Onboarding
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/signin')}
          style={{
            backgroundColor: colors.card,
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border
          }}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
