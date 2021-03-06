import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Amplify, {Hub} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native';
import config from './src/aws-exports';

import HomeSection from './source/screens/HomeSection';
import MatchesSection from './source/screens/MatchesSection';
import UserScreenProfile from './source/screens/UserScreenProfile';

Amplify.configure({
  ...config,
  Analystic: {
    disabled: true,
  },
});

const App = () => {
  const [selectedSection, setSection] = useState('HOME');
  const [loadingUser, setLoading] = useState(true);

  const unselectedColour = '#9c99a1';
  const selectedColour = '#3d0696';

  useEffect(() => {
    //Create listener
    const listener = Hub.listen('datastore', async hubData => {
      const {event, data} = hubData.payload;
      if (event === 'modelSynced' && data?.model?.name === 'User') {
        console.log('Model has been successfully synced');
        setLoading(false);
      }
    });

    return () => listener();
  }, []);

  const loadAssetPage = () => {
    if (selectedSection === 'HOME') {
      return <HomeSection loadingUser={loadingUser} />;
    }
    if (loadingUser) {
      return <ActivityIndicator style={{flex: 1}} />;
    }
    if (selectedSection === 'CHAT') {
      return <MatchesSection />;
    }
    if (selectedSection === 'USER_PROFILE') {
      return <UserScreenProfile />;
    }
  };

  return (
    <SafeAreaView style={styles.safeRoot}>
      <View style={styles.cardContainer}>
        <View style={styles.topBarIcons}>
          <Pressable onPress={() => setSection('HOME')}>
            <FontAwesome5Brands
              name="fantasy-flight-games"
              size={35}
              color={
                selectedSection === 'HOME' ? selectedColour : unselectedColour
              }
            />
          </Pressable>

          <MaterialCommunityIcons
            name="puzzle-star"
            size={35}
            color={unselectedColour}
          />

          <Pressable onPress={() => setSection('CHAT')}>
            <MaterialCommunityIcons
              name="sword-cross"
              size={35}
              color={
                selectedSection === 'CHAT' ? selectedColour : unselectedColour
              }
            />
          </Pressable>

          <Pressable onPress={() => setSection('USER_PROFILE')}>
            <FontAwesome5
              name="user-astronaut"
              size={35}
              color={
                selectedSection === 'USER_PROFILE'
                  ? selectedColour
                  : unselectedColour
              }
            />
          </Pressable>
        </View>

        {loadAssetPage()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
  },
  topBarIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default withAuthenticator(App);
