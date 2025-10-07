import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

interface AuthScreenProps {
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onBack }) => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, paddingHorizontal: 50, justifyContent: 'space-between', paddingTop: 120, paddingBottom: 48 }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 40,
            fontWeight: '700',
            color: '#1F2937',
            textAlign: 'left',
            marginBottom: 24,
            lineHeight: 48
          }}>
            Smarter <Text style={{ color: '#4F7FFF' }}>Health</Text> Starts Here
          </Text>

          <Text style={{
            fontSize: 17,
            color: '#6B7280',
            textAlign: 'left',
            lineHeight: 26,
            marginBottom: 48
          }}>
            Youdoc personalizes your experience based on your interests, data, and wearable devices.
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <TouchableOpacity 
            onPress={() => router.push('/signin')}
            style={{
              width: '100%',
              backgroundColor: '#4F7FFF',
              paddingVertical: 18,
              borderRadius: 28,
              alignItems: 'center'
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 17,
              fontWeight: '600'
            }}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/signup')}
            style={{
              width: '100%',
              backgroundColor: '#1F2937',
              paddingVertical: 18,
              borderRadius: 28,
              alignItems: 'center'
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 17,
              fontWeight: '600'
            }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
