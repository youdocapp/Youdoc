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
            onPress={() => router.push('/signup')}
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
              Sign up with Email
            </Text>
          </TouchableOpacity>

          <Text style={{
            textAlign: 'center',
            color: '#6B7280',
            fontSize: 15,
            fontWeight: '500'
          }}>
            Or
          </Text>

          <TouchableOpacity 
            style={{
              width: '100%',
              backgroundColor: '#1F2937',
              paddingVertical: 18,
              borderRadius: 28,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 12
            }}
          >
            <Text style={{ fontSize: 20 }}>🔍</Text>
            <Text style={{
              color: 'white',
              fontSize: 17,
              fontWeight: '600'
            }}>
              Sign up with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{
              width: '100%',
              backgroundColor: '#1F2937',
              paddingVertical: 18,
              borderRadius: 28,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 12
            }}
          >
            <Text style={{ fontSize: 20 }}>🍎</Text>
            <Text style={{
              color: 'white',
              fontSize: 17,
              fontWeight: '600'
            }}>
              Sign up with Apple
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
            <Text style={{ color: '#6B7280', fontSize: 15 }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signin')}>
              <Text style={{ color: '#1F2937', fontSize: 15, fontWeight: '600' }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
