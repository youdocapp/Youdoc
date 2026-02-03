import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Svg, Path } from 'react-native-svg';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAuth } from '../../contexts/AuthContext';
import Constants from 'expo-constants';

// Complete the OAuth session when redirected back
WebBrowser.maybeCompleteAuthSession();

interface AuthScreenProps {
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onBack }) => {
  const router = useRouter();
  const { googleAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // DIRECT BROWSER-BASED OAUTH (Bypasses unreliable Expo proxy)
  const nativeRedirectUri = AuthSession.makeRedirectUri({
    scheme: 'youdoc',
    path: 'oauth',
  });
  
  // Log environment info on mount
  useEffect(() => {
    console.log('\n=== AUTHSCREEN GOOGLE OAUTH CONFIG ===');
    console.log('📱 Platform:', Platform.OS);
    console.log('🏠 App Ownership:', Constants.appOwnership);
    console.log('🔗 Native Redirect URI:', nativeRedirectUri);
    console.log('=========================\n');
  }, [nativeRedirectUri]);

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Starting Google Sign-Up with direct browser flow...');
      console.log('📍 Redirect URI:', nativeRedirectUri);
      
      // Build the Google OAuth URL manually
      const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!;
      const scopes = ['openid', 'profile', 'email'].join(' ');
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(nativeRedirectUri)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&prompt=select_account`;
      
      console.log('🌐 Opening auth URL...');
      
      // Open the browser and wait for redirect
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        nativeRedirectUri
      );
      
      console.log('📥 Browser result:', result.type);
      
      if (result.type === 'success' && result.url) {
        console.log('✅ Got redirect URL');
        
        // Parse the access token from the URL fragment
        const url = result.url;
        const fragmentIndex = url.indexOf('#');
        
        if (fragmentIndex !== -1) {
          const fragment = url.substring(fragmentIndex + 1);
          const params = new URLSearchParams(fragment);
          const accessToken = params.get('access_token');
          
          if (accessToken) {
            console.log('🎉 Access token extracted successfully!');
            handleGoogleSignIn(accessToken);
          } else {
            console.error('❌ No access token in URL');
            setIsLoading(false);
            Alert.alert('Sign Up Error', 'Failed to get access token from Google.');
          }
        } else {
          console.error('❌ No fragment in URL:', url);
          setIsLoading(false);
          Alert.alert('Sign Up Error', 'Invalid response from Google.');
        }
      } else if (result.type === 'cancel') {
        console.log('👋 User cancelled');
        setIsLoading(false);
      } else if (result.type === 'dismiss') {
        console.log('🚪 Browser dismissed');
        setIsLoading(false);
      } else {
        console.log('❓ Unknown result type:', result.type);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Google Sign-Up error:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to start Google Sign-Up. Please try again.');
    }
  };

  const handleGoogleSignIn = async (token: string) => {
    setIsLoading(true);
    try {
      console.log('🔑 Attempting Google sign in...');
      const result = await googleAuth({
        access_token: token,
      });
      
      if (result.success) {
        console.log('✅ Google authentication successful');
        router.replace('/dashboard');
      } else {
        setIsLoading(false);
        Alert.alert('Sign In Failed', result.message || 'Failed to sign in with Google');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('❌ Google sign in error:', error);
      Alert.alert('Error', 'An unexpected error occurred during Google sign in');
    }
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, paddingHorizontal: 32, justifyContent: 'space-between', paddingTop: 120, paddingBottom: 48 }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 40,
            fontWeight: '700',
            color: '#1F2937',
            textAlign: 'left',
            marginBottom: 24,
            lineHeight: 48
          }}>
            Smarter <Text style={{ color: '#4F7FFF' }}>Health</Text>{' '}Starts Here
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
            onPress={handleGoogleSignUp}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#9CA3AF' : '#1F2937',
              paddingVertical: 18,
              borderRadius: 28,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 12,
              opacity: isLoading ? 0.6 : 1
            }}
          >
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <Path d="M19.8055 10.2292C19.8055 9.55156 19.7501 8.86719 19.6323 8.19531H10.2002V12.0492H15.6014C15.3708 13.2911 14.6376 14.3898 13.5735 15.0875V17.5867H16.8176C18.7107 15.8449 19.8055 13.2722 19.8055 10.2292Z" fill="#4285F4"/>
              <Path d="M10.2002 20.0008C12.9508 20.0008 15.2719 19.1056 16.8246 17.5867L13.5805 15.0875C12.6784 15.6977 11.5282 16.0434 10.2072 16.0434C7.54639 16.0434 5.28545 14.2828 4.48779 11.9094H1.14258V14.4867C2.73779 17.6586 6.31779 20.0008 10.2002 20.0008Z" fill="#34A853"/>
              <Path d="M4.48084 11.9094C4.03084 10.6675 4.03084 9.33672 4.48084 8.09484V5.51758H1.14232C-0.379677 8.55859 -0.379677 12.4453 1.14232 15.4863L4.48084 11.9094Z" fill="#FBBC04"/>
              <Path d="M10.2002 3.95781C11.5977 3.93672 12.9463 4.47266 13.9549 5.43984L16.8316 2.56328C15.1856 0.991406 12.9438 0.126562 10.2002 0.154687C6.31779 0.154687 2.73779 2.49687 1.14258 5.67578L4.48107 8.25234C5.27185 5.87187 7.53951 3.95781 10.2002 3.95781Z" fill="#EA4335"/>
            </Svg>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={{
                color: 'white',
                fontSize: 17,
                fontWeight: '600'
              }}>
                Sign up with Google
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => console.log('Apple sign up')}
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
            <Svg width="20" height="24" viewBox="0 0 20 24" fill="none">
              <Path d="M19.6641 18.0234C19.3203 18.8672 18.9062 19.6406 18.4219 20.3438C17.7344 21.3281 17.1719 22.0156 16.7344 22.4062C16.0469 23.0469 15.3125 23.375 14.5312 23.3906C13.9844 23.3906 13.3281 23.2344 12.5625 22.9219C11.7969 22.6094 11.0938 22.4531 10.4531 22.4531C9.78125 22.4531 9.0625 22.6094 8.29688 22.9219C7.53125 23.2344 6.89062 23.3906 6.375 23.4062C5.625 23.4375 4.875 23.1094 4.125 22.4219C3.65625 22 3.07812 21.2969 2.39062 20.2969C1.64062 19.2188 1.01562 17.9688 0.515625 16.5469C0 15.0312 -0.25 13.5625 -0.25 12.1406C-0.25 10.5156 0.0625 9.10938 0.6875 7.92188C1.1875 6.98438 1.85938 6.23438 2.70312 5.67188C3.54688 5.10938 4.46875 4.82812 5.46875 4.8125C6.03125 4.8125 6.75 4.98438 7.625 5.32812C8.5 5.67188 9.04688 5.84375 9.26562 5.84375C9.42188 5.84375 10.0312 5.64062 11.0938 5.23438C12.0938 4.85938 12.9375 4.70312 13.625 4.76562C15.5625 4.92188 17.0156 5.67188 18 7.01562C16.2812 8.07812 15.4219 9.5625 15.4219 11.4688C15.4219 13.0625 15.9844 14.3906 17.1094 15.4531C17.6094 15.9531 18.1719 16.3438 18.7969 16.625C18.6719 16.9688 18.5469 17.3125 18.4219 17.6562C18.1719 18.4375 17.9219 19.2188 17.6719 20ZM13.7656 0.5C13.7656 1.71875 13.3281 2.85938 12.4531 3.92188C11.3906 5.17188 10.1094 5.89062 8.71875 5.78125C8.70312 5.64062 8.6875 5.5 8.6875 5.35938C8.6875 4.17188 9.1875 2.92188 10.0781 1.89062C10.5234 1.375 11.0938 0.9375 11.7891 0.578125C12.4844 0.21875 13.1406 0.03125 13.7656 0Z" fill="white"/>
            </Svg>
            <Text style={{
              color: 'white',
              fontSize: 17,
              fontWeight: '600'
            }}>
              Sign up with Apple
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
            <Text style={{
              color: '#6B7280',
              fontSize: 15,
              fontWeight: '400'
            }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/signin')}>
              <Text style={{
                color: '#1F2937',
                fontSize: 15,
                fontWeight: '600'
              }}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
