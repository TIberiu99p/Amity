import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
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
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';

const ROTATE = 60;
const SWIPE_SPEED = 800;

const App = () => {
  const [currIndex, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currIndex + 1);

  const currProfile = users[currIndex];
  const nextProfile = users[nextIndex];

  const {width: screenWidth} = useWindowDimensions();

  const translateX = 2 * screenWidth;

  const translationX = useSharedValue(0);
  const rotation = useDerivedValue(
    () => interpolate(translationX.value, [0, translateX], [0, ROTATE]) + 'deg',
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

  const queCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          translationX.value,
          [-translateX, 0, translateX],
          [1, 0.5, 1],
        ),
      },
    ],
    opacity: interpolate(
      translationX.value,
      [-translateX, 0, translateX],
      [1, 0.6, 1],
    ),
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translationX.value;
    },

    onActive: (event, context) => {
      translationX.value = context.startX + event.translationX;
    },
    onEnd: event => {
      if (Math.abs(event.velocityX) < SWIPE_SPEED) {
        translationX.value = withSpring(0);
        return;
      }
      translationX.value = withSpring(
        translateX * Math.sign(event.velocityX),
        {},
        () => runOnJS(setIndex)(currIndex + 1),
      );
    },
  });
  useEffect(() => {
    translationX.value = 0;
    setNextIndex(currIndex + 1);
  }, [currIndex, translationX]);

  return (
    <View style={styles.cardContainer}>
      {nextProfile && (
        <View style={styles.nextCard}>
          <Animated.View style={(styles.cardAnimation, queCardStyle)}>
            <Card user={nextProfile} />
          </Animated.View>
        </View>
      )}

      {currProfile && (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={(styles.cardAnimation, cardStyle)}>
            <Card user={currProfile} />
          </Animated.View>
        </PanGestureHandler>
      )}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCard: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
