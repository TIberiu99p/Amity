import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Image} from 'react-native';
import users from '../../TinderAssets/assets/data/users';
import {DataStore, Auth} from 'aws-amplify';
import {Match, User} from '../../src/models';

const MatchesSection = () => {
  const [matches, setMatches] = useState([]);
  const [userAuthenticated, setUserAuthenticated] = useState(null);

  const getCurrUser = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const dbUsers = await DataStore.query(
      User,
      dbU => dbU.sub === user.attributes.sub,
    );

    if (dbUsers.length < 0) {
      return;
    }
    setUserAuthenticated(dbUsers[0]);
  };

  useEffect(() => getCurrUser(), []);

  useEffect(() => {
    if (!userAuthenticated) {
      return;
    }
    const getMatches = async () => {
      const matchResult = await DataStore.query(Match, mch =>
        mch
          .or(m1 => m1.User1ID('eq', userAuthenticated.id))
          .User2ID('eq', userAuthenticated.id),
      );
      setMatches(matchResult);
      console.log(matchResult);
    };
    getMatches();
  }, [userAuthenticated]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={{fontWeight: 'bold', fontSize: 24, color: '#8238cb'}}>
          Matches
        </Text>
        <View style={styles.users}>
          {matches.map(match => (
            <View style={styles.user} key={match.User1.id}>
              <Image source={{uri: match.User1.image}} style={styles.image} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  container: {
    padding: 10,
  },
  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  user: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 50,

    borderWidth: 4,
    padding: 2,
    borderColor: '#cb3881',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});

export default MatchesSection;
