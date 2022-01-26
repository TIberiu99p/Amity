import 'react-native-gesture-handler';
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Card from './source/components/AmityCard';
import users from './TinderAssets/assets/data/users';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedGestureHandler,
  interpolate,
} from 'react-native-reanimated';
import { PanGestureHandler} from 'react-native-gesture-handler';

const App = () => {
  const {width: screenWidth} = useWindowDimensions();
  const translationX = useSharedValue(0);
  const rotation = useDerivedValue(
    () => interpolate(translationX.value, [0, screenWidth], [0, 60]) + 'deg',
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX.value,
      },
      {
        rotate: rotation.value,
      },
    ],
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translationX.value;
    },

    onActive: (event, context) => {
      translationX.value = context.startX + event.translationX;
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
