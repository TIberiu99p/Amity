import React from 'react';
import {View, StyleSheet} from 'react-native';
import Card from '../components/AmityCard/index';
import users from '../../TinderAssets/assets/data/users';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
      <View style={styles.bottomIcons}>
        <View style={styles.buttonIcon}>
          <Ionicons name="ios-arrow-undo-circle" size={35} color={'#000'} />
        </View>
        <View style={styles.buttonIcon}>
          <Foundation name="x-circle" size={35} color={'#000'} />
        </View>
        <View style={styles.buttonIcon}>
          <FontAwesome name="superpowers" size={35} color={'#000'} />
        </View>
        <View style={styles.buttonIcon}>
          <MaterialCommunityIcons name="pokeball" size={35} color={'#000'} />
        </View>
        <View style={styles.buttonIcon}>
          <MaterialCommunityIcons name="pirate" size={35} color={'#000'} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#78658f',
  },
  bottomIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  buttonIcon: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 7.8,
    borderRadius: 50,
  },
});

export default HomeSection;
