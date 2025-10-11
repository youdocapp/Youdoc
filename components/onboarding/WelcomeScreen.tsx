import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

interface WelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext, onSkip }) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.iconRow}>
            <View style={styles.iconContainer}>
              <Image 
                source={{ uri: 'https://raw.githubusercontent.com/yourusername/yourrepo/main/assets/images/Icon%201.svg' }}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.iconContainer}>
              <Image 
                source={{ uri: 'https://raw.githubusercontent.com/yourusername/yourrepo/main/assets/images/Icon%202.svg' }}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.iconContainer}>
              <Image 
                source={{ uri: 'https://raw.githubusercontent.com/yourusername/yourrepo/main/assets/images/icon%203.svg' }}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.title}>
            Smarter <Text style={styles.titleHighlight}>Health</Text>{'\n'}Starts Here
          </Text>

          <Text style={styles.subtitle}>
            Youdoc personalizes your experience based on your interests, data, and wearable devices.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            onPress={() => router.push('/signup')}
            style={styles.emailButton}
          >
            <Text style={styles.emailButtonText}>
              Sign up with Email
            </Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Or</Text>

          <TouchableOpacity 
            onPress={() => router.push('/signup')}
            style={styles.googleButton}
          >
            <Text style={styles.socialButtonText}>
              Sign up with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/signup')}
            style={styles.appleButton}
          >
            <Text style={styles.socialButtonText}>
              Sign up with Apple
            </Text>
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signin')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  iconRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: 16,
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  icon: {
    width: 48,
    height: 48,
  },
  title: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: '#1F2937',
    textAlign: 'left' as const,
    marginBottom: 24,
    lineHeight: 48,
  },
  titleHighlight: {
    color: '#4F7FFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'left' as const,
    lineHeight: 24,
  },
  buttonsContainer: {
    gap: 16,
  },
  emailButton: {
    width: '100%',
    backgroundColor: '#4F7FFF',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center' as const,
  },
  emailButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600' as const,
  },
  orText: {
    textAlign: 'center' as const,
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '500' as const,
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#1F2937',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center' as const,
  },
  appleButton: {
    width: '100%',
    backgroundColor: '#1F2937',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center' as const,
  },
  socialButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600' as const,
  },
  signInContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  signInText: {
    fontSize: 15,
    color: '#6B7280',
  },
  signInLink: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600' as const,
  },
});

export default WelcomeScreen;
