import React, {useState, useEffect} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
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
import Like from '../../../TinderAssets/assets/images/LIKE.png';
import Nope from '../../../TinderAssets/assets/images/nope.png';

const ROTATE = 60;
const SWIPE_SPEED = 800;

const StackOfCards = props => {
  const {data, renderItem, onSwipeRight, onSwipeLeft} = props;

  const [currIndex, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currIndex + 1);

  const currProfile = data[currIndex];
  const nextProfile = data[nextIndex];

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
      [1, 0.5, 1],
    ),
  }));

  const yesStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translationX.value, [0, translateX / 5], [0, 1]),
  }));

  const noStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translationX.value, [0, -translateX / 5], [0, 1]),
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

      const onSwipe = event.velocityX > 0 ? onSwipeRight : onSwipeLeft;
      onSwipe && runOnJS(onSwipe)(currProfile);
    },
  });

  useEffect(() => {
    translationX.value = 0;
    setNextIndex(currIndex + 1);
  }, [currIndex, translationX]);

  return (
    <View style={styles.rootContainer}>
      {nextProfile ? (
        <View style={styles.nextCard}>
          <Animated.View style={(styles.cardAnimation, queCardStyle)}>
            {renderItem({item: nextProfile})}
          </Animated.View>
        </View>
      ) : null}

      {currProfile ? (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={(styles.cardAnimation, cardStyle)}>
            <Animated.Image
              source={Like}
              // eslint-disable-next-line react-native/no-inline-styles
              style={[styles.like, {right: 10}, yesStyle]}
              resizeMode="contain"
            />
            <Animated.Image
              source={Nope}
              // eslint-disable-next-line react-native/no-inline-styles
              style={[styles.like, {left: 10}, noStyle]}
              resizeMode="contain"
            />
            {renderItem({item: currProfile})}
          </Animated.View>
        </PanGestureHandler>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  cardAnimation: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCard: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  like: {
    width: 140,
    height: 200,
    position: 'absolute',
    top: 10,
    zIndex: 1,
  },
  nope: {},
});

export default StackOfCards;
