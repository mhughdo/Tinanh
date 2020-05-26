/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Text, Button } from 'native-base';
import normalize from 'react-native-normalize';
import colors from '@constants/Colors';
import fontSize from '@constants/fontSize';

import Logo from '@images/Logo';

const OpeningScreen = ({ navigation: { navigate } }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Logo height={150} width={150} style={{ alignSelf: 'center' }} />
      </View>
      <View style={styles.textsContainer}>
        <Text style={styles.Heading}>Find your soul mate</Text>
        <Text style={styles.subHeading}>Match and chat with people you like from your area</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button onPress={() => navigate('LogIn')} style={styles.logInButton} rounded>
          <Text style={styles.logInText}>Log In</Text>
        </Button>
        <Button onPress={() => navigate('SignUp')} style={styles.signUpButton} rounded bordered>
          <Text style={styles.signUpText}>Sign Up</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default OpeningScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    height: normalize(250),
    justifyContent: 'center',
  },
  textsContainer: {
    paddingHorizontal: normalize(66),
    // borderWidth: 2,
  },
  Heading: {
    textAlign: 'center',
    color: colors.mainThemeForegroundColor,
    fontSize: fontSize.xxl,
    fontWeight: '500',
  },
  subHeading: {
    marginTop: normalize(15),
    fontSize: fontSize.base,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: normalize(66),
    // borderWidth: 2,
  },
  logInButton: {
    backgroundColor: colors.mainThemeForegroundColor,
    justifyContent: 'center',
    marginTop: normalize(40),
    marginBottom: normalize(20),
  },
  signUpButton: {
    borderColor: colors.mainThemeForegroundColor,

    justifyContent: 'center',
  },
  signUpText: {
    color: colors.mainThemeForegroundColor,
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  logInText: {
    fontSize: fontSize.base,
    fontWeight: '500',
  },
});
