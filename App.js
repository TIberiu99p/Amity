import 'react-native-gesture-handler';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import HomeSection from './source/screens/HomeSection';
import MatchesSection from './source/screens/MatchesSection';

const App = () => {
  return (
    <View style={styles.cardContainer}>
      <MatchesSection/>
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
