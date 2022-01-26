import 'react-native-gesture-handler';
import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import Card from './source/components/AmityCard';
import users from './TinderAssets/assets/data/users';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler} from 'react-native-gesture-handler';

const App = () => {
  const translationX= useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX.value,
      },
    ],
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      console.log('Touch is working');
    },

    onActive: (event,context) => {
      translationX.value = event.translationX;
    },
    onEnd: () => {
      console.log('Touch ended');
    },
  });

  return (
    <View style={styles.cardContainer}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={(styles.cardAnimation, cardStyle)}>
          <Card user={users[2]} />
        </Animated.View>
      </PanGestureHandler>
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
