import React from 'react';
import {View, StyleSheet} from 'react-native';
import Card from '../components/AmityCard/index';
import users from '../../TinderAssets/assets/data/users';

import StackOfCards from '../components/AnimatedStack/index';

const HomeSection = () => {
  const onSwipeLeft = user => {
    console.warn('swipe left: ', user.name);
  };

  const onSwipeRight = user => {
    console.warn('swipe right: ', user.name);
  };

  return (
    <View style={styles.cardContainer}>
      <StackOfCards
        data={users}
        renderItem={({item}) => <Card user={item} />}
        onSwipeRight={onSwipeRight}
        onSwipeLeft={onSwipeLeft}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
});

export default HomeSection;
