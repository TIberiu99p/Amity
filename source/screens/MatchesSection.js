import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Image} from 'react-native';
import {DataStore, Auth} from 'aws-amplify';
import {Match, User} from '../../src/models';

const MatchesSection = () => {
  const [matches, setMatches] = useState([]);
  const [userAuthenticated, setUserAuthenticated] = useState(null);

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

  useEffect(() => getCurrUser(), []);

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
      setMatches(matchResult);
      console.log(matchResult);
    };
    getMatches();
  }, [userAuthenticated]);

  useEffect(() => {
    const subscription = DataStore.observe(Match).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);

      if (msg.opType === 'UPDATE') {
        const newMatch = msg.element;
        if (
          newMatch.isMatched &&
          (newMatch.User1ID === userAuthenticated.id ||
            newMatch.User2ID === userAuthenticated.id)
        ) {
          console.log('A gamer is waiting for your words gamer!');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [userAuthenticated]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={{fontWeight: 'bold', fontSize: 24, color: '#8238cb'}}>
          Matches
        </Text>
        <View style={styles.users}>
          {matches.map(match => {
            const indexUser =
              match.User1.id === userAuthenticated ? match.User2 : match.User1;
            if (!match.User1 || !match.User2) {
              return (
                <View style={styles.user} key={indexUser.id}>
                  <Image source={{uri: indexUser.image}} style={styles.image} />
                  <Text style={styles.name}>{indexUser.name}</Text>
                </View>
              );
            }
            return (
              <View style={styles.user} key={indexUser.id}>
                <Image source={{uri: indexUser.image}} style={styles.image} />
                <Text style={styles.name}>{indexUser.name}</Text>
              </View>
            );
          })}
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
  name: {
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
});

export default MatchesSection;
