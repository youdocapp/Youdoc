import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

interface CarepointScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

const CarepointScreen: React.FC<CarepointScreenProps> = ({ onNext, onSkip }) => {

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
            lineHeight: 26
          }}>
            Youdoc personalizes your experience based on your interests, data, and wearable devices.
          </Text>
        </View>

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32, gap: 8 }}>
            <View style={{ width: 32, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }} />
            <View style={{ width: 32, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }} />
            <View style={{ width: 32, height: 4, backgroundColor: '#4F7FFF', borderRadius: 2 }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={onSkip}>
              <Text style={{ fontSize: 17, color: '#6B7280', fontWeight: '500' }}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onNext}
              style={{
                backgroundColor: '#4F7FFF',
                paddingVertical: 16,
                paddingHorizontal: 48,
                borderRadius: 28,
                alignItems: 'center'
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 17,
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

export default CarepointScreen;
