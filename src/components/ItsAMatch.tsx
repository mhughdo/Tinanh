import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'native-base';
import fontSize from '@constants/fontSize';
import normalize from 'react-native-normalize';
import Colors from '@constants/Colors';

const ItsAMatch = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Image style={styles.image} source={require('../assets/images/profile_images/13.png')} />
      <View style={styles.actionsContainer}>
        <Text style={styles.matchText}>It's a match</Text>
        <Button style={styles.sendMessageButton}>
          <Text style={styles.sendMessageText}>Send a message</Text>
        </Button>
        <Button onPress={() => navigation.goBack()} transparent>
          <Text style={styles.keepSwipingText}>Keep swiping</Text>
        </Button>
      </View>
    </View>
  );
};

export default ItsAMatch;

const styles = StyleSheet.create({
  actionsContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: normalize(200),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  matchText: {
    fontSize: normalize(fontSize['3xl']),
    marginBottom: normalize(30),
    fontWeight: '500',
    textTransform: 'uppercase',
    color: Colors.green500,
  },
  sendMessageButton: {
    backgroundColor: Colors.mainThemeForegroundColor,
    borderRadius: normalize(10),
    width: '80%',
    justifyContent: 'center',
  },
  sendMessageText: {
    textTransform: 'uppercase',
  },
  keepSwipingText: {
    textTransform: 'uppercase',
    color: 'white',
  },
});
