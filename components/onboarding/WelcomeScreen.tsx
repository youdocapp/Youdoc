import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

interface WelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext, onSkip }) => {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, paddingHorizontal: 32, justifyContent: 'space-between', paddingTop: 100, paddingBottom: 48 }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 36,
            fontWeight: '700',
            color: '#1F2937',
            textAlign: 'left',
            marginBottom: 20,
            lineHeight: 44
          }}>
            Welcome to{' '}
            <Text style={{ color: '#4F7FFF' }}>YouDoc</Text>
          </Text>

          <Text style={{
            fontSize: 16,
            color: '#6B7280',
            textAlign: 'left',
            lineHeight: 24
          }}>
            Your all-in-one health companion for trusted medical advice, remedies, and symptom checking—right at your fingertips.
          </Text>
        </View>

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 32, gap: 8 }}>
            <View style={{ width: 32, height: 4, backgroundColor: '#4F7FFF', borderRadius: 2 }} />
            <View style={{ width: 32, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }} />
            <View style={{ width: 32, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={onSkip}>
              <Text style={{ fontSize: 16, color: '#6B7280', fontWeight: '500' }}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onNext}
              style={{
                backgroundColor: '#4F7FFF',
                paddingVertical: 14,
                paddingHorizontal: 40,
                borderRadius: 24,
                alignItems: 'center'
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 16,
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
