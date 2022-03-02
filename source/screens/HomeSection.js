import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {DataStore, Auth} from 'aws-amplify';
import {User, Match} from '../../src/models';
import Card from '../components/AmityCard/index';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import StackOfCards from '../components/AnimatedStack/index';

const HomeSection = ({loadingUser}) => {
  const [users, setUsers] = useState([]);
  const [matchesID, setMatchesID] = useState([null]);
  const [presentUser, setPresentUser] = useState(null);
  const [userAuthenticated, setUserAuthenticated] = useState(null);

  useEffect(() => {
    if (loadingUser) {
      return;
    }
    const getCurrUser = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, dbU =>
        dbU.sub('eq', user.attributes.sub),
      );

      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setUserAuthenticated(dbUsers[0]);
    };
    getCurrUser();
  }, [loadingUser]);

  useEffect(() => {
    if (!userAuthenticated) {
      return;
    }
    const getMatches = async () => {
      const matchResult = await DataStore.query(Match, mch =>
        mch
          .isMatched('eq', true)
          .or(m1 => m1.User1ID('eq', userAuthenticated.id))
          .User2ID('eq', userAuthenticated.id),
      );
      setMatchesID(
        matchResult.map(match =>
          match.User1ID === userAuthenticated.id ? match.User2 : match.User1,
        ),
      );
    };
    getMatches();
  }, [userAuthenticated]);

  useEffect(() => {
    if (loadingUser || !userAuthenticated || matchesID === null) {
      return;
    }
    const fetchUsers = async () => {
      let usersFetched = await DataStore.query(User, user =>
        user.platforms('eq', userAuthenticated.lookingFor),
      );
      usersFetched = usersFetched.filter(x => !matchesID.includes(x.id));
      setUsers(usersFetched);
    };
    fetchUsers();
  }, [loadingUser, userAuthenticated, matchesID]);

  const onSwipeLeft = () => {
    if (!presentUser || !userAuthenticated) {
      return;
    }
    console.warn('swipe left: ', presentUser.name);
  };

  const onSwipeRight = async () => {
    if (!presentUser || !userAuthenticated) {
      return;
    }

    const myMatches = await DataStore.query(Match, match =>
      match.User1ID('eq', userAuthenticated.id).User2ID('eq', presentUser.id),
    );

    if (myMatches.length > 0) {
      console.warn('Can`t swipe twice on the same gamer');
      return;
    }

    const daMatches = await DataStore.query(Match, match =>
      match.User1ID('eq', userAuthenticated.id).User2ID('eq', presentUser.id),
    );
    if (daMatches.length > 0) {
      console.log('A new gamer approaches');
      const daMatch = daMatches[0];
      DataStore.save(
        Match.copyOf(daMatch, updated => (updated.isMatched = true)),
      );
      return;
    }

    console.warn('This gamer requires your assistance!');
    const newMatch = new Match({
      User1ID: userAuthenticated.id,
      User2ID: presentUser.id,
      isMatched: false,
    });
    console.log(newMatch);
    DataStore.save(newMatch);
  };

  console.log(users);

  return (
    <View style={styles.cardContainer}>
      <StackOfCards
        data={users}
        renderItem={({item}) => <Card user={item} />}
        setPresentUser={setPresentUser}
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
