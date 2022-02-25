import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, StyleSheet, Pressable, SafeAreaView} from 'react-native';

import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Amplify from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native';
import config from './src/aws-exports';

import HomeSection from './source/screens/HomeSection';
import MatchesSection from './source/screens/MatchesSection';
import UserScreenProfile from './source/screens/UserScreenProfile';

Amplify.configure(config);

const App = () => {
  const [selectedSection, setSection] = useState('HOME');

  const unselectedColour = '#9c99a1';
  const selectedColour = '#3d0696';
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
        {selectedSection === 'HOME' && <HomeSection />}
        {selectedSection === 'CHAT' && <MatchesSection />}
        {selectedSection === 'USER_PROFILE' && <UserScreenProfile />}
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
