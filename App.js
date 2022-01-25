import React from 'react';
import {Text, Image,ImageBackground, View, StyleSheet} from 'react-native';

const App = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <ImageBackground
          source={{
            uri: 'https://i.pinimg.com/736x/78/ae/68/78ae68dd0a3544d2fcb205c7afe66d60.jpg',
          }}
          style={styles.image}>
          <View style={styles.cardInfo}>
            <Text style={styles.name}>Ichigo Kurosaki</Text>
            <Text style={styles.bio}>Bankai and that</Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  card: {
    width: '95%',
    height: '70%',
    borderRadius: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',

    justifyContent: 'flex-end',
  },
  cardInfo: {
    padding: 10,
  },
  name: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 18,
    color: 'white',
    lineHeight: 25,
  },
});

export default App;
