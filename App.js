import 'react-native-gesture-handler';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Card from './source/components/AmityCard';
import users from './TinderAssets/assets/data/users';

import StackOfCards from './source/components/AnimatedStack/index';

const App = () => {
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
  },
});

export default App;
