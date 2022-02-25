import React from 'react';
import {View, StyleSheet, Text, SafeAreaView, Pressable} from 'react-native';
import {Auth} from 'aws-amplify';

const UserScreenProfile = () => {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Pressable onPress={() => Auth.signOut()}>
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
});

export default UserScreenProfile;
