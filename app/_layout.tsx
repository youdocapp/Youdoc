import { DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useMemo, useState } from 'react';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import { 
  useFonts,
  ReadexPro_200ExtraLight,
  ReadexPro_300Light,
  ReadexPro_400Regular,
  ReadexPro_500Medium,
  ReadexPro_600SemiBold,
  ReadexPro_700Bold
} from '@expo-google-fonts/readex-pro';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { MedicationProvider } from '../contexts/MedicationContext';
import { UserProvider } from '../contexts/UserContext';
import { AuthProvider } from '../contexts/AuthContext';
import { HealthTrackerProvider } from '../contexts/HealthTrackerContext';
import { EmergencyContactsProvider } from '../contexts/EmergencyContactsContext';
import { HealthRecordsProvider } from '../contexts/HealthRecordsContext';
import { MedicalHistoryProvider } from '../contexts/MedicalHistoryContext';

SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs([
  'source.uri should not be an empty string',
]);

function AppContent() {
  const { colors } = useTheme();
  
  const navigationTheme = useMemo(() => ({
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    }
  }), [colors]);
  
  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="symptom-checker" options={{ headerShown: false }} />
        <Stack.Screen name="my-medication" options={{ headerShown: false }} />
        <Stack.Screen name="add-medication" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="health-records" options={{ headerShown: false }} />
        <Stack.Screen name="see-doctor" options={{ headerShown: false }} />
        <Stack.Screen name="emergency-contacts" options={{ headerShown: false }} />
        <Stack.Screen name="medical-history" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
        <Stack.Screen name="health-support" options={{ headerShown: false }} />
        <Stack.Screen name="subscription" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen name="health-articles" options={{ headerShown: false }} />
        <Stack.Screen name="article-detail" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
        <Stack.Screen name="terms-of-service" options={{ headerShown: false }} />
        <Stack.Screen name="hipaa-compliance" options={{ headerShown: false }} />
        <Stack.Screen name="medical-grocery" options={{ headerShown: false }} />
        <Stack.Screen name="connected-devices" options={{ headerShown: false }} />
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
        <Stack.Screen name="download-data" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar 
        style={colors.statusBarStyle} 
        backgroundColor={colors.headerBackground} 
        translucent={false} 
      />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  
  const [loaded, error] = useFonts({
    ReadexPro_200ExtraLight,
    ReadexPro_300Light,
    ReadexPro_400Regular,
    ReadexPro_500Medium,
    ReadexPro_600SemiBold,
    ReadexPro_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <MedicationProvider>
              <HealthTrackerProvider>
                <EmergencyContactsProvider>
                  <HealthRecordsProvider>
                    <MedicalHistoryProvider>
                      <AppContent />
                    </MedicalHistoryProvider>
                  </HealthRecordsProvider>
                </EmergencyContactsProvider>
              </HealthTrackerProvider>
            </MedicationProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
