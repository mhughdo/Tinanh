import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Text } from 'native-base';
import fontSize from '@constants/fontSize';
import normalize from 'react-native-normalize';
import Colors from '@constants/Colors';
import ProgressiveImage from './ProgressiveImage';

const ItsAMatch = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, messageBoxID } = route.params;
  const image =
    user.photos[
      Object.keys(user.photos).find((key) => {
        return user.photos[key];
      }) || -1
    ];
  const imageSource = image?.uri ? { uri: image.uri } : require('../assets/images/unknown.png');
  const thumbnailSource = image?.thumbnail ? { uri: image.thumbnail } : require('../assets/images/unknown.png');

  const navigateToMessageBox = () => {
    navigation.navigate('MainTabs', {
      screen: 'Message',
      params: {
        screen: 'MessageBox',
        params: {
          user,
          messageBoxID,
        },
      },
    });
  };

  return (
    <View>
      <ProgressiveImage style={styles.image} thumbnailSource={thumbnailSource} source={imageSource} />
      <View style={styles.actionsContainer}>
        <Text style={styles.matchText}>It's a match</Text>
        <Button onPress={navigateToMessageBox} style={styles.sendMessageButton}>
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
