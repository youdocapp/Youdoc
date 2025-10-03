import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';

interface WelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext, onSkip }) => {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingTop: 60, paddingBottom: 40 }}>
        <View style={{ flex: 1, justifyContent: 'center', paddingTop: 60 }}>
          <Text style={{
            fontSize: 32,
            fontWeight: '700',
            color: '#1F2937',
            textAlign: 'left',
            marginBottom: 16,
            lineHeight: 40
          }}>
            Welcome to{' '}
            <Text style={{ color: '#4F7FFF' }}>YouDoc</Text>
          </Text>

          <Text style={{
            fontSize: 15,
            color: '#6B7280',
            textAlign: 'left',
            lineHeight: 22
          }}>
            Your all-in-one health companion for trusted medical advice, remedies, and symptom checking—right at your fingertips.
          </Text>
        </View>

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 24, gap: 6 }}>
            <View style={{ width: 24, height: 3, backgroundColor: '#4F7FFF', borderRadius: 2 }} />
            <View style={{ width: 24, height: 3, backgroundColor: '#E5E7EB', borderRadius: 2 }} />
            <View style={{ width: 24, height: 3, backgroundColor: '#E5E7EB', borderRadius: 2 }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={onSkip}>
              <Text style={{ fontSize: 15, color: '#9CA3AF', fontWeight: '500' }}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onNext}
              style={{
                backgroundColor: '#4F7FFF',
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: 20,
                alignItems: 'center'
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 15,
                fontWeight: '600'
              }}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
