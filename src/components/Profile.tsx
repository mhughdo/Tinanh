import React, { useReducer, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import normalize from 'react-native-normalize';
import useAuth from '@hooks/useAuth';
import fontSize from '@constants/fontSize';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '@constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Button, Text, Toast, Spinner } from 'native-base';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import firebaseAuth from '@react-native-firebase/auth';
import { useAppState } from '@store/appState';
import { AppActionType } from '@reducers/appReducer';
import ImagePicker from 'react-native-image-picker';
import { uploadFileToFireBase, getSmallerImage } from '@utils/index';
import { useNavigation } from '@react-navigation/native';
import { db } from '@utils/index';

const largeImageSize = 800;
const mediumImageSize = 400;
const smallImageSize = 50;
const imagesLength = 6;
const unknownImg = require('../assets/images/unknown.jpg');

// TODO add cache
type ImagesType = {
  [key: number]: {
    uri: string;
    loading: boolean;
  };
};

const initialState = Array.from({ length: imagesLength }).reduce((acc: any, value, idx) => {
  return { ...acc, [idx]: { loading: true } };
}, {}) as ImagesType;

type ImageActionsType =
  | { type: 'ADD_IMAGE'; idx: number; loading: boolean; uri: string }
  | { type: 'ADD_ALL_IMAGES'; images: ImagesType }
  | { type: 'LOAD_IMAGE_SUCCESS'; idx: number };

const imagesReducer = (state: ImagesType, action: ImageActionsType) => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return { ...state, [action.idx]: { loading: action.loading, uri: action.uri } };
    case 'LOAD_IMAGE_SUCCESS': {
      return { ...state, [action.idx]: { ...state[action.idx], loading: false } };
    }
    case 'ADD_ALL_IMAGES':
      return { ...state, ...action.images };
    default:
      throw new Error('Unknown action');
  }
};

const getImageOrder = (fileName: string) => {
  return fileName.split('-')[1];
};

const getImageUrl = async (imageName: string, imageSize: number, auth: any, updated: string) => {
  const imageRef = storage().ref(`${auth?.id}/${imageName}_${imageSize}x${imageSize}`);
  return await getSmallerImage(5, updated, imageRef);
};

