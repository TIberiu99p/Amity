import 'react-native-gesture-handler';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Card from './source/components/AmityCard';
import users from './TinderAssets/assets/data/users';

import StackCards from './source/components/AnimatedStack';

const App = () => {
  return (
    <View style={styles.cardContainer}>
      <StackCards data={users} renderItem={({item}) => <Card user={item} />} />;
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
