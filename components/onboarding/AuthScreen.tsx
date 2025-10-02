import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuthTheme } from '../../contexts/AuthThemeContext';
import { useRouter } from 'expo-router';

interface AuthScreenProps {
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onBack }) => {
  const { colors } = useAuthTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingVertical: 48 }}>
        <TouchableOpacity onPress={onBack} style={{ alignSelf: 'flex-start' }}>
          <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32
          }}>
            <Text style={{ fontSize: 48, color: 'white' }}>🔐</Text>
          </View>

          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            fontFamily: 'ReadexPro-Medium',
            textAlign: 'center',
            marginBottom: 16
          }}>
            Secure & Private
          </Text>

          <Text style={{
            fontSize: 16,
            color: colors.textSecondary,
            fontFamily: 'ReadexPro-Medium',
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 48
          }}>
            Your health data is encrypted and secure. We never share your information without your permission.
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <TouchableOpacity 
            onPress={() => router.push('/signup')}
            style={{
              width: '100%',
              backgroundColor: colors.primary,
              paddingVertical: 16,
              borderRadius: 25,
              alignItems: 'center'
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '500',
              fontFamily: 'ReadexPro-Medium'
            }}>
              Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/signin')}
            style={{
              width: '100%',
              backgroundColor: colors.inputBackground,
              paddingVertical: 16,
              borderRadius: 25,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border
            }}
          >
            <Text style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: '500',
              fontFamily: 'ReadexPro-Medium'
            }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
