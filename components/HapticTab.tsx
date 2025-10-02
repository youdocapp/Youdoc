import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';

interface HapticTabProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

const HapticTab: React.FC<HapticTabProps> = ({ children, onPress, style }) => {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      console.log('Haptic feedback');
    }
    onPress?.();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      {children}
    </TouchableOpacity>
  );
};

export default HapticTab;
