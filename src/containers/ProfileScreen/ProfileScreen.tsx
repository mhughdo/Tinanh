import React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '@shared/Header';
import DefaultAvatar from '@images/default-avatar';
import normalize from 'react-native-normalize';
import useAuth from '@hooks/useAuth';
import fontSize from '@constants/fontSize';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '@constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button, Text } from 'native-base';
import firebaseAuth from '@react-native-firebase/auth';
import { useAppState } from '@store/appState';
import { AppActionType } from '@reducers/appReducer';

const ProfileScreen = () => {
  const { auth } = useAuth();
  const displayName = auth?.displayName || '';
  const { dispatch } = useAppState();

  const logOut = () => {
    if (auth) {
      dispatch({ type: AppActionType.AUTH_CHANGE, auth: null });
      firebaseAuth()
        .signOut()
        .then(() => console.log('User signed out!'))
        .catch((error) => console.log('Error logging out', error));
    }
  };

  return (
    <View style={styles.profileContainer}>
      <Header />
      <View style={styles.avatarContainer}>
        <DefaultAvatar height={normalize(150)} width={normalize(150)} />
      </View>
      <Text style={styles.userName}>{displayName}</Text>
      <View style={styles.photosContainer}>
        <Text style={{ fontSize: fontSize.base }}>My photos</Text>
        <View style={styles.photos}>
          {Array.from({ length: 6 }).map((_, idx) => {
            return (
              <View style={styles.photo}>
                <Entypo name="camera" color="white" size={normalize(30)} />
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <View style={styles.settingContainer}>
          <FontAwesome5 name="user-circle" size={23} color={Colors.indigo500} />
          <Text style={{ marginLeft: normalize(15) }}>Account Details</Text>
        </View>
        <View style={styles.settingContainer}>
          <AntDesign name="setting" size={23} />
          <Text style={{ marginLeft: normalize(15) }}>Settings</Text>
        </View>
      </View>
      <View style={styles.logOutButtonContainer}>
        <Button onPress={logOut} style={styles.logOutButton} bordered>
          <Text style={styles.logOutText}>Logout</Text>
        </Button>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileContainer: {
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: normalize(20),
  },
  userName: {
    marginTop: normalize(10),
    textAlign: 'center',
    fontSize: fontSize.lg,
    fontWeight: '500',
  },
  photosContainer: {
    paddingHorizontal: normalize(10),
  },
  photos: {
    flexDirection: 'row',
    marginTop: normalize(10),
    width: '100%',
    flexWrap: 'wrap',
  },
  photo: {
    height: normalize(70),
    marginRight: normalize(10),
    marginBottom: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '23%',
    backgroundColor: Colors.mainThemeForegroundColor,
  },
  settingsContainer: {
    marginTop: normalize(20),
    paddingHorizontal: normalize(30),
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  logOutButtonContainer: {
    paddingHorizontal: normalize(10),
    marginTop: normalize(20),
  },
  logOutButton: {
    borderColor: Colors.grey9,
    justifyContent: 'center',
    borderRadius: 10,
  },
  logOutText: {
    textAlign: 'center',
    color: Colors.mainTextColor,
  },
});
