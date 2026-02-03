import { View, StyleSheet, ViewStyle, Platform, StyleProp, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  variant?: 'elevated' | 'outlined' | 'flat';
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 16,
  variant = 'elevated',
  onPress,
}) => {
  const { colors, isDark } = useTheme();

  const getBackgroundColor = () => {
    return colors.card;
  };

  const getBorder = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: colors.border,
      };
    }
    return {};
  };

  const getShadow = () => {
    if (variant === 'elevated' && !isDark) {
      return styles.shadow;
    }
    return {};
  };

  const cardStyle = [
    styles.container,
    { backgroundColor: getBackgroundColor(), padding },
    getBorder(),
    getShadow(),
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      },
    }),
  },
});
