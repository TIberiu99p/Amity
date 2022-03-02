import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Auth, DataStore, Storage} from 'aws-amplify';
import {User} from '../../src/models';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {S3Image} from 'aws-amplify-react-native/dist/Storage';
import {request, PERMISSIONS} from 'react-native-permissions';

const UserScreenProfile = () => {
  const [user, setUser] = useState(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [platformGame, setPlatformGame] = useState();
  const [platformWanted, setPlatformWanted] = useState();
  const [gameType, setGameType] = useState();
  const [gameTypeWanted, setGameTypeWanted] = useState();

  const [imageUriDevice, setNewImageUriDevice] = useState(null);

  useEffect(() => {
    const permit =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MEDIA_LIBRARY
        : PERMISSIONS.ANDROID.CAMERA;
    request(permit).then(statuses => {
      console.log(statuses);
    });
  }, []);

  useEffect(() => {
    const getCurrUser = async () => {
      const userAu = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, dbU =>
        dbU.sub('eq', userAu.attributes.sub),
      );

      if (!dbUsers || dbUsers.length === 0) {
        console.warn('New gamer joined');
        return;
      }
      const dbUser = dbUsers[0];
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

  const getImage = async () => {
    try {
      const response = await fetch(imageUriDevice);
      const blob = await response.blob();
      const urlParts = imageUriDevice.split('.');
      const extension = urlParts[urlParts.length - 1];
      const key = `${user.id}.${extension}`;
      await Storage.put(key, blob);
      return key;
    } catch (e) {
      console.log(e);
    }
    return '';
  };

  const save = async () => {
    if (!invalid()) {
      console.warn('Invalid');
      return;
    }

    let newImageUri;
    if (imageUriDevice) {
      newImageUri = await getImage();
    }

    if (user) {
      const updateUser = User.copyOf(user, updated => {
        updated.name = name;
        updated.bio = bio;
        updated.platformGame = platformGame;
        updated.platformWanted = platformWanted;
        updated.gameType = gameType;
        updated.gameTypeWanted = gameTypeWanted;
        if (newImageUri) {
          updated.image = newImageUri;
        }
      });

      await DataStore.save(updateUser);
      setNewImageUriDevice(null);
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

  const selectImage = () => {
    launchImageLibrary(
      {mediaType: 'mixed'},
      ({didCancel, errorCode, errorMessage, assets}) => {
        if (didCancel || !errorCode) {
          console.warn('cancel or error');
          return;
        }
        setNewImageUriDevice(assets[0].uri);
      },
    );
  };

  const exitOut = async () => {
    await DataStore.clear();
    Auth.signOut();
  };

  const renderPic = () => {
    if (imageUriDevice) {
      return <Image source={{uri: imageUriDevice}} style={styles.image} />;
    }
    if (user?.image?.startsWith('http')) {
      return <Image source={{uri: user?.image}} style={styles.image} />;
    }
    return <S3Image key={user?.image} style={styles.image} />;
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView style={styles.container}>
        {renderPic()}
        <Pressable onPress={selectImage}>
          <Text>Select image</Text>
        </Pressable>
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

        <Pressable onPress={exitOut} style={styles.buttonUser}>
          <Text>Sign out</Text>
        </Pressable>
      </ScrollView>
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default UserScreenProfile;
