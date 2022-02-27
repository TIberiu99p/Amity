import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Auth, DataStore} from 'aws-amplify';
import {User, Users} from '../../src/models';

const UserScreenProfile = () => {
  const [user, setUser] = useState(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [platformGame, setPlatformGame] = useState();
  const [platformWanted, setPlatformWanted] = useState();
  const [gameType, setGameType] = useState();
  const [gameTypeWanted, setGameTypeWanted] = useState();

  useEffect(() => {
    const getCurrUser = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const dbUserS = await DataStore.query(
        User,
        dbU => dbU.sub === user.attributes.sub,
      );

      if (dbUser.length < 0) {
        return;
      }
      const dbUser = dbUser[0];
      setUser(dbUser);
      setName(dbUser.name);
      setBio(dbUser.bio);
      setGameType(dbUser.gameType);
      setPlatformGame(dbUser.platformGame);
      setGameTypeWanted(dbUser.gameTypeWanted);
      setPlatformWanted(dbUser.platformWanted);
    };
    getCurrUser();
  }, []);

  const invalid = () => {
    return name && bio && platformGame && platformWanted;
  };

  const save = async () => {
    if (!invalid()) {
      console.warn('Invalid');
      return;
    }

    if (user) {
      const updateUser = User.copyOf(user, updated => {
        updated.name = name;
        updated.bio = bio;
        updated.platformGame = platformGame;
        updated.platformWanted = platformWanted;
        updated.gameType = gameType;
        updated.gameTypeWanted = gameTypeWanted;
      });

      await DataStore.save(updateUser);
    } else {
      const authUser = await Auth.currentAuthenticatedUser();
      const newUser = new User({
        sub: authUser.attributes.sub,
        name,
        bio,
        platformGame,
        platformWanted,
        gameType,
        gameTypeWanted,
        image:
          'https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/04/Ichigo.jpg?q=50&fit=crop&w=960&h=500&dpr=1.5',
      });

      await DataStore.save(newUser);
    }

    Alert.alert('Gamer settings have been set');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <TextInput
          style={styles.inputTxt}
          placeholder="Name---"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.inputTxt}
          placeholder="bio---"
          multiline
          numberOfLines={3}
          value={bio}
          onChangeText={setBio}
        />

        <Text>Platform I am playing</Text>
        <Picker
          label="Platform"
          selectedValue={platformGame}
          onValueChange={itemValue => setPlatformGame(itemValue)}>
          <Picker.Item label="Playstation" value="PLAYSTATION" />
          <Picker.Item label="Xbox" value="XBOX" />
          <Picker.Item label="Pc" value="PC" />
        </Picker>

        <Text>Gametype I am playing</Text>
        <Picker
          label="Gametype"
          selectedValue={gameType}
          onValueChange={itemValue => setGameType(itemValue)}>
          <Picker.Item label="fps" value="FPS" />
          <Picker.Item label="mmorpg" value="MMORPG" />
          <Picker.Item label="sandbox" value="SANDBOX" />
          <Picker.Item label="pvp" value="PVP" />
          <Picker.Item label="pve" value="PVE" />
          <Picker.Item label="moba" value="MOBA" />
        </Picker>

        <Text>Platform I am looking to play with</Text>
        <Picker
          label="Looking for platform"
          selectedValue={platformWanted}
          onValueChange={itemValue => setPlatformWanted(itemValue)}>
          <Picker.Item label="Playstation" value="PLAYSTATION" />
          <Picker.Item label="Xbox" value="XBOX" />
          <Picker.Item label="Pc" value="PC" />
        </Picker>

        <Text>Gametype I am looking to play with</Text>
        <Picker
          label="Looking for gametype"
          selectedValue={gameTypeWanted}
          onValueChange={itemValue => setGameTypeWanted(itemValue)}>
          <Picker.Item label="fps" value="FPS" />
          <Picker.Item label="mmorpg" value="MMORPG" />
          <Picker.Item label="sandbox" value="SANDBOX" />
          <Picker.Item label="pvp" value="PVP" />
          <Picker.Item label="pve" value="PVE" />
          <Picker.Item label="moba" value="MOBA" />
        </Picker>

        <Pressable onPress={save} style={styles.buttonUser}>
          <Text>Save changes</Text>
        </Pressable>

        <Pressable onPress={() => Auth.signOut()} style={styles.buttonUser}>
          <Text>Sign out</Text>
        </Pressable>
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
  buttonUser: {
    backgroundColor: '#63c767',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
  inputTxt: {
    margin: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
});

export default UserScreenProfile;
