import React from 'react';
import {View, StyleSheet} from 'react-native';
import Card from './source/components/AmityCard';
import users from './TinderAssets/assets/data/users';

const App = () => {
  return (
    <View style={styles.cardContainer}>
      <Card user={users[1]} />
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