const ProfileScreen = () => {
  const [images, imageDispatch] = useReducer(imagesReducer, initialState);
  const { auth } = useAuth();
  const [avatar, setAvatar] = useState(auth?.avatarURL ? { uri: auth.avatarURL } : unknownImg);
  // console.log(images);
  const displayName = auth?.displayName || '';
  const { dispatch } = useAppState();
  const navigation = useNavigation();
  useEffect(() => {
    const getUserImages = async () => {
      const firebaseImages: ImagesType = {};
      const userData = (await db.doc(`users/${auth?.id}`).get()).data();
      const photos = userData?.photos || [];
      Array.from({ length: imagesLength }).forEach((_, idx) => {
        const photo = photos[idx] || {};
        const { medium, thumbnail, uri } = photo;

        firebaseImages[idx] = {
          uri: medium || thumbnail || uri,
          loading: true,
        };
      });
      imageDispatch({ type: 'ADD_ALL_IMAGES', images: firebaseImages });
    };

    getUserImages();
    // getImages();
  }, [auth]);

  const monitorFileUpload = (task: FirebaseStorageTypes.Task, idx: number) => {
    task.on(
      storage.TaskEvent.STATE_CHANGED,
      async (snapshot) => {
        if (snapshot.state === storage.TaskState.SUCCESS) {
          console.log('Image uploaded to the bucket');
          const imageName = snapshot.ref.name;
          const updated = snapshot.metadata.updated;
          const mediumURL = await getImageUrl(imageName, mediumImageSize, auth, updated);
          const smallURL = await getImageUrl(imageName, smallImageSize, auth, updated);
          const bigURL = await getImageUrl(imageName, largeImageSize, auth, updated);
          const uri = mediumURL || bigURL;
          const userRef = db.collection('users').doc(`${auth?.id}`);
          const userData = (await userRef.get()).data();
          delete userData?.photos?.unknown;
          const photos = {
            ...userData?.photos,
            [getImageOrder(imageName)]: {
              thumbnail: smallURL,
              medium: mediumURL,
              uri: bigURL,
            },
          };
          const avatarURL =
            photos[
              Object.keys(photos).find((key) => {
                return photos[key];
              }) || -1
            ]?.medium;

          const shouldUpdateAvatar = avatarURL !== userData?.avatarURL;

          if (typeof avatarURL === 'string' && shouldUpdateAvatar) {
            dispatch({ type: AppActionType.AUTH_CHANGE, auth: { ...auth, avatarURL } });
            setAvatar({ uri: avatarURL });
          }

          userRef.update({
            photos,
            ...(shouldUpdateAvatar && { avatarURL }),
          });
          console.log('aaaaaaaa');
          imageDispatch({ type: 'ADD_IMAGE', idx, uri, loading: false });
        }
      },
      () => {
        return Toast.show({
          text: 'Error uploading image!',
          buttonText: 'Okay',
          type: 'danger',
          duration: 3000,
        });
      },
    );
  };

  const uploadFile = (idx: number) => {
    ImagePicker.launchImageLibrary({ noData: true }, async (response) => {
      if (response.didCancel) {
        console.log('Post canceled');
      } else if (response.error) {
        console.log('An error occurred: ', response.error);
      } else {
        imageDispatch({ type: 'ADD_IMAGE', idx, uri: response.uri, loading: true });
        const task = uploadFileToFireBase(response, `${auth?.id}/${auth?.displayName.replace(/[\s\W]+/g, '')}-${idx}`);
        monitorFileUpload(task, idx);
      }
    });
  };

  const logOut = () => {
    if (auth) {
      dispatch({ type: AppActionType.AUTH_CHANGE, auth: null });
      firebaseAuth()
        .signOut()
        // .then(() => console.log('User signed out!'))
        .catch((error) => console.log('Error logging out', error));
    }
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={avatar} />
        {/* <DefaultAvatar height={normalize(150)} width={normalize(150)} /> */}
      </View>
      <Text style={styles.userName}>{displayName}</Text>
      <View style={styles.photosContainer}>
        <Text style={{ fontSize: normalize(fontSize.base) }}>My photos</Text>
        <View style={styles.photos}>
          {Array.from({ length: 6 }).map((_, idx) => {
            const image = images[idx];

            return (
              <TouchableOpacity key={idx} onPress={() => uploadFile(idx)} style={styles.photo}>
                {image && image.uri ? (
                  <>
                    {image.loading && <Spinner color="#ffffff" />}
                    <Image
                      style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, resizeMode: 'cover' }}
                      onLoad={() => imageDispatch({ type: 'LOAD_IMAGE_SUCCESS', idx })}
                      source={image}
                    />
                  </>
                ) : (
                  <Entypo name="camera" color="white" size={normalize(30)} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('AccountDetailsScreen')} style={styles.settingContainer}>
          <FontAwesome5 name="user-circle" size={23} color={Colors.indigo500} />
          <Text style={{ marginLeft: normalize(15) }}>Account Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')} style={styles.settingContainer}>
          <AntDesign name="setting" size={23} />
          <Text style={{ marginLeft: normalize(15) }}>Settings</Text>
        </TouchableOpacity>
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
    alignSelf: 'center',
    borderRadius: normalize(150 / 2),
    overflow: 'hidden',
    backgroundColor: Colors.mainThemeForegroundColor,
    marginTop: normalize(20),
    height: normalize(150),
    width: normalize(150),
  },
  avatar: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  userName: {
    marginTop: normalize(10),
    textAlign: 'center',
    fontSize: normalize(fontSize.lg),
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
    overflow: 'hidden',
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
