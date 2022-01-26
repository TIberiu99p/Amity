import 'react-native-gesture-handler';
import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import Card from './source/components/AmityCard';
import users from './TinderAssets/assets/data/users';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const App = () => {
  const shareValue = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: shareValue.value * 500 - 250,
      },
    ],
  }));

  return (
    <View style={styles.cardContainer}>
      <Animated.View style={(styles.cardAnimation, cardStyle)}>
        <Card user={users[2]} />
      </Animated.View>
      <Pressable onPress={() => (shareValue.value = withSpring(Math.random()))}>
        <Text>Change value</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  cardAnimation: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
