import React from 'react';
import { StyleSheet, Animated } from 'react-native';

const HelloWave: React.FC = () => {
  const waveAnimation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [waveAnimation]);

  const rotation = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg']
  });

  const styles = StyleSheet.create({
    wave: {
      fontSize: 28
    }
  });

  return (
    <Animated.Text
      style={[
        styles.wave,
        {
          transform: [{ rotate: rotation }]
        }
      ]}
    >
      👋
    </Animated.Text>
  );
};

export default HelloWave;
